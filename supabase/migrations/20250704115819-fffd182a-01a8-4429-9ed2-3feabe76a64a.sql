
-- Create admin_users table to store authorized admin email addresses
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Insert the admin email address
INSERT INTO public.admin_users (email) VALUES ('admin@shetalksapp.com');

-- Create security function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(user_email text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = user_email AND is_active = true
  );
$$;

-- Add response fields to contact_submissions table
ALTER TABLE public.contact_submissions 
ADD COLUMN admin_response TEXT,
ADD COLUMN responded_by UUID REFERENCES auth.users,
ADD COLUMN responded_at TIMESTAMP WITH TIME ZONE;

-- Update RLS policy for admin access to contact submissions
CREATE POLICY "Admins can view and manage all contact submissions" 
  ON public.contact_submissions 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND public.is_admin(auth.users.email)
    )
  );

-- Enable RLS on admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow admins to view admin_users table
CREATE POLICY "Admins can view admin_users" 
  ON public.admin_users 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND public.is_admin(auth.users.email)
    )
  );
