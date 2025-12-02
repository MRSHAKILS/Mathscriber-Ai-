# Frontend - Mathscriber AI

Next.js frontend for Mathscriber AI with modern Neumorphism design.

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.local.example .env.local
```

3. Start development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Features

- 🖼️ **Upload Page** - Upload images for conversion
- ✏️ **Canvas Scanner** - Draw equations on digital canvas
- 📋 **Results Page** - View and copy LaTeX code
- 🎨 **Neumorphism UI** - Clean, modern design

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Lucide React (icons)

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx           # Home page
│   ├── upload/page.tsx    # Upload page
│   ├── scan/page.tsx      # Canvas page
│   ├── result/page.tsx    # Results page
│   └── layout.tsx         # Root layout
├── components/
│   ├── ImageUploader.tsx  # Upload component
│   ├── LatexResult.tsx    # Results component
│   ├── Navbar.tsx
│   └── Footer.tsx
└── lib/
    └── api.ts             # API utilities
```

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8000/api)

## Styling

Uses TailwindCSS with custom Neumorphism shadows:

- `shadow-neu` - Standard Neumorphism effect
- `shadow-neu-lg` - Large Neumorphism effect
- `shadow-neu-inset` - Inset effect for inputs
