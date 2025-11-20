CREATE TABLE consultations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_code TEXT REFERENCES patients(patient_code),
  consultation_code TEXT UNIQUE NOT NULL,
  consultation_date DATE NOT NULL,
  blood_pressure TEXT,
  blood_glucose INTEGER,
  weight DECIMAL,
  provider_notes TEXT,
  medications JSONB DEFAULT '[]',
  status TEXT NOT NULL CHECK (status IN ('awaiting_provider', 'awaiting_pharmacy', 'completed')),
  pharmacy_status TEXT DEFAULT 'pending' CHECK (pharmacy_status IN ('pending', 'dispensed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);