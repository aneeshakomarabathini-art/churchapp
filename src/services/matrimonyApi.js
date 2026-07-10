// import { apiRequest } from './apiClient';

// function appendPhoto(formData, photoUri) {
//   if (!photoUri) return;
//   if (String(photoUri).startsWith('http')) return;
//   formData.append('photo', {
//     uri: photoUri,
//     name: `matrimony_${Date.now()}.jpg`,
//     type: 'image/jpeg',
//   });
// }

// function createMatrimonyForm(payload = {}) {
//   const formData = new FormData();
//   formData.append('name', payload.name || '');
//   formData.append('gender', payload.gender || '');
//   formData.append('age', String(payload.age || ''));
//   formData.append('occupation', payload.occupation || '');
//   formData.append('education', payload.education || '');
//   formData.append('location', payload.location || '');
//   formData.append('denomination', payload.denomination || '');
//   formData.append('familyDetails', payload.familyDetails || payload.bio || '');
//   formData.append('bio', payload.familyDetails || payload.bio || '');
//   formData.append('phone', payload.phone || '');
//   formData.append('email', payload.email || '');
//   appendPhoto(formData, payload.photoUri || payload.photo?.uri);
//   return formData;
// }

// export async function createMatrimonyProfileApi(payload) {
//   return apiRequest('/matrimony/profile', { method: 'POST', body: createMatrimonyForm(payload) });
// }

// export async function updateMatrimonyProfileApi(payload) {
//   return apiRequest('/matrimony/profile', { method: 'PUT', body: createMatrimonyForm(payload) });
// }

// export async function getMyMatrimonyProfileApi() {
//   return apiRequest('/matrimony/profile/me');
// }

// export async function getMatrimonyProfilesApi() {
//   return apiRequest('/matrimony/profiles');
// }

// export async function sendMatrimonyInterestApi(profileId) {
//   return apiRequest(`/matrimony/interests/${profileId}/send`, { method: 'POST' });
// }

// export async function acceptMatrimonyInterestByUserIdApi(profileUserId) {
//   return apiRequest(`/matrimony/interests/users/${profileUserId}/accept`, { method: 'POST' });
// }

// export async function getReceivedMatrimonyInterestsApi() {
//   return apiRequest('/matrimony/interests/received');
// }

// export async function getSentMatrimonyInterestsApi() {
//   return apiRequest('/matrimony/interests/sent');
// }  


























import { apiRequest } from './apiClient';
import { Platform } from 'react-native';

// On native, React Native's FormData polyfill accepts a {uri, name, type} object
// and streams the file directly. On web, FormData is the real browser FormData,
// which only accepts strings or Blob/File objects - passing a plain object gets
// silently stringified to "[object Object]", so no file bytes are ever sent.
// This helper builds the right kind of value for each platform.
async function buildFilePart(uri, fileName) {
  if (Platform.OS === 'web') {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type || 'image/jpeg' });
  }
  return {
    uri,
    name: fileName,
    type: 'image/jpeg',
  };
}

async function appendPhoto(formData, photoUri) {
  if (!photoUri) return;
  if (String(photoUri).startsWith('http')) return;
  const filePart = await buildFilePart(photoUri, `matrimony_${Date.now()}.jpg`);
  formData.append('photo', filePart);
}

async function createMatrimonyForm(payload = {}) {
  const formData = new FormData();
  formData.append('name', payload.name || '');
  formData.append('gender', payload.gender || '');
  formData.append('age', String(payload.age || ''));
  formData.append('occupation', payload.occupation || '');
  formData.append('education', payload.education || '');
  formData.append('location', payload.location || '');
  formData.append('denomination', payload.denomination || '');
  formData.append('familyDetails', payload.familyDetails || payload.bio || '');
  formData.append('bio', payload.familyDetails || payload.bio || '');
  formData.append('phone', payload.phone || '');
  formData.append('email', payload.email || '');
  await appendPhoto(formData, payload.photoUri || payload.photo?.uri);
  return formData;
}

export async function createMatrimonyProfileApi(payload) {
  return apiRequest('/matrimony/profile', { method: 'POST', body: await createMatrimonyForm(payload) });
}

export async function updateMatrimonyProfileApi(payload) {
  return apiRequest('/matrimony/profile', { method: 'PUT', body: await createMatrimonyForm(payload) });
}

export async function getMyMatrimonyProfileApi() {
  return apiRequest('/matrimony/profile/me');
}

export async function getMatrimonyProfilesApi() {
  return apiRequest('/matrimony/profiles');
}

export async function sendMatrimonyInterestApi(profileId) {
  return apiRequest(`/matrimony/interests/${profileId}/send`, { method: 'POST' });
}

export async function acceptMatrimonyInterestByUserIdApi(profileUserId) {
  return apiRequest(`/matrimony/interests/users/${profileUserId}/accept`, { method: 'POST' });
}

export async function getReceivedMatrimonyInterestsApi() {
  return apiRequest('/matrimony/interests/received');
}

export async function getSentMatrimonyInterestsApi() {
  return apiRequest('/matrimony/interests/sent');
}