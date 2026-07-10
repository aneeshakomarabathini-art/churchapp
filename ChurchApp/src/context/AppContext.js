// import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import { loginApi, logoutApi, getMeApi, registerUserApi, registerChurchAdminApi } from '../services/authApi';
// import { getAdminDashboardApi, getChurchRequestsApi, approveChurchApi, rejectChurchApi, getAllUsersApi, getAllChurchesAdminApi } from '../services/adminApi';
// import { getApprovedChurchesApi, getLatestChurchContentApi, getMyChurchApi, updateMyChurchApi } from '../services/churchApi';
// import { uploadChurchContentApi, getMyChurchContentApi, deleteChurchContentApi, fetchYoutubeMetaApi } from '../services/churchContentApi';
// import { createMatrimonyProfileApi, updateMatrimonyProfileApi, getMyMatrimonyProfileApi, getMatrimonyProfilesApi, sendMatrimonyInterestApi, acceptMatrimonyInterestByUserIdApi, getReceivedMatrimonyInterestsApi, getSentMatrimonyInterestsApi } from '../services/matrimonyApi';
// import { getNotificationsApi, markNotificationReadApi, markAllNotificationsReadApi, clearNotificationsApi } from '../services/notificationApi';
// import { getVerseOfTheDayApi, getSavedVersesApi, saveVerseApi, deleteSavedVerseApi, getBibleNotesApi, createBibleNoteApi, deleteBibleNoteApi } from '../services/bibleApi';

// const AppContext = createContext(null);

// export const DEMO_ACCOUNTS = [
//   { id: '1', email: 'admin@gracechurch.com', password: 'admin123', name: 'Admin', role: 'admin', avatar: 'A' },
//   { id: 'demo2', email: 'pastor@gracechurch.com', password: 'church123', name: 'Pastor', role: 'church_admin', avatar: 'P' },
//   { id: 'demo3', email: 'john@gmail.com', password: 'user123', name: 'John User', role: 'user', avatar: 'J' },
// ];

// const STORAGE_KEYS = {
//   currentUser: 'currentUser',
//   authToken: 'authToken',
//   highlights: 'highlights',
//   theme: 'theme',
//   fontSize: 'fontSize',
//   bibleLanguage: 'bibleLanguage',
//   bibleVersion: 'bibleVersion',
// };

// const getAvatar = (name = '') => name.trim().charAt(0).toUpperCase() || '?';

// const roleToUi = (role = '') => {
//   const value = String(role || '').toUpperCase();
//   if (value.includes('CHURCH')) return 'church_admin';
//   if (value.includes('ADMIN')) return 'admin';
//   return 'user';
// };

// const statusToUi = (status = '') => {
//   const value = String(status || '').toLowerCase();
//   if (value === 'active') return 'approved';
//   return value || 'approved';
// };

// const normalizeUser = (user) => {
//   if (!user) return null;
//   return {
//     ...user,
//     id: String(user.id),
//     role: roleToUi(user.role),
//     status: statusToUi(user.status),
//     churchId: user.churchId ? String(user.churchId) : user.churchId,
//     avatar: user.avatar || getAvatar(user.name),
//   };
// };

// const normalizeChurch = (church) => ({
//   ...church,
//   id: String(church.id),
//   name: church.name || church.churchName,
//   location: church.location || church.churchLocation,
//   address: church.address || church.churchAddress,
//   phone: church.phone || church.churchPhone,
//   image: church.image || '⛪',
//   status: String(church.status || 'approved').toLowerCase(),
// });

// const normalizeContent = (item) => ({
//   ...item,
//   id: String(item.id),
//   churchId: String(item.churchId),
//   type: String(item.type || '').toLowerCase(),
//   imageUri: item.imageUri || '',
//   thumbnailUrl: item.thumbnailUrl || '',
//   fileUri: item.fileUri || '',
// });

// const normalizeProfile = (profile) => ({
//   ...profile,
//   id: String(profile.id),
//   userId: String(profile.userId),
//   avatar: profile.avatar || getAvatar(profile.name),
//   photoUri: profile.photoUri || '',
//   familyDetails: profile.familyDetails || profile.bio || '',
//   bio: profile.familyDetails || profile.bio || '',
//   phone: profile.phone || '',
//   email: profile.email || '',
// });

// const normalizeInterest = (interest) => ({
//   ...interest,
//   id: String(interest.id),
//   fromUserId: String(interest.fromUserId),
//   toUserId: String(interest.toUserId),
//   profile: interest.profile ? normalizeProfile(interest.profile) : null,
//   accepted: String(interest.status || '').toLowerCase() === 'accepted',
// });

// const normalizeNotification = (item) => ({
//   ...item,
//   id: String(item.id),
//   toUserId: String(item.toUserId),
// });

// const normalizeSavedVerse = (item) => ({
//   ...item,
//   id: item.id || item.verseId,
//   type: 'verse',
//   verseNum: item.verseNum || item.verse,
// });

// const normalizeNoteRecord = (item) => ({
//   ...item,
//   id: item.id || item.verseId,
//   note: item.note || '',
//   text: item.text || item.verseText || '',
//   verseNum: item.verseNum || item.verse,
// });

// const normalizeVerseOfDay = (item) => {
//   if (!item) return null;
//   const verseNum = item.verseNum || item.verse || '';
//   const reference = item.reference || `${item.book || ''} ${item.chapter || ''}:${verseNum}`.trim();
//   return {
//     ...item,
//     id: item.verseId || item.id || reference,
//     verseId: item.verseId || item.id || reference,
//     verseNum,
//     reference,
//     text: item.text || '',
//     language: item.language || 'english',
//     version: item.version || 'kjv',
//   };
// };

// export const extractYoutubeVideoId = (input = '') => {
//   const raw = String(input || '').trim();
//   if (!raw) return '';
//   try {
//     const url = new URL(raw);
//     const host = url.hostname.replace('www.', '').replace('m.', '');
//     if (host === 'youtu.be') return url.pathname.split('/').filter(Boolean)[0] || '';
//     if (host.includes('youtube.com')) {
//       const watchId = url.searchParams.get('v');
//       if (watchId) return watchId;
//       const parts = url.pathname.split('/').filter(Boolean);
//       const keyIndex = parts.findIndex((part) => ['embed', 'shorts', 'live'].includes(part));
//       if (keyIndex >= 0 && parts[keyIndex + 1]) return parts[keyIndex + 1];
//     }
//   } catch {}
//   const match = raw.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
//   return match?.[1] || '';
// };

// const getYoutubeThumbnailUrl = (videoId = '') => videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
// const isImageFile = (mimeType = '', fileName = '', fileUri = '') => String(mimeType || '').startsWith('image/') || /\.(png|jpg|jpeg|webp|gif)$/i.test(String(fileName || fileUri || ''));

// const arrayToBookmarkMap = (items = []) => {
//   const map = {};
//   items.forEach((item) => {
//     const n = normalizeSavedVerse(item);
//     if (n.id) map[n.id] = n;
//   });
//   return map;
// };

// const arrayToNoteMap = (items = []) => {
//   const map = {};
//   items.forEach((item) => {
//     const n = normalizeNoteRecord(item);
//     if (n.id) map[n.id] = n;
//   });
//   return map;
// };

// export const AppProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);

//   const [registeredUsers, setRegisteredUsers] = useState([]);
//   const [churchAdminRequests, setChurchAdminRequests] = useState([]);
//   const [approvedChurches, setApprovedChurches] = useState([]);
//   const [myChurchDetails, setMyChurchDetails] = useState(null);
//   const [churchContents, setChurchContents] = useState([]);
//   const [matrimonyProfiles, setMatrimonyProfiles] = useState([]);
//   const [matrimonyInterests, setMatrimonyInterests] = useState([]);
//   const [notifications, setNotifications] = useState([]);

//   const [theme, setThemeState] = useState('light');
//   const [fontSize, setFontSizeState] = useState(16);
//   const [bibleLanguage, setBibleLanguageState] = useState('english');
//   const [bibleVersion, setBibleVersionState] = useState('kjv');
//   const [currentBibleBook, setCurrentBibleBook] = useState('Genesis');
//   const [currentChapter, setCurrentChapter] = useState(1);
//   const [bookmarks, setBookmarks] = useState({});
//   const [highlights, setHighlights] = useState({});
//   const [notes, setNotes] = useState({});
//   const [verseOfDay, setVerseOfDay] = useState(null);

//   const themeColors =
//     theme === 'dark'
//       ? {
//           background: '#12121E', surface: '#1E1E2E', surfaceSecondary: '#2A2A3E', text: '#F0F0FF', textSecondary: '#B0B0C0', textLight: '#808090', primary: '#6366F1', overlay: 'rgba(99,102,241,0.10)', verseHighlight: 'rgba(99,102,241,0.15)', border: '#3A3A4A', white: '#1E1E2E',
//         }
//       : {
//           background: '#FFFFFF', surface: '#F8F9FA', surfaceSecondary: '#F0F2F5', text: '#1A1A2E', textSecondary: '#4A4A6A', textLight: '#8A8A9A', primary: '#6366F1', overlay: 'rgba(99,102,241,0.08)', verseHighlight: 'rgba(99,102,241,0.12)', border: '#E0E0E8', white: '#FFFFFF',
//         };

//   const allAccounts = useMemo(() => registeredUsers, [registeredUsers]);

//   const recentChurchPosts = useMemo(() => {
//     return [...churchContents].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
//   }, [churchContents]);

//   const currentUserNotifications = useMemo(() => {
//     if (!currentUser) return [];
//     return notifications.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
//   }, [currentUser, notifications]);

//   const unreadNotificationCount = useMemo(() => currentUserNotifications.filter((item) => !item.readAt).length, [currentUserNotifications]);

//   const savedBibleVerses = useMemo(() => Object.values(bookmarks || {}).sort((a, b) => new Date(b.savedAt || 0) - new Date(a.savedAt || 0)), [bookmarks]);
//   const bibleNotesList = useMemo(() => Object.values(notes || {}).filter((item) => String(item.note || '').trim()).sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)), [notes]);

//   const refreshPublicData = async () => {
//     const [churches, latest] = await Promise.all([
//       getApprovedChurchesApi().catch(() => []),
//       getLatestChurchContentApi().catch(() => []),
//     ]);
//     setApprovedChurches((churches || []).map(normalizeChurch));
//     setChurchContents((latest || []).map(normalizeContent));
//   };

//   const refreshAdminData = async () => {
//     const [requests, users, churches, latest] = await Promise.all([
//       getChurchRequestsApi().catch(() => []),
//       getAllUsersApi().catch(() => []),
//       getAllChurchesAdminApi().catch(() => []),
//       getLatestChurchContentApi().catch(() => []),
//     ]);
//     setChurchAdminRequests((requests || []).map((x) => ({ ...x, id: String(x.id) })));
//     setRegisteredUsers((users || []).map(normalizeUser));
//     setApprovedChurches((churches || []).filter((c) => String(c.status).toLowerCase() === 'approved').map(normalizeChurch));
//     setChurchContents((latest || []).map(normalizeContent));
//   };

//   const refreshChurchAdminData = async () => {
//     const [churches, myChurch, myContent] = await Promise.all([
//       getApprovedChurchesApi().catch(() => []),
//       getMyChurchApi().catch(() => null),
//       getMyChurchContentApi().catch(() => []),
//     ]);
//     const normalizedChurch = myChurch ? normalizeChurch(myChurch) : null;
//     setMyChurchDetails(normalizedChurch);
//     const publicChurches = (churches || []).map(normalizeChurch);
//     const mergedChurches = normalizedChurch
//       ? [normalizedChurch, ...publicChurches.filter((church) => String(church.id) !== String(normalizedChurch.id))]
//       : publicChurches;
//     setApprovedChurches(mergedChurches);
//     setChurchContents((myContent || []).map(normalizeContent));
//   };


//   const refreshVerseOfDay = async () => {
//     try {
//       const daily = await getVerseOfTheDayApi({ language: bibleLanguage, version: bibleVersion });
//       const normalized = normalizeVerseOfDay(daily);
//       setVerseOfDay(normalized);
//       return normalized;
//     } catch (error) {
//       console.log('Load verse of the day error:', error?.message || error);
//       return null;
//     }
//   };

//   const refreshUserData = async () => {
//     const [profiles, received, sent, notifs, saved, noteList, daily] = await Promise.all([
//       getMatrimonyProfilesApi().catch(() => []),
//       getReceivedMatrimonyInterestsApi().catch(() => []),
//       getSentMatrimonyInterestsApi().catch(() => []),
//       getNotificationsApi().catch(() => []),
//       getSavedVersesApi().catch(() => []),
//       getBibleNotesApi().catch(() => []),
//       getVerseOfTheDayApi({ language: bibleLanguage, version: bibleVersion }).catch(() => null),
//     ]);
//     setMatrimonyProfiles((profiles || []).map(normalizeProfile));
//     setMatrimonyInterests([...(received || []), ...(sent || [])].map(normalizeInterest));
//     setNotifications((notifs || []).map(normalizeNotification));
//     setBookmarks(arrayToBookmarkMap(saved || []));
//     setNotes(arrayToNoteMap(noteList || []));
//     if (daily) setVerseOfDay(normalizeVerseOfDay(daily));
//   };

//   const refreshAfterLogin = async (user) => {
//     await refreshPublicData();
//     if (!user) {
//       setVerseOfDay(null);
//       return;
//     }
//     await refreshVerseOfDay().catch(() => null);
//     if (user.role === 'admin') await refreshAdminData();
//     if (user.role === 'church_admin') await refreshChurchAdminData();
//     if (user.role === 'user') await refreshUserData();
//   };

//   const signIn = async (email, password) => {
//     const response = await loginApi(email.trim(), password);
//     const safeUser = normalizeUser(response.user);
//     setCurrentUser(safeUser);
//     await AsyncStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(safeUser));
//     await refreshAfterLogin(safeUser);
//     return safeUser;
//   };

//   const signOut = async () => {
//     await logoutApi();
//     setCurrentUser(null);
//     setRegisteredUsers([]);
//     setChurchAdminRequests([]);
//     setMyChurchDetails(null);
//     setMatrimonyProfiles([]);
//     setMatrimonyInterests([]);
//     setNotifications([]);
//     setBookmarks({});
//     setNotes({});
//     setVerseOfDay(null);
//     await refreshPublicData();
//   };

//   const registerUser = async ({ name, email, phone, password }) => registerUserApi({ name, email, phone, password });

//   const registerChurchAdminRequest = async (payload) => registerChurchAdminApi(payload);

//   const updateChurchDetails = async (payload) => {
//     const updated = normalizeChurch(await updateMyChurchApi(payload));
//     setMyChurchDetails(updated);
//     setApprovedChurches((prev) => [updated, ...prev.filter((church) => String(church.id) !== String(updated.id))]);
//     await refreshPublicData().catch(() => {});
//     return updated;
//   };

//   const approveChurchAdmin = async (requestId) => {
//     const result = await approveChurchApi(requestId);
//     await refreshAdminData();
//     await refreshPublicData();
//     return normalizeChurch(result);
//   };

//   const rejectChurchAdmin = async (requestId) => {
//     await rejectChurchApi(requestId);
//     await refreshAdminData();
//   };

//   const loadYoutubeMetadata = async (youtubeUrl) => fetchYoutubeMetaApi(youtubeUrl);

//   const getContentPreviewImage = (item) => {
//     if (!item) return '';
//     if (item.thumbnailUrl) return item.thumbnailUrl;
//     if (item.youtubeVideoId) return getYoutubeThumbnailUrl(item.youtubeVideoId);
//     const videoId = extractYoutubeVideoId(item.youtubeUrl || '');
//     if (videoId) return getYoutubeThumbnailUrl(videoId);
//     if (item.imageUri) return item.imageUri;
//     if (isImageFile(item.fileMimeType, item.fileName, item.fileUri)) return item.fileUri;
//     return '';
//   };

//   const addChurchContent = async (payload) => {
//     const saved = normalizeContent(await uploadChurchContentApi(payload));
//     await refreshChurchAdminData();
//     await refreshPublicData();
//     return saved;
//   };

//   const deleteChurchContent = async (contentId) => {
//     await deleteChurchContentApi(contentId);
//     await refreshChurchAdminData();
//   };

//   const getChurchContentByChurch = (churchId, type) => {
//     return churchContents.filter((item) => item.churchId === String(churchId) && (!type || item.type === type));
//   };

//   const addOrUpdateMatrimonyProfile = async (profile) => {
//     const existing = getMyMatrimonyProfile();
//     const saved = normalizeProfile(existing ? await updateMatrimonyProfileApi(profile) : await createMatrimonyProfileApi(profile));
//     await refreshUserData();
//     return saved;
//   };

//   const getMyMatrimonyProfile = () => {
//     if (!currentUser) return null;
//     return matrimonyProfiles.find((item) => String(item.userId) === String(currentUser.id)) || null;
//   };

//   const getProfileByUserId = (userId) => matrimonyProfiles.find((item) => String(item.userId) === String(userId)) || null;

//   const sendMatrimonyInterest = async (profileUserId) => {
//     const target = getProfileByUserId(profileUserId);
//     if (!target) throw new Error('This user does not have an active matrimony profile.');
//     const interest = await sendMatrimonyInterestApi(target.id);
//     await refreshUserData();
//     return interest;
//   };

//   const acceptMatrimonyInterest = async (profileUserId) => {
//     const interest = await acceptMatrimonyInterestByUserIdApi(profileUserId);
//     await refreshUserData();
//     return interest;
//   };

//   const getMyReceivedMatrimonyRequests = () => {
//     if (!currentUser) return [];
//     return matrimonyInterests
//       .filter((item) => String(item.toUserId) === String(currentUser.id))
//       .map((item) => ({ ...item, accepted: item.accepted || isMutualInterest(item.fromUserId) }))
//       .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
//   };

//   const hasSentInterest = (profileUserId) => {
//     if (!currentUser) return false;
//     const profile = getProfileByUserId(profileUserId);
//     if (profile?.sentInterest || profile?.mutualInterest) return true;
//     return matrimonyInterests.some((item) => String(item.fromUserId) === String(currentUser.id) && String(item.toUserId) === String(profileUserId));
//   };

//   const hasReceivedInterest = (profileUserId) => {
//     if (!currentUser) return false;
//     const profile = getProfileByUserId(profileUserId);
//     if (profile?.receivedInterest || profile?.mutualInterest) return true;
//     return matrimonyInterests.some((item) => String(item.fromUserId) === String(profileUserId) && String(item.toUserId) === String(currentUser.id));
//   };

//   const isMutualInterest = (profileUserId) => {
//     const profile = getProfileByUserId(profileUserId);
//     if (profile?.mutualInterest || profile?.contactVisible) return true;
//     return hasSentInterest(profileUserId) && hasReceivedInterest(profileUserId);
//   };

//   const canViewMatrimonyContact = (profile) => {
//     if (!currentUser || !profile) return false;
//     return String(profile.userId) === String(currentUser.id) || profile.contactVisible || isMutualInterest(profile.userId);
//   };

//   const markNotificationRead = async (notificationId) => {
//     await markNotificationReadApi(notificationId);
//     await refreshUserData();
//   };

//   const markAllNotificationsRead = async () => {
//     await markAllNotificationsReadApi();
//     await refreshUserData();
//   };

//   const clearMyNotifications = async () => {
//     await clearNotificationsApi();
//     setNotifications([]);
//   };

//   const isBookmarked = (id) => !!bookmarks[id];

//   const toggleBookmark = (bookmark) => {
//     setBookmarks((prev) => {
//       const updated = { ...prev };
//       if (updated[bookmark.id]) {
//         delete updated[bookmark.id];
//         deleteSavedVerseApi(bookmark.id).catch((e) => console.log('Delete saved verse error', e));
//       } else {
//         const next = { ...bookmark, savedAt: new Date().toISOString() };
//         updated[bookmark.id] = next;
//         saveVerseApi({ ...next, verseId: bookmark.id }).catch((e) => console.log('Save verse error', e));
//       }
//       return updated;
//     });
//   };

//   const toggleHighlight = (verseId, colorId) => {
//     setHighlights((prev) => {
//       const updated = { ...prev };
//       if (updated[verseId] === colorId) delete updated[verseId];
//       else updated[verseId] = colorId;
//       AsyncStorage.setItem(STORAGE_KEYS.highlights, JSON.stringify(updated));
//       return updated;
//     });
//   };

//   const addNote = (verseId, noteText, verseMeta = {}) => {
//     setNotes((prev) => {
//       const updated = { ...prev };
//       const cleanNote = String(noteText || '').trim();
//       if (cleanNote) {
//         const record = {
//           id: verseId,
//           verseId,
//           note: cleanNote,
//           reference: verseMeta.reference || verseId,
//           text: verseMeta.text || '',
//           verseText: verseMeta.text || '',
//           book: verseMeta.book || '',
//           chapter: String(verseMeta.chapter || ''),
//           verseNum: String(verseMeta.verseNum || ''),
//           language: verseMeta.language || bibleLanguage,
//           version: verseMeta.version || bibleVersion,
//           updatedAt: new Date().toISOString(),
//         };
//         updated[verseId] = record;
//         createBibleNoteApi(record).catch((e) => console.log('Save note error', e));
//       } else {
//         delete updated[verseId];
//         deleteBibleNoteApi(verseId).catch((e) => console.log('Delete note error', e));
//       }
//       return updated;
//     });
//   };

//   const setTheme = (value) => {
//     setThemeState(value);
//     AsyncStorage.setItem(STORAGE_KEYS.theme, value);
//   };

//   const setFontSize = (value) => {
//     setFontSizeState(value);
//     AsyncStorage.setItem(STORAGE_KEYS.fontSize, String(value));
//   };

//   const setBibleLanguage = (value) => {
//     setBibleLanguageState(value);
//     AsyncStorage.setItem(STORAGE_KEYS.bibleLanguage, value);
//     if (currentUser) getVerseOfTheDayApi({ language: value, version: bibleVersion }).then((daily) => setVerseOfDay(normalizeVerseOfDay(daily))).catch(() => {});
//   };

//   const setBibleVersion = (value) => {
//     setBibleVersionState(value);
//     AsyncStorage.setItem(STORAGE_KEYS.bibleVersion, value);
//     if (currentUser) getVerseOfTheDayApi({ language: bibleLanguage, version: value }).then((daily) => setVerseOfDay(normalizeVerseOfDay(daily))).catch(() => {});
//   };

//   useEffect(() => {
//     const loadInitial = async () => {
//       try {
//         const [storedUser, storedTheme, storedFontSize, storedLanguage, storedVersion, storedHighlights] = await Promise.all([
//           AsyncStorage.getItem(STORAGE_KEYS.currentUser),
//           AsyncStorage.getItem(STORAGE_KEYS.theme),
//           AsyncStorage.getItem(STORAGE_KEYS.fontSize),
//           AsyncStorage.getItem(STORAGE_KEYS.bibleLanguage),
//           AsyncStorage.getItem(STORAGE_KEYS.bibleVersion),
//           AsyncStorage.getItem(STORAGE_KEYS.highlights),
//         ]);
//         if (storedTheme) setThemeState(storedTheme);
//         if (storedFontSize) setFontSizeState(Number(storedFontSize) || 16);
//         if (storedLanguage) setBibleLanguageState(storedLanguage);
//         if (storedVersion) setBibleVersionState(storedVersion);
//         if (storedHighlights) setHighlights(JSON.parse(storedHighlights));

//         let user = null;
//         if (storedUser) user = normalizeUser(JSON.parse(storedUser));
//         try {
//           const me = await getMeApi();
//           user = normalizeUser(me);
//           await AsyncStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
//         } catch {}
//         setCurrentUser(user);
//         await refreshAfterLogin(user);
//       } catch (error) {
//         console.log('Load app data error:', error);
//         await refreshPublicData().catch(() => {});
//       } finally {
//         setAuthLoading(false);
//       }
//     };
//     loadInitial();
//   }, []);

//   const value = {
//     currentUser,
//     authLoading,
//     signIn,
//     signOut,

//     registeredUsers,
//     churchAdminRequests,
//     allAccounts,
//     registerUser,
//     registerChurchAdminRequest,
//     approveChurchAdmin,
//     rejectChurchAdmin,

//     approvedChurches,
//     myChurchDetails,
//     churchContents,
//     recentChurchPosts,
//     updateChurchDetails,
//     addChurchContent,
//     deleteChurchContent,
//     getChurchContentByChurch,
//     loadYoutubeMetadata,
//     extractYoutubeVideoId,
//     getContentPreviewImage,

//     matrimonyProfiles,
//     matrimonyInterests,
//     addOrUpdateMatrimonyProfile,
//     sendMatrimonyInterest,
//     acceptMatrimonyInterest,
//     getMyMatrimonyProfile,
//     getMyReceivedMatrimonyRequests,
//     hasSentInterest,
//     hasReceivedInterest,
//     isMutualInterest,
//     canViewMatrimonyContact,

//     notifications,
//     currentUserNotifications,
//     unreadNotificationCount,
//     markNotificationRead,
//     markAllNotificationsRead,
//     clearMyNotifications,

//     theme,
//     setTheme,
//     fontSize,
//     setFontSize,
//     isDarkMode: theme === 'dark',
//     themeColors,
//     colors: themeColors,

//     bibleLanguage,
//     setBibleLanguage,
//     bibleVersion,
//     setBibleVersion,
//     currentBibleBook,
//     setCurrentBibleBook,
//     currentChapter,
//     setCurrentChapter,

//     verseOfDay,
//     refreshVerseOfDay,
//     savedBibleVerses,
//     bibleNotesList,
//     isBookmarked,
//     toggleBookmark,
//     bookmarks,
//     highlights,
//     toggleHighlight,
//     notes,
//     addNote,
//   };

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// };

// export const useApp = () => {
//   const ctx = useContext(AppContext);
//   if (!ctx) throw new Error('useApp must be used within AppProvider');
//   return ctx;
// };





































import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { loginApi, logoutApi, getMeApi, registerUserApi, registerChurchAdminApi } from '../services/authApi';
import { getAdminDashboardApi, getChurchRequestsApi, approveChurchApi, rejectChurchApi, getAllUsersApi, getAllChurchesAdminApi } from '../services/adminApi';
import { getApprovedChurchesApi, getLatestChurchContentApi, getMyChurchApi, updateMyChurchApi } from '../services/churchApi';
import { uploadChurchContentApi, getMyChurchContentApi, deleteChurchContentApi, fetchYoutubeMetaApi } from '../services/churchContentApi';
import { createMatrimonyProfileApi, updateMatrimonyProfileApi, getMyMatrimonyProfileApi, getMatrimonyProfilesApi, sendMatrimonyInterestApi, acceptMatrimonyInterestByUserIdApi, getReceivedMatrimonyInterestsApi, getSentMatrimonyInterestsApi } from '../services/matrimonyApi';
import { getNotificationsApi, markNotificationReadApi, markAllNotificationsReadApi, clearNotificationsApi } from '../services/notificationApi';
import { getVerseOfTheDayApi, getSavedVersesApi, saveVerseApi, deleteSavedVerseApi, getBibleNotesApi, createBibleNoteApi, deleteBibleNoteApi } from '../services/bibleApi';

const AppContext = createContext(null);

export const DEMO_ACCOUNTS = [
  { id: '1', email: 'admin@gracechurch.com', password: 'admin123', name: 'Admin', role: 'admin', avatar: 'A' },
  { id: 'demo2', email: 'pastor@gracechurch.com', password: 'church123', name: 'Pastor', role: 'church_admin', avatar: 'P' },
  { id: 'demo3', email: 'john@gmail.com', password: 'user123', name: 'John User', role: 'user', avatar: 'J' },
];

const STORAGE_KEYS = {
  currentUser: 'currentUser',
  authToken: 'authToken',
  highlights: 'highlights',
  theme: 'theme',
  fontSize: 'fontSize',
  bibleLanguage: 'bibleLanguage',
  bibleVersion: 'bibleVersion',
};

const getAvatar = (name = '') => name.trim().charAt(0).toUpperCase() || '?';

const roleToUi = (role = '') => {
  const value = String(role || '').toUpperCase();
  if (value.includes('CHURCH')) return 'church_admin';
  if (value.includes('ADMIN')) return 'admin';
  return 'user';
};

const statusToUi = (status = '') => {
  const value = String(status || '').toLowerCase();
  if (value === 'active') return 'approved';
  return value || 'approved';
};

const normalizeUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    id: String(user.id),
    role: roleToUi(user.role),
    status: statusToUi(user.status),
    churchId: user.churchId ? String(user.churchId) : user.churchId,
    avatar: user.avatar || getAvatar(user.name),
  };
};

const normalizeChurch = (church) => ({
  ...church,
  id: String(church.id),
  name: church.name || church.churchName,
  location: church.location || church.churchLocation,
  address: church.address || church.churchAddress,
  phone: church.phone || church.churchPhone,
  image: church.image || '⛪',
  status: String(church.status || 'approved').toLowerCase(),
});

const normalizeContent = (item) => ({
  ...item,
  id: String(item.id),
  churchId: String(item.churchId),
  type: String(item.type || '').toLowerCase(),
  imageUri: item.imageUri || '',
  thumbnailUrl: item.thumbnailUrl || '',
  fileUri: item.fileUri || '',
});

const normalizeProfile = (profile) => ({
  ...profile,
  id: String(profile.id),
  userId: String(profile.userId),
  avatar: profile.avatar || getAvatar(profile.name),
  photoUri: profile.photoUri || '',
  familyDetails: profile.familyDetails || profile.bio || '',
  bio: profile.familyDetails || profile.bio || '',
  phone: profile.phone || '',
  email: profile.email || '',
});

const normalizeInterest = (interest) => ({
  ...interest,
  id: String(interest.id),
  fromUserId: String(interest.fromUserId),
  toUserId: String(interest.toUserId),
  profile: interest.profile ? normalizeProfile(interest.profile) : null,
  accepted: String(interest.status || '').toLowerCase() === 'accepted',
});

const normalizeNotification = (item) => ({
  ...item,
  id: String(item.id),
  toUserId: String(item.toUserId),
});

const normalizeSavedVerse = (item) => ({
  ...item,
  id: item.id || item.verseId,
  type: 'verse',
  verseNum: item.verseNum || item.verse,
});

const normalizeNoteRecord = (item) => ({
  ...item,
  id: item.id || item.verseId,
  note: item.note || '',
  text: item.text || item.verseText || '',
  verseNum: item.verseNum || item.verse,
});

const normalizeVerseOfDay = (item) => {
  if (!item) return null;
  const verseNum = item.verseNum || item.verse || '';
  const reference = item.reference || `${item.book || ''} ${item.chapter || ''}:${verseNum}`.trim();
  return {
    ...item,
    id: item.verseId || item.id || reference,
    verseId: item.verseId || item.id || reference,
    verseNum,
    reference,
    text: item.text || '',
    language: item.language || 'english',
    version: item.version || 'kjv',
  };
};

export const extractYoutubeVideoId = (input = '') => {
  const raw = String(input || '').trim();
  if (!raw) return '';
  try {
    const url = new URL(raw);
    const host = url.hostname.replace('www.', '').replace('m.', '');
    if (host === 'youtu.be') return url.pathname.split('/').filter(Boolean)[0] || '';
    if (host.includes('youtube.com')) {
      const watchId = url.searchParams.get('v');
      if (watchId) return watchId;
      const parts = url.pathname.split('/').filter(Boolean);
      const keyIndex = parts.findIndex((part) => ['embed', 'shorts', 'live'].includes(part));
      if (keyIndex >= 0 && parts[keyIndex + 1]) return parts[keyIndex + 1];
    }
  } catch {}
  const match = raw.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  return match?.[1] || '';
};

const getYoutubeThumbnailUrl = (videoId = '') => videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
const isImageFile = (mimeType = '', fileName = '', fileUri = '') => String(mimeType || '').startsWith('image/') || /\.(png|jpg|jpeg|webp|gif)$/i.test(String(fileName || fileUri || ''));

const arrayToBookmarkMap = (items = []) => {
  const map = {};
  items.forEach((item) => {
    const n = normalizeSavedVerse(item);
    if (n.id) map[n.id] = n;
  });
  return map;
};

const arrayToNoteMap = (items = []) => {
  const map = {};
  items.forEach((item) => {
    const n = normalizeNoteRecord(item);
    if (n.id) map[n.id] = n;
  });
  return map;
};

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [churchAdminRequests, setChurchAdminRequests] = useState([]);
  const [approvedChurches, setApprovedChurches] = useState([]);
  const [myChurchDetails, setMyChurchDetails] = useState(null);
  const [churchContents, setChurchContents] = useState([]);
  const [matrimonyProfiles, setMatrimonyProfiles] = useState([]);
  const [matrimonyInterests, setMatrimonyInterests] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [theme, setThemeState] = useState('light');
  const [fontSize, setFontSizeState] = useState(16);
  const [bibleLanguage, setBibleLanguageState] = useState('english');
  const [bibleVersion, setBibleVersionState] = useState('kjv');
  const [currentBibleBook, setCurrentBibleBook] = useState('Genesis');
  const [currentChapter, setCurrentChapter] = useState(1);
  const [bookmarks, setBookmarks] = useState({});
  const [highlights, setHighlights] = useState({});
  const [notes, setNotes] = useState({});
  const [verseOfDay, setVerseOfDay] = useState(null);

  const themeColors =
    theme === 'dark'
      ? {
          background: '#12121E', surface: '#1E1E2E', surfaceSecondary: '#2A2A3E', text: '#F0F0FF', textSecondary: '#B0B0C0', textLight: '#808090', primary: '#6366F1', overlay: 'rgba(99,102,241,0.10)', verseHighlight: 'rgba(99,102,241,0.15)', border: '#3A3A4A', white: '#1E1E2E',
        }
      : {
          background: '#FFFFFF', surface: '#F8F9FA', surfaceSecondary: '#F0F2F5', text: '#1A1A2E', textSecondary: '#4A4A6A', textLight: '#8A8A9A', primary: '#6366F1', overlay: 'rgba(99,102,241,0.08)', verseHighlight: 'rgba(99,102,241,0.12)', border: '#E0E0E8', white: '#FFFFFF',
        };

  const allAccounts = useMemo(() => registeredUsers, [registeredUsers]);

  const recentChurchPosts = useMemo(() => {
    return [...churchContents].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [churchContents]);

  const currentUserNotifications = useMemo(() => {
    if (!currentUser) return [];
    return notifications.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [currentUser, notifications]);

  const unreadNotificationCount = useMemo(() => currentUserNotifications.filter((item) => !item.readAt).length, [currentUserNotifications]);

  const savedBibleVerses = useMemo(() => Object.values(bookmarks || {}).sort((a, b) => new Date(b.savedAt || 0) - new Date(a.savedAt || 0)), [bookmarks]);
  const bibleNotesList = useMemo(() => Object.values(notes || {}).filter((item) => String(item.note || '').trim()).sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)), [notes]);

  const refreshPublicData = async () => {
    const [churches, latest] = await Promise.all([
      getApprovedChurchesApi().catch(() => []),
      getLatestChurchContentApi().catch(() => []),
    ]);
    setApprovedChurches((churches || []).map(normalizeChurch));
    setChurchContents((latest || []).map(normalizeContent));
  };

  const refreshAdminData = async () => {
    const [requests, users, churches, latest, profiles] = await Promise.all([
      getChurchRequestsApi().catch(() => []),
      getAllUsersApi().catch(() => []),
      getAllChurchesAdminApi().catch(() => []),
      getLatestChurchContentApi().catch(() => []),
      getMatrimonyProfilesApi().catch(() => []),
    ]);
    setChurchAdminRequests((requests || []).map((x) => ({ ...x, id: String(x.id) })));
    setRegisteredUsers((users || []).map(normalizeUser));
    setApprovedChurches((churches || []).filter((c) => String(c.status).toLowerCase() === 'approved').map(normalizeChurch));
    setChurchContents((latest || []).map(normalizeContent));
    setMatrimonyProfiles((profiles || []).map(normalizeProfile));
  };

  const refreshChurchAdminData = async () => {
    const [churches, myChurch, myContent] = await Promise.all([
      getApprovedChurchesApi().catch(() => []),
      getMyChurchApi().catch(() => null),
      getMyChurchContentApi().catch(() => []),
    ]);
    const normalizedChurch = myChurch ? normalizeChurch(myChurch) : null;
    setMyChurchDetails(normalizedChurch);
    const publicChurches = (churches || []).map(normalizeChurch);
    const mergedChurches = normalizedChurch
      ? [normalizedChurch, ...publicChurches.filter((church) => String(church.id) !== String(normalizedChurch.id))]
      : publicChurches;
    setApprovedChurches(mergedChurches);
    setChurchContents((myContent || []).map(normalizeContent));
  };


  const refreshVerseOfDay = async () => {
    try {
      const daily = await getVerseOfTheDayApi({ language: bibleLanguage, version: bibleVersion });
      const normalized = normalizeVerseOfDay(daily);
      setVerseOfDay(normalized);
      return normalized;
    } catch (error) {
      console.log('Load verse of the day error:', error?.message || error);
      return null;
    }
  };

  const refreshUserData = async () => {
    const [profiles, received, sent, notifs, saved, noteList, daily] = await Promise.all([
      getMatrimonyProfilesApi().catch(() => []),
      getReceivedMatrimonyInterestsApi().catch(() => []),
      getSentMatrimonyInterestsApi().catch(() => []),
      getNotificationsApi().catch(() => []),
      getSavedVersesApi().catch(() => []),
      getBibleNotesApi().catch(() => []),
      getVerseOfTheDayApi({ language: bibleLanguage, version: bibleVersion }).catch(() => null),
    ]);
    setMatrimonyProfiles((profiles || []).map(normalizeProfile));
    setMatrimonyInterests([...(received || []), ...(sent || [])].map(normalizeInterest));
    setNotifications((notifs || []).map(normalizeNotification));
    setBookmarks(arrayToBookmarkMap(saved || []));
    setNotes(arrayToNoteMap(noteList || []));
    if (daily) setVerseOfDay(normalizeVerseOfDay(daily));
  };

  const refreshAfterLogin = async (user) => {
    await refreshPublicData();
    if (!user) {
      setVerseOfDay(null);
      return;
    }
    await refreshVerseOfDay().catch(() => null);
    if (user.role === 'admin') await refreshAdminData();
    if (user.role === 'church_admin') await refreshChurchAdminData();
    if (user.role === 'user') await refreshUserData();
  };

  const signIn = async (email, password) => {
    const response = await loginApi(email.trim(), password);
    const safeUser = normalizeUser(response.user);
    setCurrentUser(safeUser);
    await AsyncStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(safeUser));
    await refreshAfterLogin(safeUser);
    return safeUser;
  };

  const signOut = async () => {
    await logoutApi();
    setCurrentUser(null);
    setRegisteredUsers([]);
    setChurchAdminRequests([]);
    setMyChurchDetails(null);
    setMatrimonyProfiles([]);
    setMatrimonyInterests([]);
    setNotifications([]);
    setBookmarks({});
    setNotes({});
    setVerseOfDay(null);
    await refreshPublicData();
  };

  const registerUser = async ({ name, email, phone, password }) => registerUserApi({ name, email, phone, password });

  const registerChurchAdminRequest = async (payload) => registerChurchAdminApi(payload);

  const updateChurchDetails = async (payload) => {
    const updated = normalizeChurch(await updateMyChurchApi(payload));
    setMyChurchDetails(updated);
    setApprovedChurches((prev) => [updated, ...prev.filter((church) => String(church.id) !== String(updated.id))]);
    await refreshPublicData().catch(() => {});
    return updated;
  };

  const approveChurchAdmin = async (requestId) => {
    const result = await approveChurchApi(requestId);
    await refreshAdminData();
    await refreshPublicData();
    return normalizeChurch(result);
  };

  const rejectChurchAdmin = async (requestId) => {
    await rejectChurchApi(requestId);
    await refreshAdminData();
  };

  const loadYoutubeMetadata = async (youtubeUrl) => fetchYoutubeMetaApi(youtubeUrl);

  const getContentPreviewImage = (item) => {
    if (!item) return '';
    if (item.thumbnailUrl) return item.thumbnailUrl;
    if (item.youtubeVideoId) return getYoutubeThumbnailUrl(item.youtubeVideoId);
    const videoId = extractYoutubeVideoId(item.youtubeUrl || '');
    if (videoId) return getYoutubeThumbnailUrl(videoId);
    if (item.imageUri) return item.imageUri;
    if (isImageFile(item.fileMimeType, item.fileName, item.fileUri)) return item.fileUri;
    return '';
  };

  const addChurchContent = async (payload) => {
    const saved = normalizeContent(await uploadChurchContentApi(payload));
    await refreshChurchAdminData();
    await refreshPublicData();
    return saved;
  };

  const deleteChurchContent = async (contentId) => {
    await deleteChurchContentApi(contentId);
    await refreshChurchAdminData();
  };

  const getChurchContentByChurch = (churchId, type) => {
    return churchContents.filter((item) => item.churchId === String(churchId) && (!type || item.type === type));
  };

  const addOrUpdateMatrimonyProfile = async (profile) => {
    const existing = getMyMatrimonyProfile();
    const saved = normalizeProfile(existing ? await updateMatrimonyProfileApi(profile) : await createMatrimonyProfileApi(profile));
    await refreshUserData();
    return saved;
  };

  const getMyMatrimonyProfile = () => {
    if (!currentUser) return null;
    return matrimonyProfiles.find((item) => String(item.userId) === String(currentUser.id)) || null;
  };

  const getProfileByUserId = (userId) => matrimonyProfiles.find((item) => String(item.userId) === String(userId)) || null;

  const sendMatrimonyInterest = async (profileUserId) => {
    const target = getProfileByUserId(profileUserId);
    if (!target) throw new Error('This user does not have an active matrimony profile.');
    const interest = await sendMatrimonyInterestApi(target.id);
    await refreshUserData();
    return interest;
  };

  const acceptMatrimonyInterest = async (profileUserId) => {
    const interest = await acceptMatrimonyInterestByUserIdApi(profileUserId);
    await refreshUserData();
    return interest;
  };

  const getMyReceivedMatrimonyRequests = () => {
    if (!currentUser) return [];
    return matrimonyInterests
      .filter((item) => String(item.toUserId) === String(currentUser.id))
      .map((item) => ({ ...item, accepted: item.accepted || isMutualInterest(item.fromUserId) }))
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  };

  const hasSentInterest = (profileUserId) => {
    if (!currentUser) return false;
    const profile = getProfileByUserId(profileUserId);
    if (profile?.sentInterest || profile?.mutualInterest) return true;
    return matrimonyInterests.some((item) => String(item.fromUserId) === String(currentUser.id) && String(item.toUserId) === String(profileUserId));
  };

  const hasReceivedInterest = (profileUserId) => {
    if (!currentUser) return false;
    const profile = getProfileByUserId(profileUserId);
    if (profile?.receivedInterest || profile?.mutualInterest) return true;
    return matrimonyInterests.some((item) => String(item.fromUserId) === String(profileUserId) && String(item.toUserId) === String(currentUser.id));
  };

  const isMutualInterest = (profileUserId) => {
    const profile = getProfileByUserId(profileUserId);
    if (profile?.mutualInterest || profile?.contactVisible) return true;
    return hasSentInterest(profileUserId) && hasReceivedInterest(profileUserId);
  };

  const canViewMatrimonyContact = (profile) => {
    if (!currentUser || !profile) return false;
    return String(profile.userId) === String(currentUser.id) || profile.contactVisible || isMutualInterest(profile.userId);
  };

  const markNotificationRead = async (notificationId) => {
    await markNotificationReadApi(notificationId);
    await refreshUserData();
  };

  const markAllNotificationsRead = async () => {
    await markAllNotificationsReadApi();
    await refreshUserData();
  };

  const clearMyNotifications = async () => {
    await clearNotificationsApi();
    setNotifications([]);
  };

  const isBookmarked = (id) => !!bookmarks[id];

  const toggleBookmark = (bookmark) => {
    setBookmarks((prev) => {
      const updated = { ...prev };
      if (updated[bookmark.id]) {
        delete updated[bookmark.id];
        deleteSavedVerseApi(bookmark.id).catch((e) => console.log('Delete saved verse error', e));
      } else {
        const next = { ...bookmark, savedAt: new Date().toISOString() };
        updated[bookmark.id] = next;
        saveVerseApi({ ...next, verseId: bookmark.id }).catch((e) => console.log('Save verse error', e));
      }
      return updated;
    });
  };

  const toggleHighlight = (verseId, colorId) => {
    setHighlights((prev) => {
      const updated = { ...prev };
      if (updated[verseId] === colorId) delete updated[verseId];
      else updated[verseId] = colorId;
      AsyncStorage.setItem(STORAGE_KEYS.highlights, JSON.stringify(updated));
      return updated;
    });
  };

  const addNote = (verseId, noteText, verseMeta = {}) => {
    setNotes((prev) => {
      const updated = { ...prev };
      const cleanNote = String(noteText || '').trim();
      if (cleanNote) {
        const record = {
          id: verseId,
          verseId,
          note: cleanNote,
          reference: verseMeta.reference || verseId,
          text: verseMeta.text || '',
          verseText: verseMeta.text || '',
          book: verseMeta.book || '',
          chapter: String(verseMeta.chapter || ''),
          verseNum: String(verseMeta.verseNum || ''),
          language: verseMeta.language || bibleLanguage,
          version: verseMeta.version || bibleVersion,
          updatedAt: new Date().toISOString(),
        };
        updated[verseId] = record;
        createBibleNoteApi(record).catch((e) => console.log('Save note error', e));
      } else {
        delete updated[verseId];
        deleteBibleNoteApi(verseId).catch((e) => console.log('Delete note error', e));
      }
      return updated;
    });
  };

  const setTheme = (value) => {
    setThemeState(value);
    AsyncStorage.setItem(STORAGE_KEYS.theme, value);
  };

  const setFontSize = (value) => {
    setFontSizeState(value);
    AsyncStorage.setItem(STORAGE_KEYS.fontSize, String(value));
  };

  const setBibleLanguage = (value) => {
    setBibleLanguageState(value);
    AsyncStorage.setItem(STORAGE_KEYS.bibleLanguage, value);
    if (currentUser) getVerseOfTheDayApi({ language: value, version: bibleVersion }).then((daily) => setVerseOfDay(normalizeVerseOfDay(daily))).catch(() => {});
  };

  const setBibleVersion = (value) => {
    setBibleVersionState(value);
    AsyncStorage.setItem(STORAGE_KEYS.bibleVersion, value);
    if (currentUser) getVerseOfTheDayApi({ language: bibleLanguage, version: value }).then((daily) => setVerseOfDay(normalizeVerseOfDay(daily))).catch(() => {});
  };

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const [storedUser, storedTheme, storedFontSize, storedLanguage, storedVersion, storedHighlights] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.currentUser),
          AsyncStorage.getItem(STORAGE_KEYS.theme),
          AsyncStorage.getItem(STORAGE_KEYS.fontSize),
          AsyncStorage.getItem(STORAGE_KEYS.bibleLanguage),
          AsyncStorage.getItem(STORAGE_KEYS.bibleVersion),
          AsyncStorage.getItem(STORAGE_KEYS.highlights),
        ]);
        if (storedTheme) setThemeState(storedTheme);
        if (storedFontSize) setFontSizeState(Number(storedFontSize) || 16);
        if (storedLanguage) setBibleLanguageState(storedLanguage);
        if (storedVersion) setBibleVersionState(storedVersion);
        if (storedHighlights) setHighlights(JSON.parse(storedHighlights));

        let user = null;
        if (storedUser) user = normalizeUser(JSON.parse(storedUser));
        try {
          const me = await getMeApi();
          user = normalizeUser(me);
          await AsyncStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
        } catch {}
        setCurrentUser(user);
        await refreshAfterLogin(user);
      } catch (error) {
        console.log('Load app data error:', error);
        await refreshPublicData().catch(() => {});
      } finally {
        setAuthLoading(false);
      }
    };
    loadInitial();
  }, []);

  const value = {
    currentUser,
    authLoading,
    signIn,
    signOut,

    registeredUsers,
    churchAdminRequests,
    allAccounts,
    registerUser,
    registerChurchAdminRequest,
    approveChurchAdmin,
    rejectChurchAdmin,

    approvedChurches,
    myChurchDetails,
    churchContents,
    recentChurchPosts,
    updateChurchDetails,
    addChurchContent,
    deleteChurchContent,
    getChurchContentByChurch,
    loadYoutubeMetadata,
    extractYoutubeVideoId,
    getContentPreviewImage,

    matrimonyProfiles,
    matrimonyInterests,
    addOrUpdateMatrimonyProfile,
    sendMatrimonyInterest,
    acceptMatrimonyInterest,
    getMyMatrimonyProfile,
    getMyReceivedMatrimonyRequests,
    hasSentInterest,
    hasReceivedInterest,
    isMutualInterest,
    canViewMatrimonyContact,

    notifications,
    currentUserNotifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    clearMyNotifications,

    theme,
    setTheme,
    fontSize,
    setFontSize,
    isDarkMode: theme === 'dark',
    themeColors,
    colors: themeColors,

    bibleLanguage,
    setBibleLanguage,
    bibleVersion,
    setBibleVersion,
    currentBibleBook,
    setCurrentBibleBook,
    currentChapter,
    setCurrentChapter,

    verseOfDay,
    refreshVerseOfDay,
    savedBibleVerses,
    bibleNotesList,
    isBookmarked,
    toggleBookmark,
    bookmarks,
    highlights,
    toggleHighlight,
    notes,
    addNote,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};