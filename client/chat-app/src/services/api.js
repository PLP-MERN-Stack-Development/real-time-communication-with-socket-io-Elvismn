import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request logging
api.interceptors.request.use(
  (config) => {
    console.log('🔵 API REQUEST:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
      headers: config.headers
    });
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔵 Token added to request');
    } else {
      console.log('🔵 No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('🔴 API REQUEST ERROR:', error);
    return Promise.reject(error);
  }
);

// Add response logging
api.interceptors.response.use(
  (response) => {
    console.log('🟢 API RESPONSE SUCCESS:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('🔴 API RESPONSE ERROR:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Auth services with logging
export const authService = {
  login: (email, password) => {
    console.log('🔵 authService.login called:', { email });
    return api.post('/auth/login', { email, password });
  },
  
  register: (username, email, password) => {
    console.log('🔵 authService.register called:', { username, email });
    return api.post('/auth/register', { username, email, password });
  },
  
  logout: () => {
    console.log('🔵 authService.logout called');
    return api.post('/auth/logout');
  },
};

// ... rest of your roomService and messageService remains the same
export const roomService = {
  getRooms: (page = 1, limit = 20) => 
    api.get(`/rooms?page=${page}&limit=${limit}`),
  
  getRoom: (id) => 
    api.get(`/rooms/${id}`),
  
  createRoom: (name, description, isPrivate = false) => 
    api.post('/rooms', { name, description, isPrivate }),
  
  joinRoom: (id) => 
    api.post(`/rooms/${id}/join`),
  
  leaveRoom: (id) => 
    api.post(`/rooms/${id}/leave`),
  
  deleteRoom: (id) => 
    api.delete(`/rooms/${id}`),
};

export const messageService = {
  getMessages: (room = 'general', page = 1, limit = 50) => 
    api.get(`/messages?room=${room}&page=${page}&limit=${limit}`),
  
  getPrivateMessages: (userId, page = 1, limit = 50) => 
    api.get(`/messages/private/${userId}?page=${page}&limit=${limit}`),
  
  deleteMessage: (id) => 
    api.delete(`/messages/${id}`),
  
  markAsRead: (id) => 
    api.put(`/messages/${id}/read`),
  
  addReaction: (id, emoji) => 
    api.post(`/messages/${id}/reaction`, { emoji }),
  
  removeReaction: (id) => 
    api.delete(`/messages/${id}/reaction`),
  
  searchMessages: (query, room = 'all', page = 1, limit = 20) => 
    api.get(`/messages/search?query=${query}&room=${room}&page=${page}&limit=${limit}`),
};

export default api;