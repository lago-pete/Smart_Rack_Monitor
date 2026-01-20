import axios from 'axios';
import { useAuthStore } from '../store/auth';

const api = axios.create({
  baseURL: 'https://sense.telecso.co/api',
});

// Interceptor to add the token to the headers
api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = (userData: { email: string; password: string }) => api.post('/auth/login', userData);
export const registerUser = (userData: { name: string; email: string; password: string }) => api.post('/auth/register', userData);
export const profile = () => api.get('/user/profile');
export const getSensors = () => api.get('/devices');
export const getSensorData = (id: string) => api.get(`/sensors/${id}/latest`);
export const getSensorHistory = (id: string) => api.get(`/sensors/${id}/history`);
export const createOrganization = (orgData: { name: string }) => api.post('/orgs', orgData);
export const getMyOrganization = () => api.get('/orgs/me');
export const createDevice = (deviceData: {deviceId : string, deviceName : string,location : string}) => api.post('/devices', deviceData);
export const getDevices = () => api.get('/devices'); // this is a dup of getSensor - PAL
export const getDeviceById = (id: string) => api.get(`/devices/${id}`);
export const updateDeviceConfig = (id: string, config: { deviceName?: string; location?: string }) => api.put(`/devices/${id}/config`, config);
export const getSensorHistoryMarg = (deviceId: string, startDate: string, endDate: string) => api.get(`/api/sensors/${deviceId}/history?startDate=${startDate}&endDate=${endDate}`);
export const getSensorHistoryAll = (startDate: string, endDate: string) => api.get(`/api/sensors/history/all?startDate=${startDate}&endDate=${endDate}`);