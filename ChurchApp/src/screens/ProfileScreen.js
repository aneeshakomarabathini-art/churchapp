import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
  ActivityIndicator,
  Modal,
  SafeAreaView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radii } from '../theme/theme';
import { useApp } from '../context/AppContext';

const ROLE_LABELS = {
  admin: 'Super Admin',
  church_admin: 'Church Admin',
  user: 'Member',
};

const ROLE_COLORS = {
  admin: '#E63946',
  church_admin: '#6366F1',
  user: colors.goldDeep,
};

const parseVerseId = (verseId = '') => {
  const parts = String(verseId || '').split('-');
  if (parts.length < 3) return { book: '', chapter: '', verseNum: '', reference: verseId || 'Saved Verse' };
  const verseNum = parts.pop();
  const chapter = parts.pop();
  const book = parts.join('-');
  return {
    book,
    chapter: Number(chapter) || chapter,
    verseNum: Number(verseNum) || verseNum,
    reference: `${book} ${chapter}:${verseNum}`,
  };
};

const normalizeNote = (id, value) => {
  const parsed = parseVerseId(id);
  if (value && typeof value === 'object') {
    return {
      id: value.id || id,
      note: value.note || '',
      reference: value.reference || parsed.reference,
      text: value.text || '',
      book: value.book || parsed.book,
      chapter: value.chapter || parsed.chapter,
      verseNum: value.verseNum || parsed.verseNum,
      updatedAt: value.updatedAt || '',
    };
  }

  return {
    id,
    note: String(value || ''),
    reference: parsed.reference,
    text: '',
    book: parsed.book,
    chapter: parsed.chapter,
    verseNum: parsed.verseNum,
    updatedAt: '',
  };
};

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const {
    currentUser,
    signOut,
    bookmarks,
    notes,
    savedBibleVerses,
    bibleNotesList,
    theme,
    setTheme,
    fontSize,
    setFontSize,
    bibleLanguage,
    setBibleLanguage,
    bibleVersion,
    setBibleVersion,
  } = useApp();

  const [notifEnabled, setNotifEnabled] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [libraryMode, setLibraryMode] = useState(null);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);

  const savedList = useMemo(() => {
    if (Array.isArray(savedBibleVerses)) return savedBibleVerses;
    return Object.values(bookmarks || {}).filter((item) => item?.type === 'verse');
  }, [bookmarks, savedBibleVerses]);

  const notesList = useMemo(() => {
    if (Array.isArray(bibleNotesList)) return bibleNotesList;
    return Object.entries(notes || {})
      .map(([id, value]) => normalizeNote(id, value))
      .filter((item) => item.note);
  }, [notes, bibleNotesList]);

  const bookmarkCount = savedList.length;
  const notesCount = notesList.length;

  const roleColor = ROLE_COLORS[currentUser?.role] || colors.goldDeep;
  const roleLabel = ROLE_LABELS[currentUser?.role] || 'Member';


  const handleSignOut = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await signOut();
    } finally {
      setLoggingOut(false);
    }
  };

  const openLibrary = (mode) => {
    setLibraryMode(mode);
  };

  const closeLibrary = () => {
    setLibraryMode(null);
  };

  const openBibleItem = (item) => {
    closeLibrary();
    const parsed = parseVerseId(item.id);
    const book = item.book || parsed.book;
    const chapter = item.chapter || parsed.chapter;
    navigation.navigate('Bible', {
      book,
      chapter,
      verseId: item.id,
    });
  };

  const libraryItems = libraryMode === 'notes' ? notesList : savedList;
  const libraryTitle = libraryMode === 'notes' ? 'My Notes' : 'Saved Verses';
  const libraryEmpty = libraryMode === 'notes'
    ? 'Your Bible notes will appear here after you write notes on verses.'
    : 'Your saved verses will appear here after you tap Save in Bible screen.';

  const menuItems = [
    {
      id: 1,
      icon: 'bookmark',
      label: 'Saved Verses',
      value: `${bookmarkCount}`,
      onPress: () => openLibrary('saved'),
    },
    {
      id: 2,
      icon: 'create',
      label: 'Bible Notes',
      value: `${notesCount}`,
      onPress: () => openLibrary('notes'),
    },
    {
      id: 3,
      icon: 'settings',
      label: 'Settings',
      value: 'Theme, Bible, font',
      onPress: () => setSettingsVisible(true),
    },
    {
      id: 4,
      icon: 'help-circle',
      label: 'Help & Support',
      value: '',
      onPress: () => setHelpVisible(true),
    },
    {
      id: 5,
      icon: 'information-circle',
      label: 'About App',
      value: 'v1.0',
      onPress: () => Alert.alert('About App', 'Divine Light Bible App v1.0\n\nBible reading, church updates, matrimony, saved verses, notes and notifications.'),
    },
  ];

  const renderLibraryItem = (item) => {
    const isNote = libraryMode === 'notes';
    const reference = item.reference || parseVerseId(item.id).reference;

    return (
      <TouchableOpacity key={item.id} style={styles.libraryItem} onPress={() => openBibleItem(item)} activeOpacity={0.85}>
        <View style={styles.libraryIconWrap}>
          <Ionicons name={isNote ? 'create-outline' : 'bookmark'} size={18} color={colors.goldDeep} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.libraryReference}>{reference}</Text>
          {!!item.text && <Text style={styles.libraryVerse} numberOfLines={2}>{item.text}</Text>}
          {isNote && <Text style={styles.libraryNote} numberOfLines={3}>{item.note}</Text>}
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.inkFaint} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <View style={[styles.headerBg, { paddingTop: insets.top + 16 }]}> 
        <Text style={styles.screenTitle}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 20, marginTop: 18 }}>
          <View style={styles.profileCard}>
            <View style={[styles.avatarCircle, { backgroundColor: roleColor + '20' }]}> 
              <Text style={[styles.avatarText, { color: roleColor }]}> 
                {currentUser?.avatar || currentUser?.name?.charAt(0) || '?'}
              </Text>
            </View>

            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.profileName}>{currentUser?.name || 'Guest'}</Text>
              <Text style={styles.profileEmail}>{currentUser?.email || ''}</Text>
              <View style={[styles.roleBadge, { backgroundColor: roleColor + '15' }]}> 
                <Text style={[styles.roleBadgeText, { color: roleColor }]}>{roleLabel}</Text>
              </View>
            </View>
          </View>
        </View>


        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <Text style={styles.sectionTitle}>Bible Library</Text>
          <View style={styles.libraryPreviewRow}>
            <TouchableOpacity style={styles.libraryPreviewCard} onPress={() => openLibrary('saved')} activeOpacity={0.85}>
              <Ionicons name="bookmark" size={24} color={colors.goldDeep} />
              <Text style={styles.previewValue}>{bookmarkCount}</Text>
              <Text style={styles.previewLabel}>Saved Verses</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.libraryPreviewCard} onPress={() => openLibrary('notes')} activeOpacity={0.85}>
              <Ionicons name="create" size={24} color="#6366F1" />
              <Text style={styles.previewValue}>{notesCount}</Text>
              <Text style={styles.previewLabel}>Notes</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, index === menuItems.length - 1 && { borderBottomWidth: 0 }]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.menuLeft}>
                  <View style={styles.menuIconWrap}>
                    <Ionicons name={item.icon} size={18} color={colors.goldDeep} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    {!!item.value && <Text style={styles.menuValue}>{item.value}</Text>}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.inkFaint} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
          <View style={styles.menuCard}>
            <View style={[styles.menuItem, { borderBottomWidth: 0 }]}> 
              <View style={styles.menuLeft}>
                <View style={styles.menuIconWrap}>
                  <Ionicons name="notifications" size={18} color={colors.goldDeep} />
                </View>
                <Text style={styles.menuLabel}>Notifications</Text>
              </View>
              <Switch
                value={notifEnabled}
                onValueChange={setNotifEnabled}
                trackColor={{ false: colors.line, true: colors.goldDeep + '80' }}
                thumbColor={notifEnabled ? colors.goldDeep : '#ccc'}
              />
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={[styles.menuItem, { borderBottomWidth: 0 }]}
              onPress={handleSignOut}
              disabled={loggingOut}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <View style={[styles.menuIconWrap, { backgroundColor: '#FDECEA' }]}> 
                  {loggingOut ? (
                    <ActivityIndicator size="small" color="#E63946" />
                  ) : (
                    <Ionicons name="log-out-outline" size={18} color="#E63946" />
                  )}
                </View>
                <Text style={[styles.menuLabel, { color: '#E63946' }]}> 
                  {loggingOut ? 'Signing Out...' : 'Sign Out'}
                </Text>
              </View>
              {loggingOut ? null : <Ionicons name="chevron-forward" size={18} color="#E63946" />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ alignItems: 'center', paddingVertical: 28 }}>
          <Text style={styles.footerApp}>Grace Community Church</Text>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      <Modal visible={!!libraryMode} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeLibrary} activeOpacity={0.8}>
              <Ionicons name="close" size={24} color={colors.ink} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{libraryTitle}</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView contentContainerStyle={styles.libraryContent} showsVerticalScrollIndicator={false}>
            {libraryItems.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons name={libraryMode === 'notes' ? 'create-outline' : 'bookmark-outline'} size={42} color={colors.inkFaint} />
                <Text style={styles.emptyTitle}>Nothing saved yet</Text>
                <Text style={styles.emptyText}>{libraryEmpty}</Text>
              </View>
            ) : (
              libraryItems.map(renderLibraryItem)
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal visible={settingsVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSettingsVisible(false)} activeOpacity={0.8}>
              <Ionicons name="close" size={24} color={colors.ink} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Settings</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView contentContainerStyle={styles.settingsContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.settingsSectionTitle}>Appearance</Text>
            <OptionRow label="Light Mode" icon="sunny-outline" active={theme === 'light'} onPress={() => setTheme('light')} />
            <OptionRow label="Dark Mode" icon="moon-outline" active={theme === 'dark'} onPress={() => setTheme('dark')} />

            <Text style={styles.settingsSectionTitle}>Bible Font Size</Text>
            <View style={styles.segmentRow}>
              {[14, 16, 18, 20].map((size) => (
                <TouchableOpacity key={size} style={[styles.segmentBtn, fontSize === size && styles.segmentBtnActive]} onPress={() => setFontSize(size)} activeOpacity={0.8}>
                  <Text style={[styles.segmentText, fontSize === size && styles.segmentTextActive]}>{size}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.settingsSectionTitle}>Bible Language</Text>
            <OptionRow label="English" icon="language-outline" active={bibleLanguage === 'english'} onPress={() => setBibleLanguage('english')} />
            <OptionRow label="Telugu" icon="language-outline" active={bibleLanguage === 'telugu'} onPress={() => setBibleLanguage('telugu')} />

            <Text style={styles.settingsSectionTitle}>Bible Version</Text>
            <OptionRow label="KJV" icon="book-outline" active={bibleVersion === 'kjv'} onPress={() => setBibleVersion('kjv')} />
            <OptionRow label="WEB" icon="book-outline" active={bibleVersion === 'web'} onPress={() => setBibleVersion('web')} />

            <View style={styles.noteBox}>
              <Ionicons name="checkmark-circle-outline" size={20} color={colors.goldDeep} />
              <Text style={styles.noteBoxText}>Settings are saved locally and will apply immediately in Bible and Profile screens.</Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal visible={helpVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setHelpVisible(false)} activeOpacity={0.8}>
              <Ionicons name="close" size={24} color={colors.ink} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Help & Support</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView contentContainerStyle={styles.settingsContent} showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.helpCard} onPress={() => Linking.openURL('mailto:support@gracechurch.com')} activeOpacity={0.85}>
              <View style={styles.helpIcon}><Ionicons name="mail-outline" size={22} color={colors.goldDeep} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.helpTitle}>Email Support</Text>
                <Text style={styles.helpText}>support@gracechurch.com</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.inkFaint} />
            </TouchableOpacity>



            <Text style={styles.settingsSectionTitle}>Quick Help</Text>
            <HelpFaq title="Where are saved verses?" text="Open Profile → Bible Library → Saved Verses." />
            <HelpFaq title="Where are Bible notes?" text="Open Profile → Bible Library → Bible Notes." />
            <HelpFaq title="How church content appears?" text="Church admin uploads messages, songs or events. Users see them in Churches screen and Home latest section." />
            <HelpFaq title="How matrimony contact unlocks?" text="Contact details are visible only after mutual interest acceptance." />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

function OptionRow({ label, icon, active, onPress }) {
  return (
    <TouchableOpacity style={styles.optionRow} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.menuLeft}>
        <View style={styles.menuIconWrap}>
          <Ionicons name={icon} size={18} color={colors.goldDeep} />
        </View>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={21} color={active ? colors.goldDeep : colors.inkFaint} />
    </TouchableOpacity>
  );
}

function HelpFaq({ title, text }) {
  return (
    <View style={styles.faqCard}>
      <Text style={styles.faqTitle}>{title}</Text>
      <Text style={styles.faqText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBg: {
    backgroundColor: colors.ink,
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  screenTitle: {
    fontSize: 22,
    fontFamily: fonts.serif,
    color: colors.paper,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontFamily: fonts.sansSemiBold,
  },
  profileName: {
    fontSize: 16,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.inkFaint,
    marginBottom: 6,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  roleBadgeText: {
    fontSize: 11,
    fontFamily: fonts.sansSemiBold,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
    marginBottom: 10,
  },
  libraryPreviewRow: {
    flexDirection: 'row',
    gap: 12,
  },
  libraryPreviewCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    alignItems: 'center',
  },
  previewValue: {
    fontSize: 22,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
    marginTop: 8,
  },
  previewLabel: {
    fontSize: 11,
    fontFamily: fonts.sans,
    color: colors.inkFaint,
    marginTop: 3,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 14,
    fontFamily: fonts.sansMedium,
    color: colors.ink,
  },
  menuValue: {
    fontSize: 11,
    fontFamily: fonts.sans,
    color: colors.inkFaint,
    marginTop: 2,
  },
  footerApp: {
    fontSize: 13,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
  },
  footerVersion: {
    fontSize: 11,
    fontFamily: fonts.sans,
    color: colors.inkFaint,
    marginTop: 3,
  },
  modalHeader: {
    height: 58,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
  },
  libraryContent: {
    padding: 18,
    paddingBottom: 36,
  },
  libraryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    marginBottom: 12,
  },
  libraryIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  libraryReference: {
    fontSize: 14,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
  },
  libraryVerse: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.inkFaint,
    lineHeight: 18,
    marginTop: 4,
  },
  libraryNote: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.ink,
    lineHeight: 18,
    marginTop: 6,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.line,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
    marginTop: 12,
  },
  emptyText: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.inkFaint,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 5,
  },

  settingsContent: {
    padding: 18,
    paddingBottom: 36,
  },
  settingsSectionTitle: {
    fontSize: 14,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
    marginTop: 10,
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    marginBottom: 10,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  segmentBtn: {
    flex: 1,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingVertical: 11,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: colors.goldDeep,
    borderColor: colors.goldDeep,
  },
  segmentText: {
    fontSize: 13,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
  },
  segmentTextActive: {
    color: '#fff',
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.goldSoft,
    borderRadius: radii.lg,
    padding: 14,
    marginTop: 12,
  },
  noteBoxText: {
    flex: 1,
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.ink,
    lineHeight: 18,
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    marginBottom: 12,
  },
  helpIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  helpTitle: {
    fontSize: 14,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
  },
  helpText: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.inkFaint,
    marginTop: 3,
  },
  faqCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    marginBottom: 10,
  },
  faqTitle: {
    fontSize: 13,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
  },
  faqText: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.inkFaint,
    lineHeight: 18,
    marginTop: 5,
  },
});
