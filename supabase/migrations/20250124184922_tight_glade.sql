/*
  # Add chat sessions support
  
  1. New Tables
    - `chat_sessions`
      - `id` (uuid, primary key)
      - `user_id` (text, references auth.users)
      - `title` (text)
      - `messages` (jsonb array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS
    - Add policies for user access
*/

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id text NOT NULL,
    title text NOT NULL DEFAULT 'New Chat',
    messages jsonb NOT NULL DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own chat sessions"
    ON public.chat_sessions
    FOR ALL
    TO authenticated
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chat_sessions_updated_at
    BEFORE UPDATE
    ON public.chat_sessions
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();