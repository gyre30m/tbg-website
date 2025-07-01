-- Create the personal_injury_forms table
CREATE TABLE personal_injury_forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  address1 TEXT NOT NULL,
  address2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  phone_type TEXT NOT NULL,
  direct_contact_consent BOOLEAN NOT NULL,
  gender TEXT NOT NULL,
  marital_status TEXT NOT NULL,
  ethnicity TEXT,
  date_of_birth DATE NOT NULL,
  incident_date DATE NOT NULL,
  incident_description TEXT NOT NULL,
  injury_type TEXT NOT NULL,
  medical_treatment BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE personal_injury_forms ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow inserts (for form submissions)
CREATE POLICY "Allow inserts for personal injury forms" ON personal_injury_forms
  FOR INSERT WITH CHECK (true);

-- Create a policy to allow selects for authenticated users only (optional - for admin access)
CREATE POLICY "Allow select for authenticated users" ON personal_injury_forms
  FOR SELECT USING (auth.role() = 'authenticated');