import { apiRequest } from './apiClient';

export async function getNotificationsApi() {
  return apiRequest('/notifications');
}

export async function markNotificationReadApi(notificationId) {
  return apiRequest(`/notifications/${notificationId}/read`, { method: 'PUT' });
}

export async function markAllNotificationsReadApi() {
  return apiRequest('/notifications/read-all', { method: 'PUT' });
}

export async function clearNotificationsApi() {
  return apiRequest('/notifications/clear', { method: 'DELETE' });
}
