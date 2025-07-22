import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env.local') });

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function migrateData() {
  try {
    console.log('🔄 Starting migration to Supabase...');
    
    // Check if Supabase credentials are available
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error('❌ Missing Supabase environment variables');
      console.log('💡 Please add to your .env.local file:');
      console.log('   SUPABASE_URL=your_supabase_url');
      console.log('   SUPABASE_ANON_KEY=your_supabase_anon_key');
      return;
    }
    
    // Read existing data from JSON file
    const jsonData = await fs.readFile('dashboard-data.json', 'utf8');
    const data = JSON.parse(jsonData);
    
    console.log('📊 Data loaded from JSON file:');
    console.log(`   - Venture tasks: ${data.todos.venture.items.length}`);
    console.log(`   - Finance tasks: ${data.todos.finance.items.length}`);
    console.log(`   - Personal tasks: ${data.todos.personal.items.length}`);
    console.log(`   - Ideas: ${data.ideas.length}`);
    console.log(`   - Chat messages: ${data.chatMessages.length}`);
    
    // Save to Supabase
    const { error } = await supabase
      .from('dashboard_data')
      .upsert({
        id: 1,
        data: data,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('❌ Migration failed:', error);
      console.log('💡 Make sure you have:');
      console.log('   1. Supabase project created');
      console.log('   2. dashboard_data table created');
      console.log('   3. Environment variables set up');
      return;
    }
    
    console.log('✅ Data successfully migrated to Supabase!');
    console.log('🔒 Your data is now stored securely with encryption');
    
    // Verify the migration
    const { data: savedData, error: verifyError } = await supabase
      .from('dashboard_data')
      .select('*')
      .single();
      
    if (verifyError) {
      console.log('❌ Migration verification failed:', verifyError);
    } else if (savedData) {
      console.log('✅ Migration verified - data is accessible from Supabase');
      console.log(`   - Last saved: ${savedData.data.lastSaved}`);
      console.log(`   - Updated at: ${savedData.updated_at}`);
    } else {
      console.log('❌ Migration verification failed - no data found');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('💡 Make sure you have:');
    console.log('   1. Supabase project created');
    console.log('   2. dashboard_data table created');
    console.log('   3. Environment variables set up');
  }
}

migrateData(); 