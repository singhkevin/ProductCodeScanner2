import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path'; // Add this
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import scanRoutes from './routes/scanRoutes';
import statsRoutes from './routes/statsRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/stats', statsRoutes);

// --- STATIC FRONTEND SERVING ---

// 1. Serve Public Verifier at /verify
app.use('/verify', express.static(path.join(__dirname, '../../public-verifier/dist')));

// 2. Serve Dashboard at the Root (/)
app.use(express.static(path.join(__dirname, '../../dashboard/dist')));

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', message: 'Product Code Scanner API is running' });
});

// 3. Catch-all for React Routers
app.get('/verify/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public-verifier/dist/index.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dashboard/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});