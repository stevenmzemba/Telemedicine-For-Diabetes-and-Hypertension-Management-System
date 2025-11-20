Deploying `telemed-single.html` to Supabase Hosting

This file explains how to publish the single-file app `telemed-single.html` to Supabase Hosting.

Steps (recommended):

1) Prepare the repo
- Create a new Git repository and add `telemed-single.html` at the repository root.
- Optionally rename `telemed-single.html` to `index.html` so Supabase serves it by default.

2) Replace Supabase keys (or use environment variables)
- Open `telemed-single.html` and replace the placeholders:
  - `SUPABASE_URL = 'REPLACE_WITH_YOUR_SUPABASE_URL'`
  - `SUPABASE_ANON_KEY = 'REPLACE_WITH_YOUR_SUPABASE_ANON_KEY'`

  For production, do NOT embed secrets in client-side files. Use server-side functions or create a small server to handle protected operations.

3) Commit and push to GitHub
- Commit the files and push to a GitHub repository.

4) Connect the repository to Supabase
- In the Supabase Dashboard: Sites (Hosting) -> New Site -> Connect repository.
- When prompted, set the build/publish directory to the repository root (or the folder containing `index.html`).
- If you kept the file named `telemed-single.html`, configure the site to use that file as the `Index` (some hosting settings let you set the fallback filename). Renaming to `index.html` avoids this step.

5) Environment variables
- In Supabase project settings you can set environment variables for the site. Prefer this to hard-coding keys.
- If you rely on client-side auth (demo/testing), you can leave the anon key in the file, but for production use RLS and server-side role assignment.

6) Publish and test
- After connecting the repo, Supabase will build and publish the site. Open the provided site URL and test Sign In / Sign Up flows.

Notes and recommendations
- For public demo/testing: using the anon key is acceptable but not secure.
- For production: implement server endpoints or Supabase Edge Functions to hold secrets and perform sensitive operations.
- If you want me to create an `index.html` wrapper or add a minimal build step, tell me and I will add it.

If you want, I can also:
- Create `index.html` (copy of `telemed-single.html`) so the site works immediately.
- Add a `supabase.toml` placeholder if you plan to use the Supabase CLI (I can add a safe placeholder file).

Note: This workspace already contains an `index.html` file (a lightweight wrapper). For best results either:
- Rename `telemed-single.html` to `index.html` at the repository root, or
- Replace the wrapper `index.html` with a copy of `telemed-single.html` so Supabase Sites serves the app directly.

