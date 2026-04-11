# 🩺 SehatSaathi — Your Trusted Health Companion

![SehatSaathi Banner](https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1200&auto=format&fit=crop)

> **SehatSaathi** (meaning "Trusted Health Companion" in Hindi) is a mobile-first healthcare UI/UX prototype built for rural and semi-urban patients (age 35–65) managing chronic conditions with low digital literacy.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express)](https://expressjs.com)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Phone Login** | Passwordless login with mobile number — no email needed |
| 💊 **Medicine Reminders** | Add, edit, delete medicines with schedule, dosage, and frequency |
| ✅ **Adherence Tracking** | Daily progress bar showing medicines taken vs. pending |
| 🔊 **Text-to-Speech** | Read medicine names and instructions aloud for low-literacy users |
| 📂 **Health Records** | Upload and store prescriptions, lab reports, and medical bills |
| 👁️ **Record Viewer** | Tap any record to view details with full image preview |
| 💬 **Doctor Chat** | Chat with a doctor (Dr. Anjali Sharma) with smart AI-like replies |
| 🎤 **Voice Input** | Microphone button in doctor chat for hands-free messaging |
| ⚡ **Quick Replies** | One-tap common phrases for easy chatting with doctor |
| 🚨 **Emergency SOS** | Prominent emergency button visible on home screen at all times |
| 📱 **Fully Responsive** | Adapts from mobile (bottom nav) to desktop (sidebar navigation) |

---

## 🖥️ Tech Stack

**Frontend**
- [React 18](https://reactjs.org) + [TypeScript](https://typescriptlang.org)
- [Vite](https://vitejs.dev) — Lightning-fast dev server & bundler
- [Tailwind CSS v3](https://tailwindcss.com) — Utility-first styling
- [shadcn/ui](https://ui.shadcn.com) — Accessible component library (Radix UI)
- [TanStack Query v5](https://tanstack.com/query) — Server state management
- [Wouter](https://github.com/molefrog/wouter) — Lightweight client-side routing
- [Framer Motion](https://www.framer.com/motion/) — Smooth page transitions
- [Lucide React](https://lucide.dev) — Beautiful icons

**Backend**
- [Express.js v5](https://expressjs.com) — Fast, minimalist web framework
- [Drizzle ORM](https://orm.drizzle.team) — Type-safe database ORM
- [Zod](https://zod.dev) — Schema validation for API inputs

**Database**
- [PostgreSQL](https://postgresql.org) — Reliable relational database

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:
- [Node.js](https://nodejs.org) **v20 or higher**
- [npm](https://npmjs.com) v9+
- [PostgreSQL](https://postgresql.org) v14+

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/sehatsaathi.git
cd sehatsaathi
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/sehatsaathi
SESSION_SECRET=your-long-random-secret-here
NODE_ENV=development
PORT=5000
```

Generate a secure `SESSION_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Set Up the Database

Create the PostgreSQL database:

```bash
createdb sehatsaathi
```

Push the schema to the database (creates all tables):

```bash
npm run db:push
```

### 5. Run the App

```bash
npm run dev
```

Open [http://localhost:5000](http://localhost:5000) in your browser.

The first time you log in with a phone number, your account is created automatically with sample medicines and health records.

---

## 📁 Project Structure

```
sehatsaathi/
├── client/                   # React frontend
│   └── src/
│       ├── components/       # Shared UI components
│       │   ├── ui/           # shadcn/ui components
│       │   ├── Header.tsx
│       │   ├── BottomNav.tsx
│       │   ├── Sidebar.tsx
│       │   └── PageContainer.tsx
│       ├── hooks/
│       │   └── use-sehat-api.ts   # All API hooks (React Query)
│       ├── pages/
│       │   ├── Login.tsx
│       │   ├── Home.tsx
│       │   ├── Medicines.tsx
│       │   ├── Records.tsx
│       │   └── Doctor.tsx
│       ├── App.tsx
│       └── index.css         # Global styles & CSS variables
│
├── server/                   # Express backend
│   ├── index.ts              # App entry point
│   ├── routes.ts             # All API route handlers
│   ├── storage.ts            # Database access layer (Drizzle ORM)
│   ├── db.ts                 # Database connection
│   └── static.ts             # Static file serving (production)
│
├── shared/                   # Shared between frontend & backend
│   ├── schema.ts             # Database schema + Zod types
│   └── routes.ts             # API contract (paths, methods, schemas)
│
├── script/
│   └── build.ts              # Production build script
│
├── .env.example              # Environment variable template
├── .gitignore
├── drizzle.config.ts         # Drizzle ORM configuration
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/login` | Login / register via phone number |
| `POST` | `/api/logout` | Log out |
| `GET` | `/api/medicines?userId=X` | Get all medicines for user |
| `POST` | `/api/medicines` | Add a new medicine |
| `PATCH` | `/api/medicines/:id` | Edit a medicine |
| `PATCH` | `/api/medicines/:id/toggle` | Mark medicine as taken / not taken |
| `DELETE` | `/api/medicines/:id` | Delete a medicine |
| `POST` | `/api/medicines/reset` | Reset all medicines to "not taken" |
| `GET` | `/api/records?userId=X` | Get all health records for user |
| `POST` | `/api/records` | Upload a new health record |
| `DELETE` | `/api/records/:id` | Delete a health record |
| `GET` | `/api/messages?userId=X` | Get all chat messages |
| `POST` | `/api/messages` | Send a chat message |

---

## ☁️ Deployment

### Option A — Railway (Recommended, Free Tier Available)

1. Create a free account at [railway.app](https://railway.app)
2. Click **New Project → Deploy from GitHub repo**
3. Select this repository
4. Add a **PostgreSQL** plugin from Railway's dashboard
5. Set these environment variables in Railway's settings:
   ```
   DATABASE_URL   → (auto-filled by Railway PostgreSQL plugin)
   SESSION_SECRET → (generate a random string)
   NODE_ENV       → production
   ```
6. Railway detects `npm run build` + `npm run start` automatically
7. Your app is live at `https://your-app.railway.app`

---

### Option B — Render (Free Tier Available)

1. Create a free account at [render.com](https://render.com)
2. Click **New → Web Service → Connect GitHub**
3. Select this repository
4. Configure:
   ```
   Build Command:  npm install && npm run build
   Start Command:  npm run start
   ```
5. Add a **PostgreSQL** database from Render's dashboard
6. Set `DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV=production` in environment settings
7. Your app is live at `https://your-app.onrender.com`

---

### Option C — VPS / Self-hosted (Ubuntu)

```bash
# 1. Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y
sudo -u postgres createdb sehatsaathi

# 3. Clone and build
git clone https://github.com/YOUR_USERNAME/sehatsaathi.git
cd sehatsaathi
npm install
cp .env.example .env
# Edit .env with your values
npm run db:push
npm run build

# 4. Start with PM2 (keeps app running)
npm install -g pm2
pm2 start "npm run start" --name sehatsaathi
pm2 save && pm2 startup
```

---

### Build Commands Reference

```bash
npm run dev        # Start development server (hot reload)
npm run build      # Build for production
npm run start      # Start production server
npm run check      # TypeScript type checking
npm run db:push    # Push schema changes to database
```

---

## 🎨 Design System

The app uses a custom healthcare color palette defined in `client/src/index.css`:

| Token | Color | Hex | Purpose |
|-------|-------|-----|---------|
| `--primary` | Deep Medical Green | `#1B5E20` | Primary actions, navigation |
| `--secondary` | Trust Blue | `#1976D2` | Information, records |
| `--accent` | Warm Orange | `#FF9100` | Calls-to-action, camera |
| `--background` | Warm Neutral | `#FAF9F6` | Reduces eye strain for seniors |

Typography: **Inter** (body) + **Poppins** (headings)

---

## ♿ Accessibility & UX Principles

- **Minimum 48px touch targets** on all interactive elements
- **Icons always paired with text** labels — no icon-only buttons
- **Text-to-Speech (TTS)** on medicine names and instructions
- **Large font sizes** (base 16px+) throughout the app
- **High contrast** color combinations (WCAG AA compliant)
- **Simple navigation** — max 2 taps to reach any feature
- **Confirmation dialogs** before any destructive action (delete)

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create your branch: `git checkout -b feature/my-new-feature`
3. Make your changes and test locally
4. Commit: `git commit -m "feat: add my new feature"`
5. Push: `git push origin feature/my-new-feature`
6. Open a **Pull Request** — describe what you changed and why

Please follow the existing code style (TypeScript, ESM modules, Tailwind CSS classes).

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- Built with ❤️ for rural healthcare accessibility in India
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Stock photos from [Unsplash](https://unsplash.com)

---

*SehatSaathi — स्वस्थ रहें, खुश रहें (Stay healthy, stay happy)*
