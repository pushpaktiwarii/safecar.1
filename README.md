# Aidlyn - Premium Emergency QR System 🛡️

A modern, mobile-first web application designed to secure vehicles and provide an instant emergency contact system via a beautifully designed QR code sticker. 

Aidlyn ensures that helpers and rescuers can notify you about your vehicle (Accidents, Windows Left Open, Blocking the Way) without you having to expose your private phone number to the public.

![Aidlyn Preview](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge) ![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react) ![NodeJS](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js) 

## ✨ Key Features

- **Dynamic QR Generation**: Generates high-quality, print-ready QR stickers with distinct layouts for **Cars (Standard Windshield)** and **Bikes (Compact Square)**.
- **True Cross-Theme Support**: Fully responsive Light and Dark modes with seamless CSS variable integration.
- **Glassmorphism UI**: Premium "Bento Grid" layout with dynamic hovering, sophisticated typography, and engaging micro-animations.
- **Total Privacy**: Users can instantly toggle their contact visibility on or off. Rescuers don't need an app to scan or report an incident.
- **Smart WhatsApp Integration**: Allows rescuers to send a pre-formatted WhatsApp message with one tap.

## 🚀 Local Development Quick Start

If you are running the project locally, you can use the built-in root scripts:

1. **Install Dependencies** (First time only):
    ```bash
    npm run install-all
    ```

2. **Start the App**:
    ```bash
    npm run dev
    ```
    This concurrently starts the Node/Express Backend on `http://localhost:3000` and the Vite React Frontend on `http://localhost:5173`.

## 📂 Architecture

- `server/` - Node.js + Express
  - Uses `better-sqlite3` for high-performance local database.
  - JWT Authentication for secure owner dashboards.
- `client/` - React + Vite
  - Custom CSS Design System (`index.css` & CSS Variables).
  - Component-based architecture with `lucide-react` icons.

## 🌐 Production Deployment Guide

Aidlyn is structured to be easily deployed to modern cloud providers.

### 1. Deploying the Backend (Render / Railway)
1. Commit the code to GitHub.
2. In your hosting provider, create a new Web Service and link your repository.
3. Set the **Root Directory** to `server`.
4. **Build Command**: `npm install`
5. **Start Command**: `npm start` (or `node src/index.js`)
6. **Environment Variables**: Add `JWT_SECRET` with a secure random string.

### 2. Deploying the Frontend (Vercel)
1. Link your GitHub repository to Vercel.
2. Set the **Root Directory** to `client`.
3. Vercel will automatically detect Vite and run `npm run build`.
4. **Important**: Because the frontend uses Vite's proxy locally, you must create a `vercel.json` in the `client` directory to proxy `/api` routes to your live backend URL:
    ```json
    {
      "rewrites": [
        {
          "source": "/api/(.*)",
          "destination": "https://<YOUR_RENDER_URL>/api/$1"
        },
        {
          "source": "/(.*)",
          "destination": "/index.html"
        }
      ]
    }
    ```

## 🔒 Security Summary
- Passwords are cryptographically hashed using `bcryptjs`.
- Session management is handled securely via `HttpOnly` cookies and JSON Web Tokens.
- No sensitive PII is exposed on the public QR page unless explicitly enabled by the owner.
