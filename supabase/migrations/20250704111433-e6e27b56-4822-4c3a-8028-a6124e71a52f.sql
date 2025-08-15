
-- Create contact_submissions table for storing user feedback
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Users can insert their own submissions
CREATE POLICY "Users can create their own contact submissions" 
  ON public.contact_submissions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own submissions
CREATE POLICY "Users can view their own contact submissions" 
  ON public.contact_submissions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Admin policy (for future admin functionality)
CREATE POLICY "Admins can view all contact submissions" 
  ON public.contact_submissions 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_verified = true
    )
  );
