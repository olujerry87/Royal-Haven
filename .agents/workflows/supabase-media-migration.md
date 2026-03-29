---
description: How to migrate site assets to Supabase Storage
---

# Supabase Media Migration Workflow

Follow these steps to move images from local folders or Builder.io into your professional Supabase Storage bucket.

## 1. Setup the Bucket
// turbo
1. Log into your Supabase Dashboard.
2. Go to **Storage**, and create a new bucket named `royal_haven_assets`.
3. Set the bucket to **Public**.

## 2. Prepare Folders
Inside the bucket, create these folders:
- `/hero`
- `/lookbook`
- `/garments`
- `/system`

## 3. Upload & Update Files
1. **Upload** your WebP or JPG files into the relevant folder.
2. **Copy the Public URL** for the uploaded file.
3. **Notify Antigravity**: "I've uploaded `home-hero.webp` to `/hero`. Update `FeaturedSpotlight.js` to use: `[URL]`."

## 4. Automation Policy (Optional)
If you want to automate this, we can set up a GitHub Action to sync a local `public/supabase-sync` folder to your Supabase bucket. Ask me for the "GitHub Sync Workflow" if you'd like to set this up.
