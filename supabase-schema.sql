-- Create the dashboard_data table
CREATE TABLE IF NOT EXISTS dashboard_data (
    id BIGINT PRIMARY KEY DEFAULT 1,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE dashboard_data ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for single-user dashboard)
-- You can modify this later to add user-specific access
CREATE POLICY "Allow all operations for dashboard data" ON dashboard_data
    FOR ALL USING (true);

-- Create an index on the data column for better performance
CREATE INDEX IF NOT EXISTS idx_dashboard_data_jsonb ON dashboard_data USING GIN (data);

-- Insert initial empty data if table is empty
INSERT INTO dashboard_data (id, data) 
VALUES (1, '{
  "todos": {
    "venture": {
      "icon": "💼",
      "color": "bg-blue-600",
      "items": []
    },
    "finance": {
      "icon": "💰",
      "color": "bg-green-600",
      "items": []
    },
    "personal": {
      "icon": "👤",
      "color": "bg-purple-600",
      "items": []
    }
  },
  "ideas": [],
  "categoryLinks": {
    "venture": [],
    "finance": [],
    "personal": []
  },
  "chatMessages": [],
  "lastSaved": null
}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_dashboard_data_updated_at 
    BEFORE UPDATE ON dashboard_data 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 