# Kalman filter visualisation


Welcome! This repo contains a React project for a pedagogical introduction to the Kalman filter. Check it out at https://tomkimpson.github.io/kalman-filter-viz/. 


If you just want to learn about Kalman filtering, click the link and ignore everything else below. What follows are instructions for running the app locally, making changes, and deploying updates.


---

## 📦 Getting Started

1. **Install dependencies**  
   Run this once after cloning the repo:
   ```bash
   npm install
   ```

2. **Start the development server**  
   This runs the app locally with hot reloading:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) (or the port shown) in your browser.

---

## 🛠 Making Changes

- Edit React components inside the `src/` folder.
- The app will automatically reload when you save changes.
- Use consistent code formatting. (Optional: run `npm run lint` or `npm run format` if available.)

---

## 🚀 Deploying to Production

⚠️ **IMPORTANT:** Only deploy from the `main` branch to avoid accidentally pushing unfinished changes to production.

### ✅ Deployment Steps
1. **Switch to the `main` branch and pull the latest changes:**
   ```bash
   git checkout main
   git pull
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```
   This creates optimized static files in the `dist/` folder.

3. **Deploy the build:**
   ```bash
   npm run deploy
   ```
   This will publish the contents of `dist/` to the `gh-pages` branch, updating the live site.

---

## ✅ Additional Commands

| Command           | Description                                                   |
|-------------------|---------------------------------------------------------------|
| `npm run dev`     | Start the development server with hot reload                  |
| `npm run build`   | Create a production build                                     |
| `npm run deploy`  | Deploy the latest build (⚠️ Only from `main` branch)          |
| `npm run lint`    | Run lint checks (if configured)                               |
| `npm run format`  | Auto-format code with Prettier (if configured)                |

---

## 💡 Notes and Best Practices

- **Test your changes locally** (`npm run dev`) before building or deploying.
- **Deploy from `main` only** — this ensures only reviewed, production-ready code goes live.
- If you’re on a feature branch, merge your changes into `main` first before deploying:
   ```bash
   git checkout main
   git merge feature/your-branch
   git push
   ```
- If you run into issues, check `package.json` scripts or open an issue.
