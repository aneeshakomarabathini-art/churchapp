// // src/config/api.js
// // For Expo physical mobile: put your laptop WiFi IPv4 here.
// // Example: 192.168.0.24
// const LAPTOP_IP = '13.207.248.55';

// // Physical mobile / Expo Go
// export const API_BASE_URL = `http://${LAPTOP_IP}:8080/api`;

// // For Android emulator use this instead:
// // export const API_BASE_URL = 'http://10.0.2.2:8080/api';

// // For web / same laptop testing use this instead:
// // export const API_BASE_URL = 'http://localhost:8080/api';

// export const FILE_BASE_URL = API_BASE_URL.replace('/api', '');
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://13.207.248.55:8080/api";

export const FILE_BASE_URL = API_BASE_URL.replace("/api", "");