import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env.local') });

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Data file path
const DATA_FILE_PATH = join(__dirname, 'dashboard-data.json');

// Helper functions for file operations
const loadData = async () => {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('No existing data file found, using default data');
    return {
      todos: {
        venture: {
          icon: "💼",
          color: "bg-blue-600",
          items: []
        },
        finance: {
          icon: "💰",
          color: "bg-green-600",
          items: []
        },
        personal: {
          icon: "👤",
          color: "bg-purple-600",
          items: []
        }
      },
      ideas: [],
      categoryLinks: {
        venture: [],
        finance: [],
        personal: []
      },
      chatMessages: [],
      lastSaved: null
    };
  }
};

const saveData = async (data) => {
  try {
    data.lastSaved = new Date().toISOString();
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2));
    console.log('Data saved successfully');
    return { success: true };
  } catch (error) {
    console.error('Error saving data:', error);
    return { success: false, error: error.message };
  }
};

// Data persistence endpoints
app.get('/api/data', async (req, res) => {
  try {
    const data = await loadData();
    res.json(data);
  } catch (error) {
    console.error('Error loading data:', error);
    res.status(500).json({ error: 'Failed to load data' });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    const data = req.body;
    const result = await saveData(data);
    if (result.success) {
      res.json({ success: true, lastSaved: data.lastSaved });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Claude API endpoint
app.post('/api/claude', async (req, res) => {
  try {
    const { userMessage, context } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'User message is required' });
    }

    // Create a comprehensive prompt for the productivity assistant
    const systemPrompt = `You are a productivity assistant helping with a Matrix-style todo dashboard. You have access to the user's current tasks, ideas, and progress.

Your role is to:
1. Help organize thoughts into actionable tasks and ideas
2. Suggest priorities and categories for work
3. Review progress and suggest next steps
4. Provide motivation and suggestions when the user is stuck
5. Help with planning and strategy
6. Break down complex tasks into smaller, manageable pieces

Keep responses concise but helpful. Be encouraging and actionable. If the user wants to add tasks or ideas, suggest specific actions they can take.

Current Context:
${JSON.stringify(context, null, 2)}

User Message: "${userMessage}"

Please provide a helpful, actionable response that takes into account their current dashboard state.`;

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: systemPrompt
        }
      ],
      temperature: 0.7,
    });

    // Extract the response content
    const response = message.content[0].text;

    res.status(200).json({ 
      response,
      usage: {
        input_tokens: message.usage.input_tokens,
        output_tokens: message.usage.output_tokens
      }
    });

  } catch (error) {
    console.error('Claude API Error:', error);
    
    // Handle specific API errors
    if (error.status === 401) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    
    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }
    
    if (error.status === 400) {
      return res.status(400).json({ error: 'Invalid request to Claude API' });
    }

    res.status(500).json({ 
      error: 'Failed to get response from Claude',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
}); 