# WhatsApp Reply Helper

Mobile-first web app for staff: paste a customer WhatsApp message, type a draft reply in broken English, and get a polished reply in **Friendly**, **Professional**, or **Formal** tone via the Claude API.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and set your [Anthropic API key](https://console.anthropic.com/):

   ```bash
   cp .env.example .env
   ```

3. Start the server:

   ```bash
   npm start
   ```

4. Open **http://localhost:3000** on your phone (same Wi‑Fi) or desktop.

## Usage

1. Optionally paste the customer's message for context.
2. Type your draft reply.
3. Choose a tone and tap **Rewrite with Claude**.
4. Tap **Copy to clipboard** and paste into WhatsApp.

## Deploy to Vercel

The repo is set up for Vercel: static files in `public/`, API at `api/rewrite.js` → `/api/rewrite`.

### 1. Put the code on GitHub

From the project folder:

```bash
git init
git add .
git commit -m "WhatsApp reply helper"
```

Create a new repository on GitHub, then:

```bash
git remote add origin https://github.com/YOUR_USER/whatsapp-reply-helper.git
git branch -M main
git push -u origin main
```

### 2. Import the project in Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub account is easiest).
2. Click **Add New…** → **Project**.
3. **Import** the `whatsapp-reply-helper` repository.
4. Leave defaults:
   - **Framework Preset:** Other (or no framework)
   - **Root Directory:** `.` (project root)
   - **Build Command:** leave empty (no build step)
   - **Output Directory:** leave empty (`public/` is served automatically)

### 3. Add the API key

Before or right after the first deploy:

1. In the project → **Settings** → **Environment Variables**.
2. Add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your Anthropic API key
   - **Environments:** Production (and Preview if you want PR previews to work)
3. **Save**, then **Redeploy** the latest deployment (Deployments → ⋯ → Redeploy) so the function picks up the variable.

### 4. Open the live URL

After deploy succeeds, Vercel gives you a URL like `https://whatsapp-reply-helper.vercel.app`. Open it on a phone and bookmark it for staff.

### Optional: deploy from the CLI

```bash
npm i -g vercel
cd whatsapp-reply-helper
vercel login
vercel
# Follow prompts; then add ANTHROPIC_API_KEY in the dashboard or:
vercel env add ANTHROPIC_API_KEY
vercel --prod
```

### Local dev vs Vercel

| | Local (`npm start`) | Vercel |
|--|---------------------|--------|
| Frontend | `public/` via Express | `public/` static |
| API | Express `/api/rewrite` | Serverless `api/rewrite.js` |
| Secrets | `.env` file | Vercel env vars |

Test production-like behavior locally with the Vercel CLI:

```bash
vercel dev
```

## Notes

- The API key stays on the server (`ANTHROPIC_API_KEY`); it is never sent to the browser.
- Vercel Hobby allows up to 30s per function (configured in `vercel.json`); Pro may be needed for longer timeouts.
- Consider Vercel **Password Protection** (Pro) or your own auth if only staff should use the app.
