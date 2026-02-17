const fs = require('fs');
const path = require('path');

const rootEnvPath = path.resolve(__dirname, '.env');
const dashboardEnvPath = path.resolve(__dirname, 'dashboard', '.env');
const verifierEnvPath = path.resolve(__dirname, 'public-verifier', '.env');

let viteContent = '';

if (fs.existsSync(rootEnvPath)) {
    console.log('📝 Reading environment from .env file...');
    const envContent = fs.readFileSync(rootEnvPath, 'utf8');
    const envLines = envContent.split(/\r?\n/);

    // Filter lines that start with VITE_ or are comments/empty
    const viteLines = envLines.filter(line => {
        const trimmed = line.trim();
        return trimmed.startsWith('VITE_') || trimmed === '' || trimmed.startsWith('//') || trimmed.startsWith('#');
    });
    viteContent = viteLines.join('\n');
} else {
    console.log('⚠️  .env file not found. Falling back to system environment variables...');

    // DEBUG: Log all available keys (but not values)
    const allKeys = Object.keys(process.env);
    console.log('🔍 Available environment keys:', allKeys.join(', '));

    // Collect all process.env variables starting with VITE_
    const viteVars = allKeys
        .filter(key => key.startsWith('VITE_'))
        .map(key => `${key}="${process.env[key]}"`); // wrap in quotes for .env format

    if (viteVars.length > 0) {
        viteContent = viteVars.join('\n');
        console.log(`✅ Collected ${viteVars.length} VITE_ variables from system env:`, viteVars.map(v => v.split('=')[0]).join(', '));
    } else {
        console.warn('⚠️  No VITE_ variables found in system environment.');
    }
}

function writeEnvFile(targetPath, label) {
    try {
        fs.writeFileSync(targetPath, viteContent);
        console.log(`✅ Successfully synced VITE_ variables to ${label}`);
    } catch (err) {
        console.error(`❌ Failed to write to ${label}:`, err.message);
    }
}

console.log('🔄 Synchronizing environment variables...');
writeEnvFile(dashboardEnvPath, 'Dashboard');
writeEnvFile(verifierEnvPath, 'Public Verifier');
