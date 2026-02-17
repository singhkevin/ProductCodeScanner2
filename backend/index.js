const path = require('path');
const fs = require('fs');

// Enhanced Logging for Hostinger (Writes to a file so you can see it in File Manager)
const logLines = [];
function smartLog(message) {
    console.log(message);
    logLines.push(message);
}

smartLog('🚀 Starting Backend Bridge...');

const parentEnv = path.resolve(__dirname, '..', '.env');
const localEnv = path.resolve(__dirname, '.env');
const hostingerRoot = process.env.LSNODE_ROOT ? path.resolve(process.env.LSNODE_ROOT, '.env') : null;

smartLog('📂 Diagnostic Paths:');
smartLog('- Local Dir: ' + __dirname);
smartLog('- Parent Path: ' + parentEnv);
if (hostingerRoot) smartLog('- Hostinger Root Path: ' + hostingerRoot);

if (fs.existsSync(parentEnv)) {
    smartLog('📝 Loading environment from Root (.env): ' + parentEnv);
    require('dotenv').config({ path: parentEnv });
} else if (fs.existsSync(localEnv)) {
    smartLog('📝 Loading environment from Local (.env): ' + localEnv);
    require('dotenv').config({ path: localEnv });
} else if (hostingerRoot && fs.existsSync(hostingerRoot)) {
    smartLog('📝 Loading environment from Hostinger Root: ' + hostingerRoot);
    require('dotenv').config({ path: hostingerRoot });
} else {
    smartLog('⚠️ No .env file found at any checked location.');
}

// Diagnostics
smartLog('📡 Checking Environment Variables:');
smartLog('- DATABASE_URL: ' + (process.env.DATABASE_URL ? '✅ PRESENT' : '❌ MISSING'));
smartLog('- JWT_SECRET: ' + (process.env.JWT_SECRET ? '✅ PRESENT' : '❌ MISSING'));
smartLog('- PORT: ' + (process.env.PORT || 'Defaulting to 5000'));

smartLog('🔍 Available Env Keys: ' + Object.keys(process.env).filter(k => !k.startsWith('npm_') && !k.startsWith('NODE_')).join(', '));

// Write to a file for easy access in Hostinger File Manager
const logFilePath = path.join(__dirname, 'startup-debug.log');
try {
    fs.writeFileSync(logFilePath, logLines.join('\n') + '\n--- ' + new Date().toISOString() + ' ---\n');
    smartLog('💾 Startup logs saved to: ' + logFilePath);
} catch (err) {
    console.error('❌ Failed to write log file:', err.message);
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