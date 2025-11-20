CREATE TABLE patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_code TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  village TEXT,
  contact1 TEXT,
  contact2 TEXT,
  chronic_type TEXT NOT NULL CHECK (chronic_type IN ('diabetes', 'hypertension', 'both')),
  registered_date DATE NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);