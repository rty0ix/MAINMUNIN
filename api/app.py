from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from supabase import create_client, Client
import fitz  # PyMuPDF
import docx
import requests
from typing import List, Dict
import tempfile

app = Flask(__name__)
CORS(app)

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from a PDF file."""
    text = []
    with fitz.open(file_path) as pdf:
        for page in pdf:
            text.append(page.get_text())
    return "\n".join(text)

def extract_text_from_docx(file_path: str) -> str:
    """Extract text from a DOCX file."""
    doc = docx.Document(file_path)
    return "\n".join([paragraph.text for paragraph in doc.paragraphs])

def process_document(file_data: bytes, filename: str) -> str:
    """Process document and extract text."""
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(file_data)
        temp_file.flush()
        
        if filename.lower().endswith('.pdf'):
            text = extract_text_from_pdf(temp_file.name)
        elif filename.lower().endswith('.docx'):
            text = extract_text_from_docx(temp_file.name)
        else:
            text = file_data.decode('utf-8')  # For plain text files
            
        os.unlink(temp_file.name)
        return text

def store_document(text: str, filename: str) -> str:
    """Store document text in Supabase."""
    result = supabase.table('documents').insert({
        'content': text,
        'filename': filename,
        'processed_at': 'now()'
    }).execute()
    
    return result.data[0]['id']

def get_relevant_context(question: str) -> str:
    """Retrieve relevant context from stored documents."""
    result = supabase.rpc(
        'search_documents',
        {'query_text': question, 'similarity_threshold': 0.2, 'max_results': 5}
    ).execute()
    
    contexts = [doc['content'] for doc in result.data]
    return "\n\n".join(contexts)

@app.route('/api/upload', methods=['POST'])
def upload_document():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
        
    try:
        file_data = file.read()
        text = process_document(file_data, file.filename)
        doc_id = store_document(text, file.filename)
        
        return jsonify({
            'message': 'Document processed successfully',
            'document_id': doc_id
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ask', methods=['POST'])
def ask_question():
    data = request.json
    if not data or 'question' not in data:
        return jsonify({'error': 'No question provided'}), 400
        
    try:
        # Get relevant context
        context = get_relevant_context(data['question'])
        
        # Create prompt with context
        prompt = f"""Answer this question using ONLY the context below. If the answer cannot be found in the context, say "I cannot find information about that in the available documents."

Context:
{context}

Question: {data['question']}

Answer:"""
        
        # Call DeepSeek API
        response = requests.post(
            "https://api.deepseek.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {os.getenv('DEEPSEEK_API_KEY')}"},
            json={
                "model": "deepseek-chat",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7,
                "max_tokens": 1000
            }
        )
        
        return jsonify({
            "answer": response.json()["choices"][0]["message"]["content"],
            "context_used": bool(context)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)