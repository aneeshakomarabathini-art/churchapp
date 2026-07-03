import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radii } from '../theme/theme';
import { useApp } from '../context/AppContext';

const DAILY_VERSES = [
  { text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.', reference: 'John 3:16' },
  { text: 'I can do all things through Christ which strengtheneth me.', reference: 'Philippians 4:13' },
  { text: 'The Lord is my shepherd; I shall not want.', reference: 'Psalm 23:1' },
  { text: 'Trust in the Lord with all thine heart; and lean not unto thine own understanding.', reference: 'Proverbs 3:5' },
  { text: 'God is our refuge and strength, a very present help in trouble.', reference: 'Psalm 46:1' },
  { text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God.', reference: 'Isaiah 41:10' },
  { text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.', reference: 'Matthew 11:28' },
  { text: 'Thy word is a lamp unto my feet, and a light unto my path.', reference: 'Psalm 119:105' },
  { text: 'For we walk by faith, not by sight.', reference: '2 Corinthians 5:7' },
  { text: 'Casting all your care upon him; for he careth for you.', reference: '1 Peter 5:7' },
  { text: 'This is the day which the Lord hath made; we will rejoice and be glad in it.', reference: 'Psalm 118:24' },
  { text: 'For with God nothing shall be impossible.', reference: 'Luke 1:37' },
];

const getFallbackVerseForUser = (user) => {
  const todayKey = new Date().toISOString().slice(0, 10);
  const raw = `${user?.id || user?.email || 'guest'}-${todayKey}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i += 1) {
    hash = ((hash << 5) - hash + raw.charCodeAt(i)) | 0;
  }
  return DAILY_VERSES[Math.abs(hash) % DAILY_VERSES.length];
};

const typeMeta = {
  message: { label: 'Message', icon: 'chatbubble-ellipses-outline', color: '#E63946' },
  song: { label: 'Song', icon: 'musical-notes-outline', color: '#6366F1' },
  event: { label: 'Event', icon: 'calendar-outline', color: '#52B788' },
};

const formatDate = (value) => {
  if (!value) return 'Recently';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently';
  return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const {
    currentUser,
    verseOfDay,
    approvedChurches,
    recentChurchPosts,
    matrimonyProfiles,
    getContentPreviewImage,
    unreadNotificationCount,
  } = useApp();

  const todayVerse = useMemo(() => {
    return verseOfDay?.text ? verseOfDay : getFallbackVerseForUser(currentUser);
  }, [verseOfDay, currentUser]);

  const latestVideosAndEvents = useMemo(() => {
    return recentChurchPosts
      .filter((post) => post.type === 'event' || post.youtubeVideoId || getContentPreviewImage(post))
      .slice(0, 10);
  }, [recentChurchPosts, getContentPreviewImage]);

  const quickActions = [
    { title: 'Read Bible', subtitle: 'Telugu & English', icon: 'book-outline', screen: 'Bible' },
    { title: 'Churches', subtitle: `${approvedChurches.length} registered`, icon: 'business-outline', screen: 'Church' },
    { title: 'Matrimony', subtitle: `${matrimonyProfiles.length} profiles`, icon: 'heart-outline', screen: 'Matrimony' },
    { title: 'Profile', subtitle: 'Saved & notes', icon: 'person-circle-outline', screen: 'Profile' },
  ];

  const openChurch = () => navigation.navigate('Church');

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.headerBg, { paddingTop: insets.top + 18 }]}> 
          <View style={styles.headerContent}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greeting}>Praise the Lord,</Text>
              <Text style={styles.userName}>{currentUser?.name || 'Believer'}</Text>
            </View>
            <TouchableOpacity
              style={styles.notifBtn}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.8}
            >
              <Ionicons name="notifications-outline" size={22} color={colors.goldSoft} />
              {unreadNotificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentWrap}>
          <View style={styles.verseCard}>
            <View style={styles.verseTopRow}>
              <View style={styles.verseIconBox}>
                <Ionicons name="book" size={18} color={colors.paper} />
              </View>
              <Text style={styles.verseLabel}>Verse of the Day</Text>
            </View>
            <Text style={styles.verseText}>“{todayVerse.text}”</Text>
            <Text style={styles.verseRef}>{todayVerse.reference}</Text>
          </View>

          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickGrid}>
            {quickActions.map((item) => (
              <TouchableOpacity
                key={item.title}
                style={styles.quickCard}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.85}
              >
                <View style={styles.quickIcon}>
                  <Ionicons name={item.icon} size={22} color={colors.goldDeep} />
                </View>
                <Text style={styles.quickTitle}>{item.title}</Text>
                <Text style={styles.quickSub}>{item.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>


          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Latest Videos & Events</Text>
            <TouchableOpacity onPress={openChurch}>
              <Text style={styles.viewAllText}>View Churches</Text>
            </TouchableOpacity>
          </View>

          {latestVideosAndEvents.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="images-outline" size={38} color={colors.inkFaint} />
              <Text style={styles.emptyTitle}>No latest videos or events</Text>
              <Text style={styles.emptyText}>Church admin uploaded YouTube videos and event images will show here.</Text>
            </View>
          ) : (
            latestVideosAndEvents.map((post) => {
              const meta = typeMeta[post.type] || typeMeta.message;
              const preview = getContentPreviewImage(post);
              return (
                <TouchableOpacity key={post.id} style={styles.mediaCard} onPress={openChurch} activeOpacity={0.9}>
                  {preview ? (
                    <View style={styles.mediaImageWrap}>
                      <Image source={{ uri: preview }} style={styles.mediaImage} />
                      {!!post.youtubeVideoId && (
                        <View style={styles.playBadge}>
                          <Ionicons name="play" size={20} color="#fff" />
                        </View>
                      )}
                    </View>
                  ) : (
                    <View style={[styles.noImageBox, { backgroundColor: `${meta.color}16` }]}>
                      <Ionicons name={meta.icon} size={34} color={meta.color} />
                    </View>
                  )}

                  <View style={styles.mediaBody}>
                    <View style={styles.mediaTypeRow}>
                      <View style={[styles.mediaTypePill, { backgroundColor: `${meta.color}15` }]}> 
                        <Ionicons name={meta.icon} size={13} color={meta.color} />
                        <Text style={[styles.mediaTypeText, { color: meta.color }]}>{meta.label}</Text>
                      </View>
                      <Text style={styles.mediaDate}>{post.type === 'event' && post.eventDate ? formatDate(post.eventDate) : formatDate(post.createdAt)}</Text>
                    </View>
                    <Text style={styles.mediaTitle} numberOfLines={2}>{post.title}</Text>
                    <Text style={styles.mediaChurch} numberOfLines={1}>{post.churchName}</Text>
                    {!!post.description && <Text style={styles.mediaDesc} numberOfLines={2}>{post.description}</Text>}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
        <View style={{ height: insets.bottom + 28 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBg: {
    backgroundColor: colors.ink,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    fontSize: 14,
    fontFamily: fonts.sans,
    color: colors.goldSoft,
  },
  userName: {
    fontSize: 24,
    fontFamily: fonts.serif,
    color: colors.paper,
    marginTop: 3,
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 7,
    right: 7,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#E63946',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 9,
    fontFamily: fonts.sansSemiBold,
    color: '#fff',
  },
  contentWrap: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  verseCard: {
    backgroundColor: colors.goldDeep || '#9B6A17',
    borderRadius: radii.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: '#C99732',
    marginBottom: 22,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  verseTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  verseIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  verseLabel: {
    fontSize: 15,
    fontFamily: fonts.sansSemiBold,
    color: colors.paper,
  },
  verseText: {
    fontSize: 15,
    fontFamily: fonts.serif,
    color: colors.paper,
    lineHeight: 24,
  },
  verseRef: {
    marginTop: 10,
    fontSize: 13,
    fontFamily: fonts.sansSemiBold,
    color: colors.goldSoft || '#FFF2C7',
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
    marginBottom: 12,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },
  quickCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.line,
  },
  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickTitle: {
    fontSize: 14,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
  },
  quickSub: {
    fontSize: 11,
    fontFamily: fonts.sans,
    color: colors.inkFaint,
    marginTop: 3,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewAllText: {
    fontSize: 12,
    fontFamily: fonts.sansSemiBold,
    color: colors.goldDeep,
    marginBottom: 12,
  },
  mediaCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
    marginBottom: 14,
  },
  mediaImageWrap: {
    height: 178,
    backgroundColor: '#111',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playBadge: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    left: '50%',
    top: '50%',
    marginLeft: -24,
    marginTop: -24,
  },
  noImageBox: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaBody: {
    padding: 14,
  },
  mediaTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 9,
  },
  mediaTypePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: radii.pill,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  mediaTypeText: {
    fontSize: 11,
    fontFamily: fonts.sansSemiBold,
  },
  mediaDate: {
    fontSize: 11,
    fontFamily: fonts.sans,
    color: colors.inkFaint,
  },
  mediaTitle: {
    fontSize: 16,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
    lineHeight: 22,
  },
  mediaChurch: {
    fontSize: 12,
    fontFamily: fonts.sansSemiBold,
    color: colors.goldDeep,
    marginTop: 5,
  },
  mediaDesc: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.inkFaint,
    lineHeight: 17,
    marginTop: 6,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
    marginTop: 10,
  },
  emptyText: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.inkFaint,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 5,
  },
});
