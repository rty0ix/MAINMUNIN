import axios from 'axios';
import { supabase } from './supabase';
import { getDeepSeek } from './deepseek';
import type { Message, ChatSession } from '../types';

export const uploadDocument = async (file: File) => {
  try {
    // First upload the file to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('chat-attachments')
      .upload(`${Date.now()}-${file.name}`, file);

    if (uploadError) throw uploadError;

    // Get the public URL
    const { data: { publicUrl }, error: urlError } = supabase
      .storage
      .from('chat-attachments')
      .getPublicUrl(uploadData.path);

    if (urlError) throw urlError;

    // Process the document based on type
    let content = '';
    if (file.type === 'application/pdf') {
      content = await processPDFDocument(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      content = await processWordDocument(file);
    } else if (file.type === 'text/plain') {
      content = await file.text();
    }

    // Get embeddings from DeepSeek
    const deepseek = getDeepSeek();
    const response = await deepseek.chat(`Analyze this document and provide a summary: ${content}`);

    return {
      url: publicUrl,
      summary: response.text,
      filename: file.name
    };
  } catch (error) {
    console.error('Error processing document:', error);
    throw error;
  }
};

const processPDFDocument = async (file: File): Promise<string> => {
  // For now, return a placeholder since we can't process PDFs in the browser
  return `PDF content from ${file.name}`;
};

const processWordDocument = async (file: File): Promise<string> => {
  // For now, return a placeholder since we can't process Word docs in the browser
  return `Word document content from ${file.name}`;
};

export const saveChatSession = async (sessionId: string, messages: Message[], title: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { error } = await supabase
      .from('chat_sessions')
      .upsert({
        id: sessionId,
        user_id: user.id,
        title,
        messages,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving chat session:', error);
    throw error;
  }
};

export const loadChatSessions = async (): Promise<ChatSession[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    
    return data.map(session => ({
      id: session.id,
      title: session.title || 'New Chat',
      messages: session.messages || [],
      created_at: session.created_at,
      updated_at: session.updated_at
    }));
  } catch (error) {
    console.error('Error loading chat sessions:', error);
    return [];
  }
};