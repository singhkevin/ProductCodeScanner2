import path from 'path';
import dotenv from 'dotenv';

// Search for .env in multiple locations
const envPaths = [
    path.resolve(process.cwd(), '.env'),             // Current directory
    path.resolve(process.cwd(), '../.env'),          // Parent of backend
    path.resolve(__dirname, '.env'),                 // Next to this file
    path.resolve(__dirname, '../.env'),              // One level up
    path.resolve(__dirname, '../../.env'),           // Two levels up (root if in backend/dist)
];

envPaths.forEach(envPath => {
    dotenv.config({ path: envPath, override: false });
});

import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import scanRoutes from './routes/scanRoutes';
import statsRoutes from './routes/statsRoutes';

process.on('uncaughtException', err => {
    console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', err => {
    console.error('UNHANDLED PROMISE:', err);
});

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/stats', statsRoutes);

const ROOT = path.join(__dirname, '../..');

app.use('/verify', express.static(path.join(ROOT, 'public-verifier/dist')));
app.use(express.static(path.join(ROOT, 'dashboard/dist')));

app.get('/verify/*path', (_, res) => {
    res.sendFile(path.join(ROOT, 'public-verifier/dist/index.html'));
});

app.get('/*path', (_, res) => {
    res.sendFile(path.join(ROOT, 'dashboard/dist/index.html'));
});

app.get('/health', (_, res) => {
    res.json({ status: 'OK' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
