# Matrix Todo Dashboard

A modern, interactive todo application with drag-and-drop functionality, subtasks, ideas capture system, and AI-powered productivity assistant.

## Features

- Matrix-based task organization (Business, Finance, Personal)
- Priority levels (This Week, This Month, This Quarter)
- Drag and drop tasks between priorities
- Subtasks support
- Ideas capture and conversion to tasks
- Real-time statistics
- **AI-Powered Productivity Assistant** - Claude-powered chatbot for task organization, priority assessment, and productivity guidance

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up Claude API (for AI assistant):
   - Get an API key from [Anthropic](https://console.anthropic.com/)
   - Create a `.env.local` file in the root directory:
   ```
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```
   - For production deployment on Vercel, add the environment variable in your Vercel project settings

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Deployment Options

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variable in Vercel project settings:
   - Go to Project Settings → Environment Variables
   - Add `ANTHROPIC_API_KEY` with your Claude API key
4. Deploy with zero configuration

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

## AI Assistant Features

The productivity assistant powered by Claude can help you with:

- **Task Organization**: Convert thoughts into actionable tasks with proper categories
- **Priority Assessment**: Get suggestions on what to focus on based on your current workload
- **Progress Review**: Celebrate wins and identify areas for improvement
- **Stuck? Get Help**: Receive suggestions when you're feeling blocked or overwhelmed
- **Strategic Planning**: Help with long-term planning and goal setting
- **Brain Dump Processing**: Organize scattered thoughts into structured tasks and ideas

### Example Prompts
- "Help me organize my thoughts"
- "What should I focus on this week?"
- "I'm stuck on [specific task], any suggestions?"
- "Review my progress and suggest next steps"
- "Help me break down [big task] into smaller pieces"