# 🎨 Frontend Documentation - Mathscriber AI

## Overview

Next.js 16 application with React 19, featuring a modern dashboard for image-to-LaTeX conversion with real-time collaboration features.

## Tech Stack

- **Framework**: Next.js 16.0.6 (App Router + Turbopack)
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 3.4.3 + DaisyUI 5.5.5
- **Icons**: Lucide React 0.344.0
- **Animations**: tailwindcss-animate 1.0.7
- **Type Safety**: TypeScript 5.4.5

## Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication group
│   │   ├── login/                # Login page
│   │   └── register/             # Registration page
│   ├── (dashboard)/              # Dashboard group (protected routes)
│   │   ├── page.tsx              # Main dashboard
│   │   ├── upload/               # Image upload page
│   │   ├── playground/           # LaTeX editor & tools
│   │   ├── results/              # Conversion history
│   │   ├── templates/            # LaTeX templates
│   │   └── analytics/            # Usage analytics
│   ├── api/                      # API routes (BFF pattern)
│   │   ├── auth/                 # Auth endpoints
│   │   ├── convert/              # Conversion endpoint
│   │   └── websocket/            # WebSocket handler
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/                   # Reusable components
│   ├── converter/                # Conversion-related components
│   │   ├── ImageUploader.tsx    # Drag-drop upload
│   │   ├── ModelSelector.tsx    # AI model selection
│   │   ├── ResultViewer.tsx     # LaTeX results display
│   │   └── LaTeXEditor.tsx      # Code editor
│   ├── playground/               # Playground tools
│   │   ├── GraphVisualizer.tsx  # Function plotting
│   │   ├── StepSolver.tsx       # Step-by-step solutions
│   │   └── FormatToolbar.tsx    # Formatting tools
│   ├── collaboration/            # Real-time features
│   │   ├── CollabEditor.tsx     # Collaborative editor
│   │   └── UserCursors.tsx      # User cursor tracking
│   └── ui/                       # UI primitives
│       ├── Button.tsx            # Button component
│       ├── Input.tsx             # Input component
│       ├── Card.tsx              # Card components
│       ├── Badge.tsx             # Badge component
│       └── Modal.tsx             # Modal dialog
├── lib/                          # Utilities
│   └── utils.ts                  # Helper functions
├── public/                       # Static assets
├── tailwind.config.js            # Tailwind configuration
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies
```

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm
- Backend running on http://127.0.0.1:8000

### 2. Install Dependencies

```bash
cd frontend

# Important: Always use --legacy-peer-deps flag
npm install --legacy-peer-deps
```

**Why `--legacy-peer-deps`?**
React 19 is new and some packages haven't updated peer dependencies yet. This flag allows installation to proceed.

### 3. Configure Environment

Create `.env.local` file in `frontend/` directory:

```env
# Backend API endpoint
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

# WebSocket endpoint
NEXT_PUBLIC_WS_URL=ws://127.0.0.1:8000

# Optional: Analytics
# NEXT_PUBLIC_ANALYTICS_ID=
```

### 4. Start Development Server

```bash
npm run dev
```

Server runs at: **http://localhost:3000**

## Routes & Pages

### Public Routes

- **`/`** - Landing page with features showcase
- **`/login`** - User login
- **`/register`** - User registration

### Dashboard Routes (Protected)

- **`/dashboard`** - Overview with stats and recent conversions
- **`/upload`** - Image upload and conversion
- **`/playground`** - LaTeX editor with live preview
- **`/results`** - Conversion history table
- **`/templates`** - Pre-built LaTeX templates library
- **`/analytics`** - Usage statistics and charts

### API Routes (Backend Proxy)

- **`POST /api/auth/login`** - Login endpoint
- **`POST /api/auth/register`** - Registration endpoint
- **`POST /api/convert`** - Image conversion endpoint
- **`GET /api/websocket`** - WebSocket connection

## Key Components

### ImageUploader

Drag-and-drop file upload component.

**Props:**
```typescript
interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  maxSize?: number;
  acceptedFormats?: string[];
}
```

**Usage:**
```tsx
<ImageUploader 
  onImageSelect={(file) => console.log(file)}
  maxSize={5 * 1024 * 1024} // 5MB
  acceptedFormats={['image/jpeg', 'image/png']}
/>
```

### ModelSelector

AI model selection dropdown.

**Props:**
```typescript
interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}
```

**Usage:**
```tsx
<ModelSelector 
  selectedModel="gemini-2.0-flash"
  onModelChange={(model) => setModel(model)}
/>
```

### ResultViewer

Display LaTeX conversion results with copy/download.

**Props:**
```typescript
interface ResultViewerProps {
  latexCode: string;
  renderPreview?: boolean;
}
```

**Usage:**
```tsx
<ResultViewer 
  latexCode="\frac{a}{b} = c"
  renderPreview={true}
/>
```

### LaTeXEditor

Code editor with syntax highlighting.

**Props:**
```typescript
interface LaTeXEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}
```

**Usage:**
```tsx
<LaTeXEditor 
  value={latexCode}
  onChange={(code) => setLatexCode(code)}
/>
```

## Styling System

### Tailwind + DaisyUI

**Custom Colors (tailwind.config.js):**
```javascript
theme: {
  extend: {
    colors: {
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: "hsl(var(--primary))",
      secondary: "hsl(var(--secondary))",
    }
  }
}
```

**Using DaisyUI Components:**
```tsx
<button className="btn btn-primary">Click Me</button>
<div className="card bg-base-200">
  <div className="card-body">Content</div>
</div>
```

### Custom Utilities (lib/utils.ts)

```typescript
import { cn } from '@/lib/utils';

// Merge class names
<div className={cn("base-class", condition && "conditional-class")} />
```

## TypeScript Guide

### For JavaScript Developers

Don't worry about complex TypeScript! Use these quick fixes:

**1. Unknown type errors:**
```typescript
// Just add `: any`
const data: any = unknownValue;
function handleClick(e: any) { }
```

**2. Object props:**
```typescript
// Add quick interface
interface Props {
  title: string;
  onClick?: any;
  children?: any;
}
```

**3. Event handlers:**
```typescript
onClick={(e: any) => handleClick(e)}
onChange={(e: any) => setValue(e.target.value)}
```

### Component Template

```tsx
'use client';
import { useState } from 'react';

interface MyComponentProps {
  title: string;
  onSave?: (data: any) => void;
}

export default function MyComponent({ title, onSave }: MyComponentProps) {
  const [value, setValue] = useState('');
  
  return (
    <div className="p-4">
      <h1>{title}</h1>
      <input 
        value={value}
        onChange={(e: any) => setValue(e.target.value)}
      />
    </div>
  );
}
```

## API Integration

### Calling Backend APIs

```typescript
// Using fetch
async function convertImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/convert-image/`, {
    method: 'POST',
    body: formData,
  });
  
  const data = await response.json();
  return data;
}

// Usage in component
const handleUpload = async (file: File) => {
  try {
    const result = await convertImage(file);
    console.log(result.latex_code);
  } catch (error) {
    console.error('Conversion failed:', error);
  }
};
```

### API Route Example

```typescript
// app/api/convert/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const image = formData.get('image');
  
  // Forward to Django backend
  const backendResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/convert-image/`,
    {
      method: 'POST',
      body: formData,
    }
  );
  
  const data = await backendResponse.json();
  return NextResponse.json(data);
}
```

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npx tsc --noEmit

# Clean cache
rm -rf .next node_modules
npm install --legacy-peer-deps
```

## Troubleshooting

### Port 3000 Already in Use

**Windows:**
```powershell
netstat -ano | findstr :3000
taskkill /PID <number> /F
```

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

### npm Install Errors

**Always use the flag:**
```bash
npm install --legacy-peer-deps
```

**If still failing:**
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Module Not Found

```bash
npm install --legacy-peer-deps
rm -rf .next
npm run dev
```

### TypeScript Errors

**Quick fix - use `any`:**
```typescript
const data: any = unknownValue;
```

**Ignore file:**
```typescript
// @ts-nocheck at top of file
```

### Build Errors

```bash
# Clear everything
rm -rf .next node_modules
npm install --legacy-peer-deps
npm run build
```

## Performance Tips

1. **Use Next.js Image component** for optimized images
2. **Code splitting** - Dynamic imports for heavy components
3. **Memoization** - Use `useMemo` and `useCallback`
4. **Lazy loading** - Load components when needed
5. **API caching** - Use SWR or React Query

## Deployment

### Vercel (Recommended)

```bash
npm run build
# Deploy to Vercel
vercel --prod
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Environment Variables

### Required

- `NEXT_PUBLIC_API_URL` - Backend API URL

### Optional

- `NEXT_PUBLIC_WS_URL` - WebSocket URL
- `NEXT_PUBLIC_ANALYTICS_ID` - Analytics tracking

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

## Dependencies Reference

```json
{
  "next": "16.0.6",
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "typescript": "5.4.5",
  "tailwindcss": "3.4.3",
  "daisyui": "5.5.5",
  "tailwindcss-animate": "1.0.7",
  "lucide-react": "0.344.0",
  "clsx": "2.1.1",
  "tailwind-merge": "3.4.0",
  "katex": "0.16.25"
}
```

## Useful Resources

- [Next.js 16 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI Components](https://daisyui.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Best Practices

1. **File naming**: Use PascalCase for components, kebab-case for utilities
2. **Component structure**: One component per file
3. **State management**: Keep state close to where it's used
4. **Error handling**: Always wrap async calls in try-catch
5. **Accessibility**: Use semantic HTML and ARIA labels

---

**Last Updated**: December 2, 2025  
**Maintained By**: Solvio Hackathon Team
