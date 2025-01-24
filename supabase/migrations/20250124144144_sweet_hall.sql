/*
  # Document Storage and Vector Search Setup

  1. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `content` (text)
      - `filename` (text)
      - `processed_at` (timestamptz)
      - `embedding` (vector)

  2. Security
    - Enable RLS on `documents` table
    - Add policies for authenticated users
*/

-- Enable the vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the documents table
CREATE TABLE IF NOT EXISTS public.documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    content text NOT NULL,
    filename text NOT NULL,
    processed_at timestamptz DEFAULT now(),
    embedding vector(1536)  -- Using 1536 dimensions for DeepSeek embeddings
);

-- Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON public.documents
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.documents
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create search function
CREATE OR REPLACE FUNCTION search_documents(
    query_text text,
    similarity_threshold float8 DEFAULT 0.2,
    max_results int DEFAULT 5
)
RETURNS TABLE (
    id uuid,
    content text,
    similarity float8
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        d.id,
        d.content,
        1 - (d.embedding <=> embedding_vector) as similarity
    FROM
        documents d,
        generate_embeddings(query_text) embedding_vector
    WHERE
        1 - (d.embedding <=> embedding_vector) > similarity_threshold
    ORDER BY
        d.embedding <=> embedding_vector
    LIMIT max_results;
END;
$$;