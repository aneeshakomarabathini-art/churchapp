// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_BASE_URL } from '../config/api';

// const TOKEN_KEY = 'authToken';
// const USER_KEY = 'currentUser';

// export function normalizeRole(role = '') {
//   const value = String(role || '').toUpperCase();
//   if (value.includes('ADMIN') && !value.includes('CHURCH')) return 'admin';
//   if (value.includes('CHURCH')) return 'church_admin';
//   return 'user';
// }

// export function normalizeStatus(status = '') {
//   const value = String(status || '').toLowerCase();
//   if (value === 'active') return 'approved';
//   return value || 'approved';
// }

// export function normalizeUser(user) {
//   if (!user) return null;
//   return {
//     ...user,
//     id: String(user.id),
//     role: normalizeRole(user.role),
//     status: normalizeStatus(user.status),
//     churchId: user.churchId ? String(user.churchId) : user.churchId,
//     avatar: user.name?.charAt(0)?.toUpperCase() || '?',
//   };
// }

// export async function getAuthToken() {
//   return AsyncStorage.getItem(TOKEN_KEY);
// }

// export async function setAuthData(token, user) {
//   if (token) await AsyncStorage.setItem(TOKEN_KEY, token);
//   if (user) await AsyncStorage.setItem(USER_KEY, JSON.stringify(normalizeUser(user)));
// }

// export async function clearAuthData() {
//   await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
// }

// export async function getCurrentUserFromStorage() {
//   const userText = await AsyncStorage.getItem(USER_KEY);
//   if (!userText) return null;
//   try {
//     return normalizeUser(JSON.parse(userText));
//   } catch {
//     return null;
//   }
// }

// export async function apiRequest(endpoint, options = {}) {
//   const token = await getAuthToken();
//   const isFormData = options.body instanceof FormData;
//   const headers = { ...(options.headers || {}) };

//   if (!isFormData) headers['Content-Type'] = 'application/json';
//   if (token) headers.Authorization = `Bearer ${token}`;

//   const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//     ...options,
//     headers,
//   });

//   const text = await response.text();
//   let data = null;
//   try {
//     data = text ? JSON.parse(text) : null;
//   } catch {
//     data = text;
//   }

//   if (!response.ok) {
//     throw new Error(data?.message || data?.error || data?.detail || text || 'Something went wrong');
//   }

//   return data;
// }

























import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

const TOKEN_KEY = 'authToken';
const USER_KEY = 'currentUser';

export function normalizeRole(role = '') {
  const value = String(role || '').toUpperCase();

  if (value.includes('ADMIN') && !value.includes('CHURCH')) {
    return 'admin';
  }

  if (value.includes('CHURCH')) {
    return 'church_admin';
  }

  return 'user';
}

export function normalizeStatus(status = '') {
  const value = String(status || '').toLowerCase();

  if (value === 'active') {
    return 'approved';
  }

  return value || 'approved';
}

export function normalizeUser(user) {
  if (!user) return null;

  return {
    ...user,
    id: String(user.id),
    role: normalizeRole(user.role),
    status: normalizeStatus(user.status),
    churchId: user.churchId ? String(user.churchId) : user.churchId,
    avatar: user.name?.charAt(0)?.toUpperCase() || '?',
  };
}

export async function getAuthToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setAuthData(token, user) {
  if (token) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }

  if (user) {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(normalizeUser(user)));
  }
}

export async function clearAuthData() {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}

export async function getCurrentUserFromStorage() {
  const userText = await AsyncStorage.getItem(USER_KEY);

  if (!userText) {
    return null;
  }

  try {
    return normalizeUser(JSON.parse(userText));
  } catch {
    return null;
  }
}

export async function apiRequest(endpoint, options = {}) {
  const token = await getAuthToken();
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(options.headers || {}),
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (error) {
    console.log('API NETWORK ERROR:', {
      endpoint,
      baseUrl: API_BASE_URL,
      message: error?.message,
    });

    throw new Error(
      'Network error. Check backend is running and API IP address is correct.'
    );
  }

  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    console.log('API ERROR:', {
      endpoint,
      status: response.status,
      response: data || text,
    });

    if (response.status === 401 || response.status === 403) {
      await clearAuthData();
      throw new Error('Login session expired. Please login again.');
    }

    throw new Error(
      data?.message ||
        data?.error ||
        data?.detail ||
        text ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
}