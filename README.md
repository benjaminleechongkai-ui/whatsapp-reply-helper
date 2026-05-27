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

Do this in order: **create the empty repo on GitHub first**, then **commit locally**, then **push**. If push fails, see [GitHub push troubleshooting](#github-push-troubleshooting) below.

#### A. Create the repository on GitHub (website)

1. Sign in at [github.com](https://github.com).
2. Click the **+** (top right) → **New repository**.
3. Fill in:
   - **Repository name:** `whatsapp-reply-helper` (match your folder name if you like).
   - **Description:** optional.
   - **Public** or **Private:** your choice (Vercel works with both).
4. **Important:** leave these **unchecked**:
   - ❌ Add a README file  
   - ❌ Add .gitignore  
   - ❌ Choose a license  

   You want a completely **empty** repo. If GitHub creates a README on the remote, your first push often fails with *“rejected / non-fast-forward”*.

5. Click **Create repository**.
6. On the next screen, copy the repo URL. It looks like one of:
   - HTTPS: `https://github.com/YOUR_USERNAME/whatsapp-reply-helper.git`
   - SSH: `git@github.com:YOUR_USERNAME/whatsapp-reply-helper.git`

   Replace `YOUR_USERNAME` with your real GitHub username (e.g. `benjaminleechongkai-ui`).

#### B. Prepare Git on your Mac (one-time)

Open **Terminal** and check Git is installed:

```bash
git --version
```

If you see a version number, you’re fine. If not, install Xcode Command Line Tools:

```bash
xcode-select --install
```

Set your name and email (used on commits; use the email tied to your GitHub account):

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

#### C. Commit the project locally

```bash
cd /Users/potatowarrior/Documents/Code/whatsapp-reply-helper
```

**If this folder has never used Git:**

```bash
git init
git add .
git status
```

You should see files like `public/`, `api/`, `package.json` staged — **not** `.env` (that’s in `.gitignore`).

```bash
git commit -m "WhatsApp reply helper"
git branch -M main
```

**If Git is already initialized** (you already ran `git init` / have a commit):

```bash
git status
```

- If it says *“nothing to commit, working tree clean”*, skip to step D.
- If there are changes, run `git add .` then `git commit -m "Your message"`.

#### D. Connect GitHub and push

**First time only** — link your local repo to GitHub (use **your** URL from step A):

```bash
git remote add origin https://github.com/YOUR_USERNAME/whatsapp-reply-helper.git
```

If you see `error: remote origin already exists`, either fix the URL:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/whatsapp-reply-helper.git
git remote -v
```

or remove and re-add:

```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/whatsapp-reply-helper.git
```

**Push:**

```bash
git push -u origin main
```

When it works, refresh the repo page on GitHub — you should see `public/`, `api/`, `README.md`, etc.

#### E. Sign in to GitHub when pushing (fixes most auth errors)

GitHub no longer accepts account passwords for `git push` over HTTPS. You must use a **Personal Access Token (PAT)** or **SSH**.

**Option 1 — Personal Access Token (simplest if you use HTTPS)**

1. GitHub → profile picture → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token (classic)**.
2. Note: e.g. `mac-git-push`. Expiration: your choice. Scopes: check **`repo`**.
3. Generate and **copy the token** (you won’t see it again).
4. Push again:

   ```bash
   git push -u origin main
   ```

   - **Username:** your GitHub username  
   - **Password:** paste the **token** (not your GitHub password)

On macOS, Git may store this in Keychain so you only enter it once.

**Option 2 — GitHub CLI (good long-term)**

```bash
brew install gh
gh auth login
```

Choose: GitHub.com → HTTPS → authenticate in browser → then:

```bash
cd /Users/potatowarrior/Documents/Code/whatsapp-reply-helper
git push -u origin main
```

**Option 3 — SSH (no token prompt each time on new machines)**

1. Create a key (press Enter for defaults):

   ```bash
   ssh-keygen -t ed25519 -C "you@example.com"
   ```

2. Copy the public key:

   ```bash
   pbcopy < ~/.ssh/id_ed25519.pub
   ```

3. GitHub → **Settings** → **SSH and GPG keys** → **New SSH key** → paste → save.

4. Switch remote to SSH and push:

   ```bash
   git remote set-url origin git@github.com:YOUR_USERNAME/whatsapp-reply-helper.git
   git push -u origin main
   ```

#### GitHub push troubleshooting

| Error | What it means | Fix |
|--------|----------------|-----|
| `could not read Username for 'https://github.com': Device not configured` | Git can’t prompt for login (common in some terminals / CI). | Use **PAT** (Option 1), **`gh auth login`** (Option 2), or **SSH** (Option 3) above. |
| `Authentication failed` / `Invalid username or password` | Password used instead of token, or wrong token. | Use a **classic PAT** with `repo` scope as the password. |
| `remote: Repository not found` | Wrong URL, typo in username, or repo is under another account. | Check `git remote -v` matches the repo you created; confirm you’re logged into the right GitHub account. |
| `error: remote origin already exists` | `git remote add` run twice. | `git remote set-url origin <correct-url>` |
| `rejected (non-fast-forward)` / `failed to push some refs` | Remote has commits you don’t (e.g. README created on GitHub). | Prefer empty repo (step A). Or: `git pull origin main --rebase` then push again. |
| `src refspec main does not match any` | No commits yet or branch isn’t `main`. | `git commit` first, then `git branch -M main`. |
| `Permission denied (publickey)` | SSH key not added to GitHub. | Complete SSH Option 3. |

**Your project today:** local Git is on `main` with a commit; remote is set to  
`https://github.com/benjaminleechongkai-ui/whatsapp-reply-helper.git`.  
If push still fails, it’s almost always **authentication** — use Option 1, 2, or 3 in section E, then run `git push -u origin main` again.

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
