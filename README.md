# LLM Chat Interface

A modern, responsive **chat application** (interface / frontend) inspired by other popular llm chat websites, built with **React**, **Firebase**, and **Cloudflare Workers** for API proxying.  
It features real-time messaging, chat management (rename/delete), authentication, dark mode, and mobile optimization.

---

## Features

- **Firebase Authentication** — Secure login and signup with form validation using React Hook Form + Zod
- **Firestore Database** — Real-time chatrooms and message syncing
- **Cloudflare Worker Proxy** — Securely connects the app to the Gemini API without exposing keys
- **Chat Management** — Rename or delete existing chats seamlessly
- **Dark / Light Mode** — Automatic theme toggle for a comfortable UX
- **Responsive Design** — Optimized layout for both desktop and mobile devices
- **Debounced Search** — Search for chatrooms in real time without excessive queries
- **Modern UI** — Built with TailwindCSS and React for a smooth, minimal experience

---

## 🛠️ Tech Stack

| Layer            | Technology                                     |
| ---------------- | ---------------------------------------------- |
| Frontend         | React + TypeScript + Vite                      |
| UI Styling       | TailwindCSS                                    |
| State Management | React Hooks                                    |
| Form Validation  | React Hook Form + Zod                          |
| Backend          | Firebase Firestore                             |
| Auth             | Firebase Authentication                        |
| API Proxy        | Cloudflare Workers                             |
| Hosting          | Cloudflare Pages / Firebase Hosting (optional) |

---

## ⚙️ Setup & Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/clxsh19/llm-chat.git
   cd llm-chat
   npm install
   # or
   yarn install

   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # creat a cloudflare worker or a minimal backend if you wish to hide your api key from users
   VITE_WORKER_URL=https://your-cloudflare-worker-url.workers.dev

   npm run dev
   ```
