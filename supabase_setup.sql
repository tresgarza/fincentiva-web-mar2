-- Create the simulations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.simulations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  loan_type TEXT NOT NULL,
  car_price NUMERIC NOT NULL,
  loan_amount NUMERIC NOT NULL,
  term_months INTEGER NOT NULL,
  monthly_payment NUMERIC NOT NULL,
  is_application BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts
CREATE POLICY "Allow anonymous inserts" 
ON public.simulations 
FOR INSERT 
TO anon
WITH CHECK (true);

-- Create policy to allow users to read their own data
CREATE POLICY "Allow users to read their own data" 
ON public.simulations 
FOR SELECT 
TO anon
USING (true);

-- Grant necessary permissions
GRANT ALL ON public.simulations TO anon;
GRANT ALL ON public.simulations TO authenticated;
GRANT ALL ON public.simulations TO service_role; 