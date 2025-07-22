import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
      model: 'claude-3-sonnet-20240229',
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
} 