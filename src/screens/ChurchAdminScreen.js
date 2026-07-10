import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ActivityIndicator,
  Linking,
  Image,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radii } from '../theme/theme';
import { useApp } from '../context/AppContext';

const CONTENT_TYPES = [
  { key: 'message', label: 'Message', icon: 'chatbubble-ellipses-outline' },
  { key: 'song', label: 'Song', icon: 'musical-notes-outline' },
  { key: 'event', label: 'Event', icon: 'calendar-outline' },
];

const initialContentForm = {
  type: 'message',
  title: '',
  description: '',
  youtubeUrl: '',
  youtubeVideoId: '',
  thumbnailUrl: '',
  fileUri: '',
  fileName: '',
  fileMimeType: '',
  imageUri: '',
  eventDate: '',
};

const emptyChurchForm = {
  churchName: '',
  churchLocation: '',
  churchAddress: '',
  churchPhone: '',
  churchEmail: '',
  churchTiming: '',
  churchAbout: '',
  churchPhoto: null,
};

const formatDate = (value) => {
  if (!value) return 'Recently';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
};

const isImageUrl = (value = '') => /^https?:\/\//i.test(String(value || '')) || String(value || '').startsWith('file:');
const isImageAsset = (mimeType = '', name = '') => String(mimeType || '').startsWith('image/') || /\.(png|jpg|jpeg|webp|gif)$/i.test(String(name || ''));
const validateEmail = (value = '') => /\S+@\S+\.\S+/.test(String(value || '').trim());

const openLink = async (url) => {
  if (!url) return;
  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) Linking.openURL(url);
};

export default function ChurchAdminScreen() {
  const insets = useSafeAreaInsets();
  const {
    currentUser,
    signOut,
    approvedChurches,
    myChurchDetails,
    churchContents,
    updateChurchDetails,
    addChurchContent,
    deleteChurchContent,
    loadYoutubeMetadata,
    getContentPreviewImage,
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview');
  const [contentForm, setContentForm] = useState(initialContentForm);
  const [churchForm, setChurchForm] = useState(emptyChurchForm);
  const [savingContent, setSavingContent] = useState(false);
  const [savingChurch, setSavingChurch] = useState(false);
  const [hydratingYoutube, setHydratingYoutube] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const myChurch = useMemo(() => {
    return myChurchDetails || approvedChurches.find((church) => church.id === String(currentUser?.churchId)) || null;
  }, [approvedChurches, currentUser, myChurchDetails]);

  useEffect(() => {
    if (!myChurch) return;
    setChurchForm({
      churchName: myChurch.name || '',
      churchLocation: myChurch.location || '',
      churchAddress: myChurch.address || '',
      churchPhone: myChurch.phone || '',
      churchEmail: myChurch.email || '',
      churchTiming: myChurch.timing || '',
      churchAbout: myChurch.about || '',
      churchPhoto: null,
    });
  }, [myChurch?.id, myChurch?.name, myChurch?.location, myChurch?.address, myChurch?.phone, myChurch?.email, myChurch?.timing, myChurch?.about]);

  const myContents = useMemo(() => {
    if (!myChurch) return [];
    return churchContents.filter((item) => String(item.churchId) === String(myChurch.id));
  }, [churchContents, myChurch]);

  const filteredContents = useMemo(() => {
    if (filterType === 'all') return myContents;
    return myContents.filter((item) => item.type === filterType);
  }, [myContents, filterType]);

  const counts = useMemo(() => ({
    message: myContents.filter((item) => item.type === 'message').length,
    song: myContents.filter((item) => item.type === 'song').length,
    event: myContents.filter((item) => item.type === 'event').length,
  }), [myContents]);

  const updateContentForm = (key, value) => setContentForm((prev) => ({ ...prev, [key]: value }));
  const updateChurchForm = (key, value) => setChurchForm((prev) => ({ ...prev, [key]: value }));

  const pickChurchPhoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Please allow gallery access to upload church photo.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.[0]) updateChurchForm('churchPhoto', result.assets[0]);
    } catch (error) {
      Alert.alert('Image Error', 'Unable to pick church photo. Please try again.');
    }
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/*', 'video/*', 'image/*', 'application/pdf'],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (result.canceled || result.type === 'cancel') return;
      const asset = result.assets?.[0] || result;
      if (!asset?.uri) return;
      const mimeType = asset.mimeType || asset.type || '';
      const fileName = asset.name || 'selected-file';
      setContentForm((prev) => ({
        ...prev,
        fileUri: asset.uri,
        fileName,
        fileMimeType: mimeType,
        imageUri: isImageAsset(mimeType, fileName) ? asset.uri : prev.imageUri,
      }));
    } catch (error) {
      Alert.alert('File Error', 'Unable to select this file. Please try again.');
    }
  };

  const clearFile = () => setContentForm((prev) => ({ ...prev, fileUri: '', fileName: '', fileMimeType: '', imageUri: '' }));

  const hydrateYoutubeForm = async (urlValue = contentForm.youtubeUrl) => {
    const url = String(urlValue || '').trim();
    if (!url || hydratingYoutube) return null;
    setHydratingYoutube(true);
    try {
      const metadata = await loadYoutubeMetadata(url);
      setContentForm((prev) => ({
        ...prev,
        youtubeUrl: url,
        youtubeVideoId: metadata.youtubeVideoId,
        thumbnailUrl: metadata.thumbnailUrl,
        title: prev.title.trim() ? prev.title : metadata.title,
        description: prev.description.trim() ? prev.description : metadata.description,
      }));
      return metadata;
    } catch (error) {
      Alert.alert('YouTube Error', error?.message || 'Unable to fetch YouTube details.');
      return null;
    } finally {
      setHydratingYoutube(false);
    }
  };

  const submitChurchDetails = async () => {
    if (savingChurch) return;
    if (!churchForm.churchName.trim()) return Alert.alert('Fill Details', 'Please enter church name.');
    if (!churchForm.churchLocation.trim()) return Alert.alert('Fill Details', 'Please enter church location.');
    if (!churchForm.churchAddress.trim()) return Alert.alert('Fill Details', 'Please enter church address.');
    if (!churchForm.churchPhone.trim()) return Alert.alert('Fill Details', 'Please enter church phone number.');
    if (!churchForm.churchEmail.trim() || !validateEmail(churchForm.churchEmail)) return Alert.alert('Fill Details', 'Please enter valid church email.');
    if (!churchForm.churchTiming.trim()) return Alert.alert('Fill Details', 'Please enter service timings.');

    setSavingChurch(true);
    try {
      await updateChurchDetails(churchForm);
      Alert.alert('Updated', 'Church information updated successfully. Users can now see the latest details.');
      setActiveTab('overview');
    } catch (error) {
      Alert.alert('Update Failed', error?.message || 'Unable to update church details.');
    } finally {
      setSavingChurch(false);
    }
  };

  const submitContent = async () => {
    if (savingContent) return;
    let payload = { ...contentForm };
    if (payload.youtubeUrl.trim() && (!payload.title.trim() || !payload.description.trim() || !payload.thumbnailUrl)) {
      const metadata = await hydrateYoutubeForm(payload.youtubeUrl);
      if (metadata) {
        payload = {
          ...payload,
          youtubeVideoId: metadata.youtubeVideoId,
          thumbnailUrl: metadata.thumbnailUrl,
          title: payload.title.trim() ? payload.title : metadata.title,
          description: payload.description.trim() ? payload.description : metadata.description,
        };
      }
    }
    if (!payload.title.trim()) return Alert.alert('Title Required', 'Please enter title or paste a valid YouTube link to auto-fill it.');
    if (!payload.description.trim()) return Alert.alert('Description Required', 'Please enter description or paste a valid YouTube link to auto-fill it.');
    if (payload.type === 'event' && !payload.eventDate.trim()) return Alert.alert('Event Date Required', 'Please enter event date.');

    setSavingContent(true);
    try {
      await addChurchContent(payload);
      setContentForm(initialContentForm);
      setActiveTab('posts');
      Alert.alert('Uploaded', 'Your item is now visible in the user Church screen and Home latest section.');
    } catch (error) {
      Alert.alert('Upload Failed', error?.message || 'Something went wrong.');
    } finally {
      setSavingContent(false);
    }
  };

  const handleDelete = async (item) => {
    try {
      await deleteChurchContent(item.id);
    } catch (error) {
      Alert.alert('Delete Failed', 'Please try again.');
    }
  };

  const handleSignOut = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Logout Error', 'Something went wrong. Please try again.');
    } finally {
      setLoggingOut(false);
    }
  };

  const formPreview = contentForm.thumbnailUrl || contentForm.imageUri;
  const churchPhotoPreview = churchForm.churchPhoto?.uri || (isImageUrl(myChurch?.image) ? myChurch.image : '');

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}> 
        <View style={{ flex: 1 }}>
          <Text style={styles.headerRole}>Church Admin</Text>
          <Text style={styles.headerName}>{currentUser?.name || 'Church Admin'}</Text>
          <Text style={styles.headerChurch}>{myChurch?.name || 'Approved church not found'}</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn} disabled={loggingOut} activeOpacity={0.75}>
          {loggingOut ? <ActivityIndicator size="small" color={colors.goldSoft} /> : <Ionicons name="log-out-outline" size={22} color={colors.goldSoft} />}
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'edit', label: 'Edit Info' },
          { key: 'upload', label: 'Upload' },
          { key: 'posts', label: 'Posts' },
        ].map((tab) => (
          <TouchableOpacity key={tab.key} style={[styles.tabBtn, activeTab === tab.key && styles.tabBtnActive]} onPress={() => setActiveTab(tab.key)} activeOpacity={0.75}>
            <Text style={[styles.tabBtnText, activeTab === tab.key && styles.tabBtnTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {activeTab === 'overview' && (
          <View style={styles.content}>
            <View style={styles.churchCard}>
              {isImageUrl(myChurch?.image) ? <Image source={{ uri: myChurch.image }} style={styles.churchImageLarge} /> : <Text style={styles.churchEmoji}>{myChurch?.image || '⛪'}</Text>}
              <Text style={styles.churchName}>{myChurch?.name || 'Church Name'}</Text>
              <Text style={styles.churchLoc}>{myChurch?.location || 'Location not added'}</Text>
              <Text style={styles.churchAbout}>{myChurch?.about || 'Information not added'}</Text>
              <TouchableOpacity style={styles.editQuickBtn} onPress={() => setActiveTab('edit')} activeOpacity={0.85}>
                <Ionicons name="create-outline" size={16} color="#fff" />
                <Text style={styles.editQuickText}>Edit Church Information</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsRow}>
              <MiniStat icon="chatbubble-ellipses-outline" value={counts.message} label="Messages" color={colors.goldDeep} />
              <MiniStat icon="musical-notes-outline" value={counts.song} label="Songs" color="#6366F1" />
              <MiniStat icon="calendar-outline" value={counts.event} label="Events" color="#52B788" />
            </View>

            <Text style={styles.sectionTitle}>Church Information</Text>
            <InfoCard icon="location-outline" label="Address" text={myChurch?.address || 'Address not added'} />
            <InfoCard icon="time-outline" label="Timings" text={myChurch?.timing || 'Timing not added'} />
            <InfoCard icon="call-outline" label="Phone" text={myChurch?.phone || 'Phone not added'} />
            <InfoCard icon="mail-outline" label="Mail" text={myChurch?.email || 'Email not added'} />
          </View>
        )}

        {activeTab === 'edit' && (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Edit Church Information</Text>
            <TouchableOpacity style={styles.photoPicker} onPress={pickChurchPhoto} activeOpacity={0.85}>
              {churchPhotoPreview ? <Image source={{ uri: churchPhotoPreview }} style={styles.photoPreview} /> : <View style={styles.photoEmpty}><Ionicons name="camera-outline" size={28} color={colors.goldDeep} /><Text style={styles.photoEmptyText}>Upload Church Photo</Text></View>}
            </TouchableOpacity>
            <Field label="Church Name" value={churchForm.churchName} onChangeText={(t) => updateChurchForm('churchName', t)} />
            <Field label="Location / City" value={churchForm.churchLocation} onChangeText={(t) => updateChurchForm('churchLocation', t)} />
            <Field label="Address" value={churchForm.churchAddress} onChangeText={(t) => updateChurchForm('churchAddress', t)} multiline />
            <Field label="Phone Number" value={churchForm.churchPhone} onChangeText={(t) => updateChurchForm('churchPhone', t)} keyboardType="phone-pad" />
            <Field label="Mail" value={churchForm.churchEmail} onChangeText={(t) => updateChurchForm('churchEmail', t)} keyboardType="email-address" autoCapitalize="none" />
            <Field label="Timings" value={churchForm.churchTiming} onChangeText={(t) => updateChurchForm('churchTiming', t)} />
            <Field label="Church Information" value={churchForm.churchAbout} onChangeText={(t) => updateChurchForm('churchAbout', t)} multiline />
            <TouchableOpacity style={[styles.submitBtn, savingChurch && { opacity: 0.7 }]} onPress={submitChurchDetails} disabled={savingChurch}>
              {savingChurch ? <ActivityIndicator size="small" color="#fff" /> : <><Ionicons name="save-outline" size={17} color="#fff" /><Text style={styles.submitBtnText}>Save Church Details</Text></>}
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'upload' && (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Upload Message, Song or Event</Text>
            <Text style={styles.inputLabel}>Select Category</Text>
            <View style={styles.typeRow}>
              {CONTENT_TYPES.map((type) => (
                <TouchableOpacity key={type.key} style={[styles.typeBtn, contentForm.type === type.key && styles.typeBtnActive]} onPress={() => updateContentForm('type', type.key)} activeOpacity={0.8}>
                  <Ionicons name={type.icon} size={16} color={contentForm.type === type.key ? colors.paper : colors.goldDeep} />
                  <Text style={[styles.typeText, contentForm.type === type.key && styles.typeTextActive]}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>YouTube Link</Text>
            <View style={styles.youtubeRow}>
              <TextInput style={[styles.input, { flex: 1, marginBottom: 0 }]} placeholder="Paste YouTube link" placeholderTextColor={colors.inkFaint} value={contentForm.youtubeUrl} onChangeText={(text) => updateContentForm('youtubeUrl', text)} onBlur={() => hydrateYoutubeForm(contentForm.youtubeUrl)} autoCapitalize="none" autoCorrect={false} />
              <TouchableOpacity style={styles.youtubeFetchBtn} onPress={() => hydrateYoutubeForm(contentForm.youtubeUrl)} disabled={hydratingYoutube || !contentForm.youtubeUrl.trim()} activeOpacity={0.8}>
                {hydratingYoutube ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="sparkles-outline" size={18} color="#fff" />}
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>Paste YouTube link to auto-fill title and thumbnail. Videos play inside the user app.</Text>

            {!!formPreview && <View style={styles.previewBox}><Image source={{ uri: formPreview }} style={styles.previewImage} />{!!contentForm.youtubeVideoId && <View style={styles.playOverlay}><Ionicons name="play" size={22} color="#fff" /></View>}</View>}
            <Field label="Title" value={contentForm.title} onChangeText={(t) => updateContentForm('title', t)} placeholder="Auto-fills from YouTube or enter manually" />
            <Field label="Description" value={contentForm.description} onChangeText={(t) => updateContentForm('description', t)} placeholder="Write details" multiline />
            {contentForm.type === 'event' && <Field label="Event Date" value={contentForm.eventDate} onChangeText={(t) => updateContentForm('eventDate', t)} placeholder="Example: 2026-06-30" />}

            <Text style={styles.inputLabel}>Device File / Event Image</Text>
            <TouchableOpacity style={styles.filePickBtn} onPress={pickFile} activeOpacity={0.8}>
              <Ionicons name="cloud-upload-outline" size={18} color={colors.goldDeep} />
              <Text style={styles.filePickText}>{contentForm.fileName || 'Choose audio, video, image, or PDF file'}</Text>
            </TouchableOpacity>
            {!!contentForm.fileName && <TouchableOpacity style={styles.clearFileBtn} onPress={clearFile}><Ionicons name="close-circle-outline" size={15} color="#E63946" /><Text style={styles.clearFileText}>Remove selected file</Text></TouchableOpacity>}

            <TouchableOpacity style={[styles.submitBtn, savingContent && { opacity: 0.7 }]} onPress={submitContent} disabled={savingContent}>
              {savingContent ? <ActivityIndicator size="small" color="#fff" /> : <><Ionicons name="send" size={17} color="#fff" /><Text style={styles.submitBtnText}>Upload & Publish</Text></>}
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'posts' && (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>My Uploaded Items</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
              {['all', 'message', 'song', 'event'].map((type) => <TouchableOpacity key={type} style={[styles.filterBtn, filterType === type && styles.filterBtnActive]} onPress={() => setFilterType(type)} activeOpacity={0.8}><Text style={[styles.filterText, filterType === type && styles.filterTextActive]}>{type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}</Text></TouchableOpacity>)}
            </ScrollView>
            {filteredContents.length === 0 ? <EmptyState /> : filteredContents.map((item) => <PostCard key={item.id} item={item} onDelete={() => handleDelete(item)} preview={getContentPreviewImage(item)} />)}
          </View>
        )}
        <View style={{ height: insets.bottom + 24 }} />
      </ScrollView>
    </View>
  );
}

function Field({ label, value, onChangeText, placeholder, multiline, keyboardType, autoCapitalize }) {
  return <><Text style={styles.inputLabel}>{label}</Text><TextInput style={[styles.input, multiline && styles.textArea]} placeholder={placeholder || label} placeholderTextColor={colors.inkFaint} value={value} onChangeText={onChangeText} multiline={multiline} textAlignVertical={multiline ? 'top' : undefined} keyboardType={keyboardType} autoCapitalize={autoCapitalize} /></>;
}

function InfoCard({ icon, label, text }) {
  return <View style={styles.infoCard}><Ionicons name={icon} size={18} color={colors.goldDeep} /><View style={{ flex: 1 }}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoText}>{text}</Text></View></View>;
}

function MiniStat({ icon, value, label, color }) {
  return <View style={styles.miniStat}><Ionicons name={icon} size={22} color={color} /><Text style={styles.miniStatValue}>{value}</Text><Text style={styles.miniStatLabel}>{label}</Text></View>;
}

function EmptyState() {
  return <View style={styles.emptyCard}><Ionicons name="folder-open-outline" size={36} color={colors.inkFaint} /><Text style={styles.emptyTitle}>No uploads yet</Text><Text style={styles.emptyText}>Upload messages, songs and events from the Upload tab.</Text></View>;
}

function PostCard({ item, preview, onDelete }) {
  const type = CONTENT_TYPES.find((x) => x.key === item.type) || CONTENT_TYPES[0];
  return <View style={styles.postCard}>{!!preview && <View style={styles.postPreviewWrap}><Image source={{ uri: preview }} style={styles.postPreviewImage} />{!!item.youtubeVideoId && <View style={styles.postPlayBadge}><Ionicons name="play" size={18} color="#fff" /></View>}</View>}<View style={styles.postTopRow}><View style={styles.postIcon}><Ionicons name={type.icon} size={18} color={colors.goldDeep} /></View><View style={{ flex: 1 }}><Text style={styles.postTitle}>{item.title}</Text><Text style={styles.postMeta}>{item.type.toUpperCase()} • {formatDate(item.createdAt)}</Text></View><TouchableOpacity style={styles.deleteBtn} onPress={onDelete}><Ionicons name="trash-outline" size={17} color="#E63946" /></TouchableOpacity></View><Text style={styles.postDescription}>{item.description}</Text>{item.type === 'event' && !!item.eventDate && <Text style={styles.postExtra}>Event Date: {formatDate(item.eventDate)}</Text>}<View style={styles.postActions}>{!!item.youtubeUrl && <TouchableOpacity style={styles.smallActionBtn} onPress={() => openLink(item.youtubeUrl)}><Ionicons name="logo-youtube" size={15} color="#E63946" /><Text style={styles.smallActionText}>YouTube Link</Text></TouchableOpacity>}{!!item.fileUri && <TouchableOpacity style={styles.smallActionBtn} onPress={() => openLink(item.fileUri)}><Ionicons name="document-attach-outline" size={15} color={colors.goldDeep} /><Text style={styles.smallActionText}>{item.fileName || 'Open File'}</Text></TouchableOpacity>}</View></View>;
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 14, backgroundColor: '#6366F1' },
  headerRole: { fontSize: 12, fontFamily: fonts.sans, color: 'rgba(255,255,255,0.72)', letterSpacing: 0.5 },
  headerName: { fontSize: 18, fontFamily: fonts.sansSemiBold, color: '#fff', marginTop: 2 },
  headerChurch: { fontSize: 12, fontFamily: fonts.sansMedium, color: colors.goldSoft, marginTop: 4 },
  signOutBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  tabRow: { flexDirection: 'row', backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.line },
  tabBtn: { flex: 1, paddingVertical: 13, alignItems: 'center' },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: '#6366F1' },
  tabBtnText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.inkFaint },
  tabBtnTextActive: { color: '#6366F1', fontFamily: fonts.sansSemiBold },
  content: { padding: 20 },
  churchCard: { backgroundColor: colors.surface, borderRadius: radii.xl, padding: 18, alignItems: 'center', borderWidth: 1, borderColor: colors.line, marginBottom: 16 },
  churchImageLarge: { width: '100%', height: 180, borderRadius: radii.lg, marginBottom: 12, backgroundColor: colors.goldSoft },
  churchEmoji: { fontSize: 42, marginBottom: 8 },
  churchName: { fontSize: 18, fontFamily: fonts.sansSemiBold, color: colors.ink, textAlign: 'center' },
  churchLoc: { fontSize: 13, fontFamily: fonts.sans, color: colors.inkFaint, marginTop: 4, textAlign: 'center' },
  churchAbout: { fontSize: 13, fontFamily: fonts.sans, color: colors.inkSoft, lineHeight: 19, textAlign: 'center', marginTop: 10 },
  editQuickBtn: { marginTop: 14, backgroundColor: '#6366F1', borderRadius: radii.pill, paddingHorizontal: 14, paddingVertical: 9, flexDirection: 'row', alignItems: 'center', gap: 7 },
  editQuickText: { fontSize: 12, fontFamily: fonts.sansSemiBold, color: '#fff' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 22 },
  miniStat: { flex: 1, backgroundColor: colors.surface, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.line, paddingVertical: 14, alignItems: 'center' },
  miniStatValue: { fontSize: 19, fontFamily: fonts.sansSemiBold, color: colors.ink, marginTop: 6 },
  miniStatLabel: { fontSize: 11, fontFamily: fonts.sans, color: colors.inkFaint, marginTop: 2 },
  sectionTitle: { fontSize: 17, fontFamily: fonts.sansSemiBold, color: colors.ink, marginBottom: 14 },
  infoCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.line, padding: 14, marginBottom: 10 },
  infoLabel: { fontSize: 11, fontFamily: fonts.sans, color: colors.inkFaint, marginBottom: 2 },
  infoText: { fontSize: 13, fontFamily: fonts.sansMedium, color: colors.ink, lineHeight: 18 },
  photoPicker: { height: 170, borderRadius: radii.xl, overflow: 'hidden', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, marginBottom: 14 },
  photoPreview: { width: '100%', height: '100%', resizeMode: 'cover' },
  photoEmpty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  photoEmptyText: { fontSize: 13, fontFamily: fonts.sansSemiBold, color: colors.goldDeep },
  typeRow: { flexDirection: 'row', gap: 9, marginBottom: 16 },
  typeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 11, borderRadius: radii.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  typeBtnActive: { backgroundColor: '#6366F1', borderColor: '#6366F1' },
  typeText: { fontSize: 12, fontFamily: fonts.sansSemiBold, color: colors.goldDeep },
  typeTextActive: { color: colors.paper },
  inputLabel: { fontSize: 12, fontFamily: fonts.sansSemiBold, color: colors.ink, marginBottom: 7, marginTop: 4 },
  input: { backgroundColor: colors.surface, borderRadius: radii.md, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 13, paddingVertical: 12, fontSize: 14, fontFamily: fonts.sans, color: colors.ink, marginBottom: 14 },
  textArea: { minHeight: 94 },
  youtubeRow: { flexDirection: 'row', gap: 9, alignItems: 'center' },
  youtubeFetchBtn: { width: 46, height: 46, borderRadius: radii.md, backgroundColor: '#E63946', alignItems: 'center', justifyContent: 'center' },
  helperText: { fontSize: 11, fontFamily: fonts.sans, color: colors.inkFaint, marginTop: 6, marginBottom: 12, lineHeight: 16 },
  previewBox: { height: 176, borderRadius: radii.xl, overflow: 'hidden', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, marginBottom: 14 },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  playOverlay: { position: 'absolute', left: '50%', top: '50%', marginLeft: -24, marginTop: -24, width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' },
  filePickBtn: { minHeight: 48, borderRadius: radii.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 8 },
  filePickText: { flex: 1, fontSize: 13, fontFamily: fonts.sansMedium, color: colors.inkSoft },
  clearFileBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  clearFileText: { fontSize: 12, fontFamily: fonts.sansMedium, color: '#E63946' },
  submitBtn: { marginTop: 22, backgroundColor: '#6366F1', borderRadius: radii.md, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  submitBtnText: { color: '#fff', fontSize: 14, fontFamily: fonts.sansSemiBold },
  filterRow: { gap: 8, paddingBottom: 14 },
  filterBtn: { paddingHorizontal: 15, paddingVertical: 9, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  filterBtnActive: { backgroundColor: '#6366F1', borderColor: '#6366F1' },
  filterText: { fontSize: 12, fontFamily: fonts.sansSemiBold, color: colors.inkSoft },
  filterTextActive: { color: colors.paper },
  emptyCard: { backgroundColor: colors.surface, borderRadius: radii.xl, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: colors.line },
  emptyTitle: { fontSize: 15, fontFamily: fonts.sansSemiBold, color: colors.ink, marginTop: 10 },
  emptyText: { fontSize: 12, fontFamily: fonts.sans, color: colors.inkFaint, textAlign: 'center', lineHeight: 18, marginTop: 4 },
  postCard: { backgroundColor: colors.surface, borderRadius: radii.xl, borderWidth: 1, borderColor: colors.line, padding: 14, marginBottom: 13 },
  postPreviewWrap: { height: 158, borderRadius: radii.lg, overflow: 'hidden', backgroundColor: colors.paper, marginBottom: 12 },
  postPreviewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  postPlayBadge: { position: 'absolute', left: '50%', top: '50%', width: 44, height: 44, borderRadius: 22, marginLeft: -22, marginTop: -22, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' },
  postTopRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  postIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  postTitle: { fontSize: 14, fontFamily: fonts.sansSemiBold, color: colors.ink },
  postMeta: { fontSize: 10, fontFamily: fonts.sansMedium, color: colors.inkFaint, marginTop: 3 },
  deleteBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FDECEC', alignItems: 'center', justifyContent: 'center' },
  postDescription: { fontSize: 12, fontFamily: fonts.sans, color: colors.inkSoft, lineHeight: 18, marginTop: 10 },
  postExtra: { fontSize: 12, fontFamily: fonts.sansSemiBold, color: colors.sageDeep, marginTop: 8 },
  postActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 11 },
  smallActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.paper, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 10, paddingVertical: 7 },
  smallActionText: { fontSize: 11, fontFamily: fonts.sansSemiBold, color: colors.ink },
});
