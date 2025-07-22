import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Helper functions for Supabase operations
const loadData = async () => {
  try {
    const { data, error } = await supabase
      .from('dashboard_data')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error loading data from Supabase:', error);
      throw error;
    }

    if (data) {
      console.log('Data loaded from Supabase successfully');
      return data.data; // The actual dashboard data is stored in the 'data' column
    } else {
      console.log('No existing data found in Supabase, using default data');
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
  } catch (error) {
    console.error('Error loading data from Supabase:', error);
    // Fallback to default data
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
    
    const { error } = await supabase
      .from('dashboard_data')
      .upsert({
        id: 1, // Single row for dashboard data
        data: data,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving data to Supabase:', error);
      return { success: false, error: error.message };
    }

    console.log('Data saved to Supabase successfully');
    return { success: true };
  } catch (error) {
    console.error('Error saving data to Supabase:', error);
    return { success: false, error: error.message };
  }
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const data = await loadData();
      res.json(data);
    } catch (error) {
      console.error('Error loading data:', error);
      res.status(500).json({ error: 'Failed to load data' });
    }
  } else if (req.method === 'POST') {
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
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}