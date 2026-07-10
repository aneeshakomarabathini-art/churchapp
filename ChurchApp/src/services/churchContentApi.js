import { apiRequest } from './apiClient';

function appendFile(formData, key, fileLike) {
  if (!fileLike?.uri) return;
  formData.append(key, {
    uri: fileLike.uri,
    name: fileLike.name || fileLike.fileName || `${key}_${Date.now()}`,
    type: fileLike.mimeType || fileLike.type || fileLike.fileMimeType || 'application/octet-stream',
  });
}

function createUploadForm(payload = {}) {
  const formData = new FormData();
  formData.append('type', String(payload.type || 'message').toUpperCase());
  formData.append('title', payload.title || '');
  formData.append('description', payload.description || '');
  formData.append('youtubeUrl', payload.youtubeUrl || '');
  formData.append('thumbnailUrl', payload.thumbnailUrl || '');
  formData.append('eventDate', payload.eventDate || '');

  if (payload.file?.uri) appendFile(formData, 'file', payload.file);
  if (payload.image?.uri) appendFile(formData, 'image', payload.image);

  if (payload.fileUri) {
    appendFile(formData, 'file', {
      uri: payload.fileUri,
      name: payload.fileName || `upload_${Date.now()}`,
      type: payload.fileMimeType || 'application/octet-stream',
    });
  }

  if (payload.imageUri && payload.imageUri !== payload.fileUri) {
    appendFile(formData, 'image', {
      uri: payload.imageUri,
      name: `event_image_${Date.now()}.jpg`,
      type: 'image/jpeg',
    });
  }

  return formData;
}

export async function uploadChurchContentApi(payload) {
  return apiRequest('/church-admin/content', {
    method: 'POST',
    body: createUploadForm(payload),
  });
}

export async function getMyChurchContentApi() {
  return apiRequest('/church-admin/my-content');
}

export async function deleteChurchContentApi(contentId) {
  return apiRequest(`/church-admin/content/${contentId}`, { method: 'DELETE' });
}

export async function fetchYoutubeMetaApi(youtubeUrl) {
  return apiRequest('/church-admin/youtube-meta', {
    method: 'POST',
    body: JSON.stringify({ youtubeUrl }),
  });
}
