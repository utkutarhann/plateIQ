---
description: How to deploy the Next.js application to Vercel
---

# Deploying to Vercel

Vercel is the creators of Next.js and provides the best hosting experience for Next.js applications with zero configuration.

## Prerequisites
1.  A [GitHub](https://github.com) account.
2.  A [Vercel](https://vercel.com) account (you can sign up with GitHub).

## Step 1: Push your code to GitHub

You need to push your local code to a GitHub repository.

1.  Create a new repository on GitHub (e.g., `calorie-tracker`).
2.  Run the following commands in your terminal (if you haven't already):

```bash
# Initialize git if not done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit for deployment"

# Link to your GitHub repo (replace URL with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/calorie-tracker.git

# Push to main
git branch -M main
git push -u origin main
```

## Step 2: Deploy on Vercel

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `calorie-tracker` repository from GitHub.
4.  **Configure Project:**
    -   **Framework Preset:** Next.js (should be auto-detected).
    -   **Root Directory:** `./` (default).
    -   **Environment Variables:** You MUST add these for the app to work:
        -   `NEXT_PUBLIC_SUPABASE_URL`: (Copy from your `.env.local`)
        -   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Copy from your `.env.local`)
5.  Click **"Deploy"**.

## Step 3: Verify

Once deployed, Vercel will give you a live URL (e.g., `calorie-tracker.vercel.app`). Visit it to test your application.

> [!IMPORTANT]
> Make sure your Supabase project URL is whitelisted if you have any database restrictions, though usually Supabase is accessible from anywhere by default unless configured otherwise.
