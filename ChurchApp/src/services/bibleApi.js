import { apiRequest } from './apiClient';

export async function getVerseOfTheDayApi({ language = 'english', version = 'kjv' } = {}) {
  const safeLanguage = encodeURIComponent(language || 'english');
  const safeVersion = encodeURIComponent(version || 'kjv');
  return apiRequest(`/bible/verse-of-day?language=${safeLanguage}&version=${safeVersion}`);
}

export async function getSavedVersesApi() {
  return apiRequest('/bible/saved-verses');
}

export async function saveVerseApi(payload) {
  return apiRequest('/bible/saved-verses', {
    method: 'POST',
    body: JSON.stringify({
      verseId: payload.verseId || payload.id,
      book: payload.book,
      chapter: String(payload.chapter || ''),
      verse: String(payload.verse || payload.verseNum || ''),
      verseNum: String(payload.verseNum || payload.verse || ''),
      reference: payload.reference || payload.title,
      text: payload.text,
      language: payload.language || 'english',
      version: payload.version || '',
    }),
  });
}

export async function deleteSavedVerseApi(savedVerseIdOrVerseId) {
  return apiRequest(`/bible/saved-verses/${encodeURIComponent(savedVerseIdOrVerseId)}`, { method: 'DELETE' });
}

export async function getBibleNotesApi() {
  return apiRequest('/bible/notes');
}

export async function createBibleNoteApi(payload) {
  return apiRequest('/bible/notes', {
    method: 'POST',
    body: JSON.stringify({
      verseId: payload.verseId || payload.id,
      book: payload.book,
      chapter: String(payload.chapter || ''),
      verse: String(payload.verse || payload.verseNum || ''),
      verseNum: String(payload.verseNum || payload.verse || ''),
      reference: payload.reference,
      verseText: payload.verseText || payload.text,
      note: payload.note,
      language: payload.language || 'english',
      version: payload.version || '',
    }),
  });
}

export async function updateBibleNoteApi(noteId, payload) {
  return apiRequest(`/bible/notes/${noteId}`, {
    method: 'PUT',
    body: JSON.stringify({ note: payload.note }),
  });
}

export async function deleteBibleNoteApi(noteIdOrVerseId) {
  return apiRequest(`/bible/notes/${encodeURIComponent(noteIdOrVerseId)}`, { method: 'DELETE' });
}
