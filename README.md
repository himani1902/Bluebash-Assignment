# Micro-Frontend POC (React + JSX, Webpack 5 Module Federation)

This repository demonstrates a modular and scalable micro-frontend architecture with a Host application and two micro-apps: Chat and Email.

## Deliverables overview
- Tools & frameworks: see [Tools and frameworks](#tools-and-frameworks)
- Setup & run: see [Getting started](#getting-started)
- Architectural decisions & trade-offs: see [Architectural decisions and trade-offs](#architectural-decisions-and-trade-offs)
- Public GitHub repo: see [Publish to GitHub](#publish-to-github)
- Hosting on Vercel: see [Deploy to Vercel](#deploy-to-vercel)

## Apps and ports
- host: http://localhost:3000
- chat-app: http://localhost:3001
- email-app: http://localhost:3002

## Getting started
Open three terminals (one per app) and run:

```bash
# Terminal 1
cd host
npm install
npm run start

# Terminal 2
cd chat-app
npm install
npm run start

# Terminal 3
cd email-app
npm install
npm run start
```

Visit the host at `http://localhost:3000`.

## Architecture
- Host exposes `host/design-system/Button`, `host/design-system/Card`, and `host/event-bus`.
- Remotes (`chat-app`, `email-app`) consume shared UI and event bus via Module Federation.
- Communication: host emits `broadcast`; chat emits `chat:new-message`; email listens and shows last message.

## Architectural decisions and trade-offs
- Module Federation (Webpack 5): Native, mature runtime integration for micro-frontends without rebuilding the host; simple remotes/exposes mapping.
- Shared singletons: `react` and `react-dom` are singletons to prevent multiple React copies (avoids hooks/context issues).
- Event bus for communication: Decoupled, simple pub/sub across apps. Alternatives considered: shared state library, URL events, custom DOM events.
- `publicPath: 'auto'`: Ensures assets load correctly from each origin during development and can be adjusted for production.

## Tools and frameworks
- React 18 (JSX)
- Webpack 5 + Module Federation
- Babel (`@babel/preset-env`, `@babel/preset-react`)
- Webpack Dev Server for local development
- Simple custom event bus for cross-MFE communication

## Structure
```
host/
  public/index.html
  src/
    App.jsx
    index.jsx
    design-system/{Button.jsx, Card.jsx}
    eventBus.js
  webpack.config.js
chat-app/
  public/index.html
  src/{index.jsx, ChatApp.jsx}
  webpack.config.js
email-app/
  public/index.html
  src/{index.jsx, EmailApp.jsx}
  webpack.config.js
```

## Notes
- React 18 (JSX), Webpack 5, Babel.
- Shared `react` and `react-dom` as singletons.

## How to add a new micro-app
1. Create a new folder at the repo root, e.g. `notifications-app/`, with `public/index.html`, `src/{index.jsx, NotificationsApp.jsx}`, `package.json`, and `webpack.config.js` (copy from `chat-app` and update names/ports).
2. In the new app’s `webpack.config.js`:
   - Set `name` (e.g., `notifications_app`) and `filename: 'remoteEntry.js'` in `ModuleFederationPlugin`.
   - Expose your entry: `exposes: { './NotificationsApp': './src/NotificationsApp.jsx' }`.
   - Add `remotes: { host: 'host@http://localhost:3000/remoteEntry.js' }` to consume the design system and event bus.
3. In `host/webpack.config.js`, add the remote:
   - `remotes: { ..., notifications_app: 'notifications_app@http://localhost:3003/remoteEntry.js' }`.
4. In `host/src/App.jsx`, lazy-load and render it similar to Chat/Email:
   - `const NotificationsApp = React.lazy(() => import('notifications_app/NotificationsApp'));`
   - Add a tab/toggle and render conditionally inside the existing `Suspense`/`ErrorBoundary`.
5. Reuse the design system and event bus from `host` in your new app via imports like `import { Button } from 'host/design-system'` and `import eventBus from 'host/event-bus'`.
6. Run the new app on its own port and start all apps.

## React version alignment
- Keep `react` and `react-dom` versions identical across all apps. They are shared as singletons via Module Federation, which avoids multiple copies of React at runtime. If you bump React in one app, bump in all apps to the same version and reinstall.

## Optional deployment tips
- Deploy each app (host and remotes) to a static host (e.g., Netlify/Vercel). Note the public URLs for each `remoteEntry.js`.
- Update `host/webpack.config.js` remotes to point to the deployed `remoteEntry.js` URLs (e.g., `chat_app@https://<your-chat-domain>/remoteEntry.js`).
- Consider cache-busting: either set long cache TTLs but avoid immutable caching for `remoteEntry.js`, or include a content hash/unique URL per deployment and update the host remotes accordingly.

## Production build and run
Each app:
```bash
cd host && npm run build
cd chat-app && npm run build
cd email-app && npm run build
```
Serve the `dist` of each app behind stable URLs and update `remotes` in `host/webpack.config.js` to point to those `remoteEntry.js` files for production.

## Publish to GitHub
From the repository root (the folder that contains `host/`, `chat-app/`, `email-app/`):

```bash
git init
git add .
git commit -m "feat: initial micro-frontend POC"
# Create a new empty public repo on GitHub (via UI), then set it as origin:
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Notes:
- Ensure no secrets are committed. This repo contains only client code and config.
- If you already initialized git locally, just add the remote and push.

## Deploy to Vercel
This is a monorepo with three independent static builds. Create three Vercel projects, each pointing to a different subdirectory.

1) Create three projects
- Project 1 (host)
  - Framework preset: "Other"
  - Root directory: `host`
  - Build command: `npm run build`
  - Output directory: `dist`
- Project 2 (chat-app)
  - Framework preset: "Other"
  - Root directory: `chat-app`
  - Build command: `npm run build`
  - Output directory: `dist`
- Project 3 (email-app)
  - Framework preset: "Other"
  - Root directory: `email-app`
  - Build command: `npm run build`
  - Output directory: `dist`

2) Get the deployed URLs
- After each project deploys, note these URLs:
  - `https://<chat-domain>/remoteEntry.js`
  - `https://<email-domain>/remoteEntry.js`
  - `https://<host-domain>/` (final user entry point)

3) Point the host to production remotes
- Edit `host/webpack.config.js` `remotes` for production builds to use the deployed remote URLs:

```js
// host/webpack.config.js (snippet)
remotes: {
  chat_app: 'chat_app@https://<chat-domain>/remoteEntry.js',
  email_app: 'email_app@https://<email-domain>/remoteEntry.js'
}
```

4) Redeploy host
- Commit the change and redeploy the host project on Vercel. Now the host will load remotes from their Vercel URLs.

Tips:
- Keep `publicPath: 'auto'`.
- In dev, keep localhost URLs; in prod, use Vercel URLs. If you prefer, you can switch based on an environment variable.
- Vercel caches static assets aggressively; invalidate or version remote URLs if you change remote code frequently.

## Troubleshooting
- Ports in use (EADDRINUSE):
  - Windows PowerShell:
    ```powershell
    taskkill /F /IM node.exe
    ```
  - Or kill specific PIDs bound to ports 3000/3001/3002 using `netstat -ano | findstr :<port>` and `taskkill /PID <PID> /F`.
- Remote fails to load: Ensure `http://localhost:3001/remoteEntry.js` and `http://localhost:3002/remoteEntry.js` are reachable, then refresh `http://localhost:3000/`.
- React version mismatch: Keep `react`/`react-dom` versions aligned across apps.

## Optional: start all apps from root
Add a root `package.json` with a `start:all` script using `concurrently`:
```json
{
  "private": true,
  "scripts": {
    "start:all": "concurrently \"cd host && npm start\" \"cd chat-app && npm start\" \"cd email-app && npm start\""
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```
