-- Create table to track platform earnings from administrative fees
CREATE TABLE public.platform_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('tip', 'subscription', 'individual_purchase')),
  original_amount NUMERIC NOT NULL,
  fee_percentage NUMERIC NOT NULL,
  fee_amount NUMERIC NOT NULL,
  creator_amount NUMERIC NOT NULL,
  transaction_id TEXT NOT NULL, -- Reference to Stripe transaction
  creator_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.platform_earnings ENABLE ROW LEVEL SECURITY;

-- Create policy for platform admins only
CREATE POLICY "Only admins can view platform earnings" 
ON public.platform_earnings 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM auth.users 
  WHERE users.id = auth.uid() AND is_admin(users.email::text)
));

-- Add indexes for better performance
CREATE INDEX idx_platform_earnings_creator_id ON public.platform_earnings(creator_id);
CREATE INDEX idx_platform_earnings_created_at ON public.platform_earnings(created_at);
CREATE INDEX idx_platform_earnings_transaction_type ON public.platform_earnings(transaction_type);

-- Create function to calculate and record platform fees
CREATE OR REPLACE FUNCTION public.record_platform_fee(
  p_transaction_type TEXT,
  p_original_amount NUMERIC,
  p_fee_percentage NUMERIC,
  p_transaction_id TEXT,
  p_creator_id UUID
) RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  fee_amount NUMERIC;
  creator_amount NUMERIC;
BEGIN
  -- Calculate fees
  fee_amount := p_original_amount * (p_fee_percentage / 100);
  creator_amount := p_original_amount - fee_amount;
  
  -- Record the transaction
  INSERT INTO public.platform_earnings (
    transaction_type,
    original_amount,
    fee_percentage,
    fee_amount,
    creator_amount,
    transaction_id,
    creator_id
  ) VALUES (
    p_transaction_type,
    p_original_amount,
    p_fee_percentage,
    fee_amount,
    creator_amount,
    p_transaction_id,
    p_creator_id
  );
  
  -- Return the amount that should go to the creator
  RETURN creator_amount;
END;
$$;