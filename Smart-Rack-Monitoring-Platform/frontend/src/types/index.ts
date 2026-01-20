export interface SensorData {
  _id: string;
  id: string;
  deviceName: string;
  location: string;
  packet_number: number;
  timestamp: string;
  temperature: number;    
  humidity: number;       
  door: number | boolean; 
  voltage?: number;
  power_status?: number;
  time_received?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}
