import { apiRequest } from './apiClient';

export async function getApprovedChurchesApi() {
  return apiRequest('/churches');
}

export async function getChurchDetailsApi(churchId) {
  return apiRequest(`/churches/${churchId}`);
}

export async function getChurchContentApi(churchId) {
  return apiRequest(`/churches/${churchId}/content`);
}

export async function getChurchContentByTypeApi(churchId, type) {
  return apiRequest(`/churches/${churchId}/content?type=${String(type || '').toUpperCase()}`);
}

export async function getLatestChurchContentApi() {
  return apiRequest('/churches/latest-content');
}

export async function getMyChurchApi() {
  return apiRequest('/church-admin/my-church');
}

function buildChurchUpdateForm(payload = {}) {
  const formData = new FormData();
  formData.append('churchName', payload.churchName || payload.name || '');
  formData.append('churchLocation', payload.churchLocation || payload.location || '');
  formData.append('churchAddress', payload.churchAddress || payload.address || '');
  formData.append('churchPhone', payload.churchPhone || payload.phone || '');
  formData.append('churchEmail', payload.churchEmail || payload.email || '');
  formData.append('churchTiming', payload.churchTiming || payload.timing || '');
  formData.append('churchAbout', payload.churchAbout || payload.about || '');

  if (payload.churchPhoto?.uri) {
    formData.append('churchPhoto', {
      uri: payload.churchPhoto.uri,
      name: payload.churchPhoto.fileName || payload.churchPhoto.name || `church_${Date.now()}.jpg`,
      type: payload.churchPhoto.mimeType || payload.churchPhoto.type || 'image/jpeg',
    });
  }

  return formData;
}

export async function updateMyChurchApi(payload) {
  return apiRequest('/church-admin/my-church', {
    method: 'PUT',
    body: buildChurchUpdateForm(payload),
  });
}
