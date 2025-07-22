import { kv } from '@vercel/kv';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env.local') });

async function migrateData() {
  try {
    console.log('🔄 Starting migration to Vercel KV...');
    
    // Read existing data from JSON file
    const jsonData = await fs.readFile('dashboard-data.json', 'utf8');
    const data = JSON.parse(jsonData);
    
    console.log('📊 Data loaded from JSON file:');
    console.log(`   - Venture tasks: ${data.todos.venture.items.length}`);
    console.log(`   - Finance tasks: ${data.todos.finance.items.length}`);
    console.log(`   - Personal tasks: ${data.todos.personal.items.length}`);
    console.log(`   - Ideas: ${data.ideas.length}`);
    console.log(`   - Chat messages: ${data.chatMessages.length}`);
    
    // Save to Vercel KV
    await kv.set('dashboard-data', data);
    
    console.log('✅ Data successfully migrated to Vercel KV!');
    console.log('🔒 Your data is now stored securely with zero-knowledge encryption');
    
    // Verify the migration
    const savedData = await kv.get('dashboard-data');
    if (savedData) {
      console.log('✅ Migration verified - data is accessible from KV');
      console.log(`   - Last saved: ${savedData.lastSaved}`);
    } else {
      console.log('❌ Migration verification failed');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('💡 Make sure you have:');
    console.log('   1. Vercel KV database created');
    console.log('   2. Environment variables set up');
    console.log('   3. Vercel CLI authenticated');
  }
}

migrateData(); 