const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Backend Bridge...');

// Try to load .env from root if not already loaded (useful for Hostinger environment)
const rootEnv = path.resolve(__dirname, '../.env');
if (fs.existsSync(rootEnv)) {
    console.log('📝 Loading environment from:', rootEnv);
    require('dotenv').config({ path: rootEnv });
} else {
    console.warn('⚠️ Root .env not found at:', rootEnv);
}

const entryPoint = path.join(__dirname, 'dist/index.js');

if (fs.existsSync(entryPoint)) {
    console.log('✅ Found entry point:', entryPoint);
    require(entryPoint);
} else {
    console.error('❌ CRITICAL ERROR: dist/index.js not found!');
    console.error('Did you run "npm run build" inside the backend folder?');
    process.exit(1);
}