-- Drop existing chat_sessions table and related objects
DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON public.chat_sessions;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP TABLE IF EXISTS public.chat_sessions;

-- Create chat_sessions table with proper schema
CREATE TABLE public.chat_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL DEFAULT 'New Chat',
    messages jsonb NOT NULL DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT valid_messages CHECK (jsonb_typeof(messages) = 'array')
);

-- Enable RLS
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own chat sessions"
    ON public.chat_sessions
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_chat_sessions_updated_at
    BEFORE UPDATE
    ON public.chat_sessions
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX chat_sessions_user_id_idx ON public.chat_sessions(user_id);
CREATE INDEX chat_sessions_updated_at_idx ON public.chat_sessions(updated_at DESC);

-- Grant necessary permissions
GRANT ALL ON public.chat_sessions TO authenticated;
GRANT USAGE ON SEQUENCE chat_sessions_id_seq TO authenticated;

-- Notify PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';