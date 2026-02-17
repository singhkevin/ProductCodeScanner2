"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path")); // Add this
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const scanRoutes_1 = __importDefault(require("./routes/scanRoutes"));
const statsRoutes_1 = __importDefault(require("./routes/statsRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/scans', scanRoutes_1.default);
app.use('/api/stats', statsRoutes_1.default);
// --- STATIC FRONTEND SERVING ---
// 1. Serve Public Verifier at /verify
app.use('/verify', express_1.default.static(path_1.default.join(__dirname, '../../public-verifier/dist')));
// 2. Serve Dashboard at the Root (/)
app.use(express_1.default.static(path_1.default.join(__dirname, '../../dashboard/dist')));
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Product Code Scanner API is running' });
});
// 3. Catch-all for React Routers
app.get('/verify/*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../public-verifier/dist/index.html'));
});
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../dashboard/dist/index.html'));
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
