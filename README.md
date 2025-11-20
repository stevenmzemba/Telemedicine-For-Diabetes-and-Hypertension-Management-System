Telemed — Single-file UI

Overview

This workspace contains a single-file web UI (`telemed-single.html`) for a basic telemedicine front-end. It supports signup/login (Supabase auth), a cashier intake form, and simple patient management UI. Replace Supabase placeholders before connecting to your project.

Quick local test

1. Open `telemed-single.html` and set these values at the top of the file:
   - `SUPABASE_URL` — your Supabase project URL
   - `SUPABASE_ANON_KEY` — your anon/public key

2. Start a local static server and open the page:

   Windows (CMD):
   ```cmd
   cd "C:\Users\MZEMBA\Telemed for diabetes  and hyper tension"
   python -m http.server 8000
   # open http://localhost:8000/telemed-single.html
   ```

   PowerShell (background):
   ```powershell
   cd "C:\Users\MZEMBA\Telemed for diabetes  and hyper tension"
   Start-Process -NoNewWindow -FilePath python -ArgumentList '-m','http.server','8000'
   ```

Deploy to Supabase Hosting (recommended if you want a static site)

1. Initialize a git repo (if not already):

   ```bash
   git init
   git add telemed-single.html README.md
   git commit -m "Add Telemed single-file UI"
   # push to a GitHub repo and connect that repo to Supabase Hosting
   ```

2. In Supabase dashboard -> Hosting -> Connect a repository -> choose branch -> Deploy. Supabase will serve the file as your site root (index.html). If you want `telemed-single.html` as root, rename it to `index.html` before deploying.

Upload to Supabase Storage (alternate)

1. In Supabase dashboard -> Storage -> Create a public bucket (e.g., `public-site`).
2. Upload `telemed-single.html` and make the file public.
3. Use the public file URL to open the app.

Database setup (recommended tables)

Run these SQL snippets in Supabase SQL editor to create minimal tables used by the client:

-- profiles table for storing user role
```sql
create table if not exists profiles (
  id uuid primary key,
  full_name text,
  role text,
  created_at timestamptz default now()
);
```

-- patients table
```sql
create table if not exists patients (
  id uuid default gen_random_uuid() primary key,
  patient_code text,
  first_name text,
  last_name text,
  date_of_birth date,
  age int,
  gender text,
  village text,
  phone text,
  email text,
  address text,
  chronic_diseases text[],
  healthcare_provider text,
  contacts text[],
  created_at timestamptz default now()
);
```

Security notes / RLS

- For testing you may temporarily disable RLS on tables, but for production you MUST enable RLS and create policies that:
  - Allow authenticated users to insert/select their own `profiles` row.
  - Restrict role assignment so only an admin or server-side function can set `role` values.

Example minimal RLS policy (profiles) - allow authenticated users to upsert their own profile:

```sql
-- Enable RLS
alter table profiles enable row level security;

create policy "profiles_upsert_own" on profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);
```

Assigning roles securely

- Do not trust client-supplied `role` on signup. Use server-side functions or admin-only workflows to set roles in the `profiles` table.
- For quick testing you can allow the client to upsert `role`, but remove it before deploying publicly.

Git + Supabase quick commands

```bash
# add and push
git add telemed-single.html README.md
git commit -m "Add single-file Telemed UI"
# push to remote GitHub and connect repo in Supabase Hosting
```

Support & next steps

- I can: (A) rename `telemed-single.html` to `index.html` and prepare a Git commit here, (B) generate example SQL migration files, or (C) add a small serverless function example to assign roles securely. Which would you like me to do next?
