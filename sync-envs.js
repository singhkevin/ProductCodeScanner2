const fs = require('fs');
const path = require('path');

const rootEnvPath = path.resolve(__dirname, '.env');
const dashboardEnvPath = path.resolve(__dirname, 'dashboard', '.env');
const verifierEnvPath = path.resolve(__dirname, 'public-verifier', '.env');

if (!fs.existsSync(rootEnvPath)) {
    console.error('❌ Root .env file not found!');
    process.exit(1);
}

const envContent = fs.readFileSync(rootEnvPath, 'utf8');
const envLines = envContent.split(/\r?\n/);

// Filter lines that start with VITE_ or are comments/empty
const viteLines = envLines.filter(line => {
    const trimmed = line.trim();
    return trimmed.startsWith('VITE_') || trimmed === '' || trimmed.startsWith('//') || trimmed.startsWith('#');
});

const viteContent = viteLines.join('\n');

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
