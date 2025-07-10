# Matrix Todo Dashboard

A modern, interactive todo application with drag-and-drop functionality, subtasks, and an ideas capture system.

## Features

- Matrix-based task organization (Business, Finance, Personal)
- Priority levels (This Week, This Month, This Quarter)
- Drag and drop tasks between priorities
- Subtasks support
- Ideas capture and conversion to tasks
- Real-time statistics

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Deployment Options

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Deploy with zero configuration

### Netlify
1. Push code to GitHub
2. Connect repository on [Netlify](https://netlify.com)
3. Deploy automatically

### GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts: `"deploy": "vite build && gh-pages -d dist"`
3. Run: `npm run deploy`

### Static Hosting
After running `npm run build`, upload the `dist` folder to any static hosting service.