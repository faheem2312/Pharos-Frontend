# Pharos Frontend — Cloud Operations & Observability Web Dashboard

[![Live App Status](https://img.shields.io/badge/Live_App-Online-000000?style=for-the-badge&logo=vercel)](https://pharos-frontend-nine.vercel.app)
[![Backend Repository](https://img.shields.io/badge/Backend_Repo-Pharos--Backend-0284c7?style=for-the-badge&logo=github)](https://github.com/faheem2312/Pharos-Backend)
[![Live Backend API](https://img.shields.io/badge/Live_API-pharos--backend.onrender.com-22c55e?style=for-the-badge&logo=render)](https://pharos-backend-blcm.onrender.com/health)

**Pharos Frontend** is a modern, high-speed cloud operations and observability dashboard built with Next.js 15 (App Router), React 18, and TailwindCSS. It provides real-time event monitoring, log filtering, developer API key governance, direct S3 file asset uploads, and system metrics visualization.

---

## 🔗 Repository & Live Deployment Links

- **Frontend GitHub Repository**: [https://github.com/faheem2312/Pharos-Frontend](https://github.com/faheem2312/Pharos-Frontend)
- **Backend GitHub Repository**: [https://github.com/faheem2312/Pharos-Backend](https://github.com/faheem2312/Pharos-Backend)
- **Live Production App**: [https://pharos-frontend-nine.vercel.app](https://pharos-frontend-nine.vercel.app)
- **Live Production API**: [https://pharos-backend-blcm.onrender.com](https://pharos-backend-blcm.onrender.com)

---

## 🚀 Key Features & UI Architecture

### 1. Real-Time System Metrics & Socket.IO Beacon Status
- **Lighthouse Status Indicator**: Live WebSockets status indicator (`components/beacon-status.tsx`) that pulses dynamically based on real-time server health.
- **Interactive Metric Charts**: Renders live system request volume and event trend charts using **Recharts**.

### 2. Transparent Authentication & Cookie-Based Security
- **`httpOnly` Session Management**: Secure user authentication (`/login`, `/register`). Access tokens and refresh tokens are handled transparently via encrypted `httpOnly` cookies.
- **Silent Token Refresh**: The `apiFetch()` utility transparently refreshes expired session access tokens on 401 status codes without interrupting user workflow.

### 3. Developer API Key Management
- Issue, list, and revoke programmatic developer API keys with masked key prefixes (`pk_live_...`).

### 4. Direct Cloud File Storage UI
- Request Cloudflare R2 / S3 presigned upload URLs and stream large file assets directly to cloud object storage.

---

## 🎨 Design System & Theme Tokens

- **Background**: Deep night-sea dark mode canvas (`#0b0f17`).
- **Accent Theme**: Warm beacon amber for primary actions and health signals.
- **Metrics Theme**: Sea-glass green and cyan for operational telemetry metrics.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router), React 18 | High-performance server and client rendering |
| **Styling** | TailwindCSS, Lucide Icons, Shadcn patterns | Modern glassmorphism UI components |
| **Charts & Telemetry**| Recharts | Interactive time-series log and event graphs |
| **Real-Time Client** | Socket.IO Client (`socket.io-client`) | WebSocket streaming for live health and event updates |
| **Deployment** | Vercel | Global Edge distribution and automated deployments |

---

## ⚙️ Environment Variables

Create a `.env` file in `frontend/` based on `.env.example`:

```env
# Backend API Target (Local or Deployed Cloud Backend)
NEXT_PUBLIC_API_URL=https://pharos-backend-blcm.onrender.com
```

> **Note on Next.js Rewrites**: In `next.config.mjs`, all `/api/*` frontend calls are automatically proxied to `NEXT_PUBLIC_API_URL`. Trailing slashes are automatically sanitized.

---

## 💻 Local Setup & Execution

```bash
# 1. Install dependencies
npm install

# 2. Start Next.js Development Server
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

---

## ☁️ Deployment on Vercel

1. Import repository `faheem2312/Pharos-Frontend` into [Vercel](https://vercel.com/new).
2. Set Environment Variable:
   - `NEXT_PUBLIC_API_URL`: `https://pharos-backend-blcm.onrender.com`
3. Click **Deploy**.
