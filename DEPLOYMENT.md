# Deployment Guide

This is a static React + TypeScript + Vite website. It needs no API key, backend or database.

## 1. Upload to GitHub

Create an empty GitHub repository, extract this package, open a terminal inside the project and run:

```bash
git init
git add .
git commit -m "Initial Financial Literacy website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace `YOUR-USERNAME` and `YOUR-REPOSITORY` with your real values. Do not commit passwords, tokens or `.env` secrets.

## 2. Cloudflare Pages — Recommended

1. Open Cloudflare Dashboard.
2. Go to **Workers & Pages**.
3. Select **Create application → Pages → Import an existing Git repository**.
4. Select the GitHub repository.
5. Use these settings:

| Setting | Value |
|---|---|
| Framework preset | React (Vite) or Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |

6. Select **Save and Deploy**.

No environment variables are required.

For direct command-line deployment after building:

```bash
npm run build
npx wrangler pages deploy dist
```

## 3. Vercel

1. Import the GitHub repository into Vercel.
2. Vercel should detect Vite automatically.
3. Confirm Build Command `npm run build` and Output Directory `dist`.
4. Deploy.

The included `vercel.json` supplies these settings.

## 4. Netlify

1. Select **Add new site → Import an existing project**.
2. Connect the GitHub repository.
3. Use Build Command `npm run build`.
4. Use Publish Directory `dist`.
5. Deploy.

The included `netlify.toml` supplies these settings.

## 5. GitHub Pages

The included GitHub Actions workflow builds and publishes the website.

1. Push the source to the `main` branch.
2. Open repository **Settings → Pages**.
3. Under Source, select **GitHub Actions**.
4. Open the Actions tab and wait for **Deploy to GitHub Pages** to finish.

The Vite `base: "./"` setting supports repository subpaths.

## 6. Docker, VPS or Other Cloud Infrastructure

Build and run the included Docker image:

```bash
docker build -t moneywise-myanmar .
docker run -p 8080:80 moneywise-myanmar
```

Open `http://localhost:8080`.

The same container can run on AWS ECS, Azure Container Apps, Google Cloud Run, DigitalOcean, Render or any platform that supports Docker containers.

## 7. AWS S3 and CloudFront

1. Run `npm ci && npm run build`.
2. Upload the contents of `dist/` to an S3 bucket.
3. Configure the bucket or CloudFront distribution to use `index.html` as the default root object.
4. Use CloudFront for HTTPS, caching and a custom domain.

## Updating the deployed website

Edit the source, test locally with `npm run dev`, then push to GitHub. Cloudflare Pages, Vercel and Netlify automatically build and publish the new version.
