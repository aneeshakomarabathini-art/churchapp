// import { apiRequest, setAuthData, clearAuthData, getCurrentUserFromStorage, normalizeUser } from './apiClient';

// export async function healthApi() {
//   return apiRequest('/auth/health');
// }

// export async function registerUserApi(payload) {
//   const data = await apiRequest('/auth/register', {
//     method: 'POST',
//     body: JSON.stringify({
//       name: payload.name,
//       email: payload.email,
//       phone: payload.phone,
//       password: payload.password,
//     }),
//   });
//   return { ...data, user: normalizeUser(data?.user) };
// }

// function buildChurchRegisterForm(payload = {}) {
//   const formData = new FormData();
//   formData.append('name', payload.name || '');
//   formData.append('email', payload.email || '');
//   formData.append('phone', payload.phone || '');
//   formData.append('password', payload.password || '');
//   formData.append('churchName', payload.churchName || '');
//   formData.append('churchLocation', payload.churchLocation || '');
//   formData.append('churchAddress', payload.churchAddress || '');
//   formData.append('churchPhone', payload.churchPhone || '');
//   formData.append('churchEmail', payload.churchEmail || payload.email || '');
//   formData.append('churchTiming', payload.churchTiming || '');
//   formData.append('churchAbout', payload.churchAbout || '');

//   if (payload.churchPhoto?.uri) {
//     formData.append('churchPhoto', {
//       uri: payload.churchPhoto.uri,
//       name: payload.churchPhoto.fileName || payload.churchPhoto.name || `church_${Date.now()}.jpg`,
//       type: payload.churchPhoto.mimeType || payload.churchPhoto.type || 'image/jpeg',
//     });
//   }

//   return formData;
// }

// export async function registerChurchAdminApi(payload) {
//   const data = await apiRequest('/auth/church-register', {
//     method: 'POST',
//     body: buildChurchRegisterForm(payload),
//   });
//   return { ...data, user: normalizeUser(data?.user) };
// }

// export async function loginApi(email, password) {
//   const data = await apiRequest('/auth/login', {
//     method: 'POST',
//     body: JSON.stringify({ email, password }),
//   });
//   await setAuthData(data.token, data.user);
//   return { ...data, user: normalizeUser(data?.user) };
// }

// export async function adminLoginApi(email, password) {
//   const data = await apiRequest('/auth/admin-login', {
//     method: 'POST',
//     body: JSON.stringify({ email, password }),
//   });
//   await setAuthData(data.token, data.user);
//   return { ...data, user: normalizeUser(data?.user) };
// }

// export async function getMeApi() {
//   const user = await apiRequest('/auth/me');
//   return normalizeUser(user);
// }

// export async function getStoredUserApi() {
//   return getCurrentUserFromStorage();
// }

// export async function logoutApi() {
//   await clearAuthData();
// }  






























import { apiRequest, setAuthData, clearAuthData, getCurrentUserFromStorage, normalizeUser } from './apiClient';
import { Platform } from 'react-native';

// See matrimonyApi.js for why this platform check is needed: on web, FormData
// only accepts strings or Blob/File, not the {uri, name, type} shape React
// Native's FormData polyfill expects.
async function buildFilePart(uri, fileName, fallbackType) {
  if (Platform.OS === 'web') {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type || fallbackType || 'image/jpeg' });
  }
  return {
    uri,
    name: fileName,
    type: fallbackType || 'image/jpeg',
  };
}

export async function healthApi() {
  return apiRequest('/auth/health');
}

export async function registerUserApi(payload) {
  const data = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
    }),
  });
  return { ...data, user: normalizeUser(data?.user) };
}

async function buildChurchRegisterForm(payload = {}) {
  const formData = new FormData();
  formData.append('name', payload.name || '');
  formData.append('email', payload.email || '');
  formData.append('phone', payload.phone || '');
  formData.append('password', payload.password || '');
  formData.append('churchName', payload.churchName || '');
  formData.append('churchLocation', payload.churchLocation || '');
  formData.append('churchAddress', payload.churchAddress || '');
  formData.append('churchPhone', payload.churchPhone || '');
  formData.append('churchEmail', payload.churchEmail || payload.email || '');
  formData.append('churchTiming', payload.churchTiming || '');
  formData.append('churchAbout', payload.churchAbout || '');

  if (payload.churchPhoto?.uri) {
    const filePart = await buildFilePart(
      payload.churchPhoto.uri,
      payload.churchPhoto.fileName || payload.churchPhoto.name || `church_${Date.now()}.jpg`,
      payload.churchPhoto.mimeType || payload.churchPhoto.type
    );
    formData.append('churchPhoto', filePart);
  }

  return formData;
}

export async function registerChurchAdminApi(payload) {
  const data = await apiRequest('/auth/church-register', {
    method: 'POST',
    body: await buildChurchRegisterForm(payload),
  });
  return { ...data, user: normalizeUser(data?.user) };
}

export async function loginApi(email, password) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  await setAuthData(data.token, data.user);
  return { ...data, user: normalizeUser(data?.user) };
}

export async function adminLoginApi(email, password) {
  const data = await apiRequest('/auth/admin-login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  await setAuthData(data.token, data.user);
  return { ...data, user: normalizeUser(data?.user) };
}

export async function getMeApi() {
  const user = await apiRequest('/auth/me');
  return normalizeUser(user);
}

export async function getStoredUserApi() {
  return getCurrentUserFromStorage();
}

export async function logoutApi() {
  await clearAuthData();
}
