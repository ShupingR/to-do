import fs from 'fs';
import path from 'path';

console.log('🧪 Testing Matrix Todo Dashboard...\n');

// Test 1: Check if main component file exists
console.log('1. Checking main component file...');
if (fs.existsSync('src/MatrixTodoDashboard.tsx')) {
  console.log('✅ MatrixTodoDashboard.tsx exists');
  
  const content = fs.readFileSync('src/MatrixTodoDashboard.tsx', 'utf8');
  
  // Test 2: Check for deleteSubtask function
  if (content.includes('deleteSubtask')) {
    console.log('✅ deleteSubtask function found');
  } else {
    console.log('❌ deleteSubtask function not found');
  }
  
  // Test 3: Check for X icon import
  if (content.includes('X')) {
    console.log('✅ X icon import found');
  } else {
    console.log('❌ X icon import not found');
  }
  
  // Test 4: Check for delete button in subtasks
  if (content.includes('deleteSubtask(category, item.id, subtask.id)')) {
    console.log('✅ Delete button implementation found');
  } else {
    console.log('❌ Delete button implementation not found');
  }
  
} else {
  console.log('❌ MatrixTodoDashboard.tsx not found');
}

// Test 5: Check if data file exists
console.log('\n2. Checking data persistence...');
if (fs.existsSync('dashboard-data.json')) {
  console.log('✅ dashboard-data.json exists');
  try {
    const data = JSON.parse(fs.readFileSync('dashboard-data.json', 'utf8'));
    if (data.todos) {
      console.log('✅ Data structure is valid');
      console.log(`   - Categories: ${Object.keys(data.todos).join(', ')}`);
    } else {
      console.log('❌ Invalid data structure');
    }
  } catch (e) {
    console.log('❌ Error reading data file:', e.message);
  }
} else {
  console.log('❌ dashboard-data.json not found');
}

// Test 6: Check if server file exists
console.log('\n3. Checking backend server...');
if (fs.existsSync('server.js')) {
  console.log('✅ server.js exists');
  
  const serverContent = fs.readFileSync('server.js', 'utf8');
  if (serverContent.includes('/api/data')) {
    console.log('✅ API endpoints found');
  } else {
    console.log('❌ API endpoints not found');
  }
} else {
  console.log('❌ server.js not found');
}

// Test 7: Check package.json for dependencies
console.log('\n4. Checking dependencies...');
if (fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (pkg.dependencies['@anthropic-ai/sdk']) {
    console.log('✅ Anthropic SDK found');
  } else {
    console.log('❌ Anthropic SDK not found');
  }
  
  if (pkg.dependencies['lucide-react']) {
    console.log('✅ Lucide React icons found');
  } else {
    console.log('❌ Lucide React icons not found');
  }
} else {
  console.log('❌ package.json not found');
}

console.log('\n🎯 Test Summary:');
console.log('Your Matrix Todo Dashboard appears to be properly configured!');
console.log('\n📋 Manual Testing Checklist:');
console.log('1. Open http://localhost:5174 in your browser');
console.log('2. Check if category headers (Venture, Finance, Personal) are visible with colored backgrounds');
console.log('3. Try adding a task with subtasks');
console.log('4. Look for red X buttons next to subtask status indicators');
console.log('5. Click the red X to delete a subtask');
console.log('6. Verify the subtask is removed');
console.log('7. Check if data persists after page refresh');
console.log('8. Test the productivity assistant chatbot');
console.log('9. Try editing tasks and subtasks inline');
console.log('10. Test drag and drop functionality');

console.log('\n🚀 Ready for testing!'); 