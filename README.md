# Enzira Begena Online School

Sacred Begena training web application built with React, Vite, Tailwind CSS, Framer Motion, and Supabase.

---

## Deploy to Vercel

You can deploy directly from your GitHub repository to Vercel:

### Option 1: Standard Deployment (Default)
1. In Vercel, click **Add New Project** and import this repository.
2. Leave **Root Directory** as `./` (default). Vercel will automatically read `vercel.json`.
3. Add your **Environment Variables** in the Vercel dashboard:
   - `VITE_SUPABASE_URL`: Your Supabase project URL (`https://your-project.supabase.co`)
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous public key
   - `VITE_ADMIN_EMAIL`: Your admin dashboard login email
   - `VITE_ADMIN_PASSWORD`: Your admin dashboard password
4. Click **Deploy**.

### Option 2: Subfolder Root Directory
If you set **Root Directory** to `begena-app` in Vercel:
- **Framework Preset**: Vite
- **Build Command**: `vite build` (or `npm run build`)
- **Output Directory**: `dist`
- Client-side routing is handled automatically by `begena-app/vercel.json`.

---

## Local Development

```bash
# Install dependencies from root
npm install

# Run frontend dev server
npm run dev
```

Build for production:
```bash
npm run build
```
