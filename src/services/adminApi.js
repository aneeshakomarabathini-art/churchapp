import { apiRequest, normalizeUser } from './apiClient';

export async function getAdminDashboardApi() {
  return apiRequest('/admin/dashboard');
}

export async function getChurchRequestsApi() {
  return apiRequest('/admin/church-requests');
}

export async function approveChurchApi(churchId) {
  return apiRequest(`/admin/churches/${churchId}/approve`, { method: 'PUT' });
}

export async function rejectChurchApi(churchId) {
  return apiRequest(`/admin/churches/${churchId}/reject`, { method: 'PUT' });
}

export async function getAllUsersApi() {
  const list = await apiRequest('/admin/users');
  return Array.isArray(list) ? list.map(normalizeUser) : [];
}

export async function getAllChurchesAdminApi() {
  return apiRequest('/admin/churches');
}
