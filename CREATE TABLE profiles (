CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('cashier', 'provider', 'pharmacy', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);