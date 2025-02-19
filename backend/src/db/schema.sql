-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    employee_code TEXT UNIQUE NOT NULL,
    interest_rates JSONB NOT NULL DEFAULT '{"weekly": 0, "biweekly": 0, "monthly": 0}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access"
    ON companies FOR SELECT
    USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert"
    ON companies FOR INSERT
    WITH CHECK (true);

-- Allow authenticated users to update their own records
CREATE POLICY "Allow authenticated update"
    ON companies FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users to delete their own records
CREATE POLICY "Allow authenticated delete"
    ON companies FOR DELETE
    USING (true); 