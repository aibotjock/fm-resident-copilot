# FM Resident Copilot - Cloud Deployment Guide

## Quick Deploy to Render.com (Free Tier)

### Prerequisites
- A GitHub account
- A Render.com account (free - sign up at https://render.com)

### Step-by-Step Deployment

#### 1. Push to GitHub

```bash
cd /home/ubuntu/fm-resident-copilot
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

**OR** you can create a new repo directly on GitHub and follow their instructions.

#### 2. Deploy on Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Blueprint"**
3. **Connect your GitHub repository** containing this project
4. **Render will auto-detect** the `render.yaml` file and configure everything
5. **Set your OpenAI API Key** (OPTIONAL - users can provide their own via app settings):
   - In the Render dashboard, go to your web service
   - Navigate to "Environment" tab
   - Find `OPENAI_API_KEY` and add your key
   - OR leave it unset - users will provide their own via the app

6. **Wait for deployment** (~5-10 minutes for first deploy)
   - Database will provision first
   - Then the web service will build and start

#### 3. Get Your Backend URL

Once deployed, Render will give you a URL like:
```
https://fm-copilot-server.onrender.com
```

#### 4. Configure Your Phone App

1. Open the FM Resident Copilot app on your phone
2. Tap the **gear icon** (settings)
3. Enter:
   - **Backend Server URL**: `https://fm-copilot-server.onrender.com`
   - **OpenAI API Key**: Your personal OpenAI API key
4. Tap **Save Settings**

### Important Notes

**Free Tier Limitations:**
- Service spins down after 15 minutes of inactivity
- First request after inactivity takes ~30-60 seconds (cold start)
- 750 hours/month free (enough for personal use)
- Database: 1GB storage, shared CPU

**Upgrading (if needed):**
- Paid plans start at $7/month for always-on service
- Upgrade via Render dashboard if cold starts become annoying

### Troubleshooting

**Build fails?**
- Check Render logs in dashboard
- Ensure `render.yaml` is in repo root

**Database connection errors?**
- Wait 2-3 minutes after first deploy
- Database may need time to fully provision

**App can't connect?**
- Verify the backend URL in app settings (no trailing slash)
- Check Render service status (must show "Live")

### Alternative: Railway.app

If you prefer Railway instead:

1. Go to https://railway.app
2. Click "Start a New Project" → "Deploy from GitHub repo"
3. Select your repo
4. Add PostgreSQL from Railway marketplace
5. Set environment variables:
   - `DATABASE_URL` (auto-set by Railway)
   - `PORT` (auto-set by Railway)
   - `OPENAI_API_KEY` (optional)
6. Railway will auto-detect and build the server
7. Use the provided Railway URL in your app settings

Railway free tier: $5/month credit (usually enough for light use).
