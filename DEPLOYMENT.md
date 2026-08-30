# Deployment Guide — MoneyWise Myanmar

This is a static React 19 + TypeScript + Vite web application. It requires no backend server, database, or API keys.

---

## 1. Push to GitHub

If creating a new repository or pushing updates:

```bash
git init
git add .
git commit -m "feat: complete MoneyWise Myanmar static application"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Ensure `package-lock.json`, `.gitignore`, and `.github/workflows/deploy-pages.yml` are committed.

---

## 2. Cloudflare Pages (Recommended)

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages**.
3. Select **Create application → Pages → Connect to Git**.
4. Select your GitHub repository.
5. Configure the build settings:

| Setting | Value |
|---|---|
| **Framework preset** | `React (Vite)` or `Vite` |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` |
| **Node.js Version** | `22` |
| **Environment variables** | *None required* |

6. Click **Save and Deploy**.
7. Cloudflare Pages will assign a URL like `https://moneywise-myanmar.pages.dev`.

### Direct CLI Deployment with Wrangler:

```bash
npm ci
npm run build
npx wrangler pages deploy dist --project-name=moneywise-myanmar
```

---

## 3. GitHub Pages (Automated via GitHub Actions)

The repository includes a ready-to-use workflow at `.github/workflows/deploy-pages.yml`.

To enable:
1. Push code to the `main` branch.
2. In your GitHub repository, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. GitHub Actions will automatically run `npm ci`, execute `npm run lint`, build `dist/`, and deploy the site.
5. The Vite config uses `base: "./"` which supports both custom domains and project subpaths (e.g., `https://username.github.io/repository-name/`).

---

## 4. Vercel

1. Import your GitHub repository into [Vercel](https://vercel.com).
2. Vercel automatically detects the Vite framework.
3. Confirm settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm ci`
4. Click **Deploy**.

The repository includes `vercel.json` for zero-configuration deployments.

---

## 5. Netlify

1. Go to [Netlify](https://app.netlify.com) and click **Add new site → Import an existing project**.
2. Connect your GitHub repository.
3. Confirm settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Click **Deploy site**.

The repository includes `netlify.toml` for pre-configured deployments.

---

## 6. Docker & Container Platforms

The included multi-stage `Dockerfile` uses `node:22-alpine` to build the app with `npm ci` and serves static files via `nginx:1.27-alpine`.

### Build & Run locally:

```bash
# Build Docker image
docker build -t moneywise-myanmar .

# Run container on port 8080
docker run -d -p 8080:80 --name moneywise-app moneywise-myanmar
```

Open `http://localhost:8080`.

### Deploying the container:
The built Docker container can be deployed to:
- Google Cloud Run
- AWS ECS / Fargate
- Azure Container Apps
- DigitalOcean App Platform
- Render / Fly.io / Railway

---

## 7. AWS S3 + CloudFront

1. Run:
   ```bash
   npm ci
   npm run build
   ```
2. Sync the `dist/` directory to an AWS S3 bucket:
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```
3. Configure S3 static website hosting or connect CloudFront distribution with `index.html` as the Default Root Object.

---

## Continuous Updates & Maintenance

Whenever you push commits to your `main` branch, connected platforms (Cloudflare Pages, GitHub Pages, Vercel, Netlify) will automatically rebuild using `npm ci` and publish the updated application.
