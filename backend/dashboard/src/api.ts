import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const dashboardApi = {
    login: (credentials: any) => api.post('/auth/login', credentials),
    getOverviewStats: (companyId?: string) => api.get(`/stats/overview${companyId ? `?companyId=${companyId}` : ''}`),
    getCompanies: () => api.get('/stats/companies'),
    getScanActivity: () => api.get('/stats/activity'),
    getFraudHotspots: () => api.get('/scans/hotspots'),
    getBulkRequests: () => api.get('/products/bulk/requests'),
    handleBulkRequest: (id: string, data: any) => api.post(`/products/bulk/requests/${id}/handle`, data),
    uploadBulk: (formData: FormData) => api.post('/products/bulk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    createProduct: (data: any) => api.post('/products', data),
    getProducts: () => api.get('/products/company'),
    verifyToken: (token: string) => api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
    }),
};

export default api;
