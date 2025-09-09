// API utility functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://marketpulse-production.up.railway.app';

export const apiCall = async (endpoint: string, options?: RequestInit) => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('API Call:', url); // Debug log
  return fetch(url, options);
};

export const getApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint}`;
};
