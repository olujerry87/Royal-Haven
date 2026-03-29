# Supabase Media Architecture Guide

By migrating away from Builder.io, you gain total autonomy over your assets. Supabase utilizes highly performant, globally cached **Storage Buckets**.

## Bucket Configuration
To maintain the exact structure of the website, you should create **ONE** public bucket in Supabase named: `royal_haven_assets`

## Folder Structure
Inside that single bucket, create the following root folders to keep your data rigorously organized:

### 1. `/hero` (Homepage & Banners)
* **Purpose**: The massive, cinematic images that load first on the Homepage and Header Banners.
* **Examples**: `home-hero-desktop.jpg`, `home-hero-mobile.jpg`, `heritage-banner.mp4`
* **Specs**: Compress these drastically (WebP formats under 500KB) to ensure the site's First Contentful Paint remains lightning-fast.

### 2. `/lookbook` (The Ewa Artistry Gallery)
* **Purpose**: These are the dynamic files pulled automatically by the `lookbook_images` database table.
* **Examples**: `bridal-updo-1.jpg`, `gele-traditional-gold.png`, `fashion-heritage-trench.jpg`
* **Workflow**: When you upload an image here, grab its **Public URL** from Supabase and paste that URL into the `image_url` column in your `lookbook_images` database table.

### 3. `/garments` (NFC Passports & E-Commerce)
* **Purpose**: High-resolution, detail-oriented shots of the individual clothing items.
* **Examples**: `asoke-trench-front.jpg`, `asoke-trench-texture.jpg`, `heritage-loafers.png`
* **Workflow**: These images are linked directly to the `garments` Database (for NTAG scans).

### 4. `/system` (UI Elements & Icons)
* **Purpose**: Global branding assets that rarely change.
* **Examples**: `header-logo.svg`, `footer-emblem.png`, `loading-spinner.gif`, `favicon.ico`
* **Workflow**: These URLs are hardcoded directly into the Next.js components (e.g., `Navigation.js` or `Footer.js`).

## How to Retrieve & Use the URLs
1. Open your Supabase Dashboard -> **Storage**.
2. Upload your file into the correct folder inside the `royal_haven_assets` bucket.
3. Click the file, and press **Copy URL**.
4. Paste that URL into any Database row or directly into the React codebase. Supabase's global edge network will load it instantly.
