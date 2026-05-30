import axios from 'axios';

const API = axios.create({
    baseURL: 'https://chama-tracker-gzv4.onrender.com/',
});

// Automaticall attach token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get('/auth/me');

// Chamas
export const getChamas = () => API.get('/chamas/');
export const getChama = (id) => API.get(`/chamas/${id}`);
export const getMyChamas = () => API.get('/chamas/my');
export const createChama = (data) => API.post('/chamas/', data);
export const updateChama = (id, data) => API.put(`/chamas/${id}`, data);
export const deleteChama = (id) => API.delete(`/chamas/${id}`);
export const joinChama = (id) => API.post(`/chamas/${id}/join`);

// Contributions
export const getContributions = (chamaId) => API.get(`/chamas/${chamaId}/contributions`);
export const addContribution = (chamaId, data) => API.post(`/chamas/${chamaId}/contributions`, data);

// Payouts
export const getPayouts = (chamaId) => API.get(`/chamas/${chamaId}/payouts`);
export const generatePayouts = (chamaId, data) => API.post(`/chamas/${chamaId}/payouts/generate`, data);



