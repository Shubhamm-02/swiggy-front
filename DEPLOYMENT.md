# Step-by-Step Deployment Guide (Swiggy Clone)

You have **3 pieces** to deploy:
1. **Database** (MongoDB) – where restaurants, users, cart, orders are stored  
2. **Backend** (Python FastAPI) – API that the frontend calls  
3. **Frontend** (Next.js) – the website users see  

Deploy in this order: Database → Backend → Frontend.

---

## Prerequisites

- A **GitHub** account ([github.com](https://github.com))
- Your project code pushed to a **GitHub repository** (see Step 0 below if you haven’t)

---

## Step 0: Push Your Code to GitHub (if you haven’t)

1. Go to [github.com](https://github.com) and sign in.  
2. Click **“+”** (top right) → **“New repository”**.  
3. Name it (e.g. `swiggy-clone`), leave it **Public**, click **“Create repository”**.  
4. On your computer, open Terminal in your project folder (the one that contains `package.json` and `backend/`):

   ```bash
   cd "/Users/wizard/Desktop/untitled folder 2/swiggy"
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and repo name.

---

## Part 1: Create a Free MongoDB Database (MongoDB Atlas)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up (free).  
2. Create a **free cluster** (e.g. **M0**), choose a cloud provider and region close to you, then **Create**.  
3. **Security → Database Access → Add New Database User**  
   - Set a username and password (save them somewhere safe).  
   - Role: **Atlas Admin** (or **Read and write to any database**).  
   - **Add User**.  
4. **Security → Network Access → Add IP Address**  
   - Click **“Add IP Address”**.  
   - Choose **“Allow Access from Anywhere”** (or add `0.0.0.0/0`) so your backend host can connect.  
   - **Confirm**.  
5. Get your **connection string**:  
   - **Database → Connect → Connect your application**.  
   - Copy the URI. It looks like:  
     `mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`  
   - Replace `<password>` with your actual database user password (keep `USERNAME` as is).  
   - Save this as your **MONGO_URL** (you’ll use it in the backend).

---

## Part 2: Deploy the Backend (Render – free tier)

1. Go to [render.com](https://render.com) and sign up (use GitHub if you can).  
2. **Dashboard → New + → Web Service**.  
3. Connect your GitHub account if asked, then select the repo that contains your Swiggy project.  
4. Configure the service:
   - **Name:** e.g. `swiggy-backend`
   - **Region:** pick one close to you
   - **Root Directory:** type `backend` (so Render uses only the `backend/` folder).
   - **Runtime:** **Python 3**
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - (With Root Directory = `backend`, paths are relative to `backend/`, so no `backend/` in the commands.)
5. **Environment** (Environment Variables):
   - **MONGO_URL** = your MongoDB Atlas connection string (from Part 1)  
   - **DB_NAME** = `swiggy_clone`  
   - **JWT_SECRET** = any long random string (e.g. generate one at [randomkeygen.com](https://randomkeygen.com))  
   - **CORS_ORIGINS** = `https://your-frontend-url.vercel.app`  
     (Leave this for after Part 3; you can add it later and redeploy. Or use `*` temporarily to test.)
6. Click **Create Web Service**.  
7. Wait for the first deploy. When it’s live, open the service URL (e.g. `https://swiggy-backend.onrender.com`).  
8. **Important:** Add your backend URL to CORS later: **CORS_ORIGINS** = `https://your-app.vercel.app` (or add both with comma).  
9. **Seed the database:**  
   - Open: `https://YOUR_BACKEND_URL/api/docs` (Swiggy docs).  
   - Find **POST /api/seed**, click **Try it out** → **Execute**.  
   - Status 200 means restaurants, menu, Instamart data, and a test user are created.

**Save your backend URL** (e.g. `https://swiggy-backend.onrender.com`) – you’ll need it for the frontend.

---

## Part 3: Deploy the Frontend (Vercel – free tier)

1. Go to [vercel.com](https://vercel.com) and sign up (use GitHub).  
2. **Add New → Project**.  
3. Import your GitHub repository (same one that has the Swiggy code).  
4. Configure:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** leave as `.` (root)
   - **Environment Variables** – add:
     - **Name:** `NEXT_PUBLIC_BACKEND_URL`  
     - **Value:** your backend URL from Part 2, **no trailing slash**  
       Example: `https://swiggy-backend.onrender.com`
5. Click **Deploy**.  
6. Wait for the build to finish. You’ll get a URL like `https://swiggy-clone-xxx.vercel.app`.

---

## Part 4: Connect Backend and Frontend

1. **CORS:** In Render (backend), open your Web Service → **Environment** and set:
   - **CORS_ORIGINS** = `https://your-actual-vercel-url.vercel.app`  
   (Use the exact URL Vercel gave you. For multiple origins, use comma: `https://a.vercel.app,https://b.vercel.app`.)
2. **Redeploy** the backend on Render (e.g. **Manual Deploy → Deploy latest commit**) so the new CORS value is used.
3. Open your **Vercel URL** in the browser. You should see the Swiggy clone; restaurants and Instamart should load if you ran the seed in Part 2.

---

## Quick Checklist

- [ ] Code is on GitHub  
- [ ] MongoDB Atlas: cluster created, user added, IP allowlist set, connection string saved  
- [ ] Render: backend deployed, env vars set (MONGO_URL, DB_NAME, JWT_SECRET, CORS_ORIGINS), **POST /api/seed** run  
- [ ] Vercel: frontend deployed, `NEXT_PUBLIC_BACKEND_URL` = backend URL  
- [ ] Backend CORS_ORIGINS includes your Vercel URL  
- [ ] Backend redeployed after CORS change  

---

## Troubleshooting

- **“Failed to load” or no restaurants**  
  - Check `NEXT_PUBLIC_BACKEND_URL` on Vercel (no trailing slash).  
  - Ensure you ran **POST /api/seed** on the backend (`/api/docs`).  
  - Open DevTools (F12) → Network and see if requests to your backend URL are blocked (CORS) or 4xx/5xx.

- **CORS errors in browser**  
  - CORS_ORIGINS on Render must exactly match your Vercel URL (including `https://`).  
  - Redeploy the backend after changing env vars.

- **Backend crashes on Render**  
  - In Render dashboard, check **Logs**.  
  - Verify MONGO_URL (password in the string, no `<` or `>` left).  
  - Ensure **Start Command** runs from `backend/` (e.g. `cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT`).

- **MongoDB connection failed**  
  - Atlas: Network Access must allow `0.0.0.0/0` (or include Render’s IPs).  
  - User password in MONGO_URL must be URL-encoded if it has special characters (e.g. `@` → `%40`).

---

## Optional: Custom Domain

- **Vercel:** Project → Settings → Domains → add your domain and follow DNS instructions.  
- **Render:** Web Service → Settings → Custom Domain.  
- After adding a domain, update **CORS_ORIGINS** and **NEXT_PUBLIC_BACKEND_URL** to use the new URLs if you use custom domains for both.

You’re done. Your Swiggy clone is live.
