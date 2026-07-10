import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Linking,
  Image,
  Modal,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radii } from '../theme/theme';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { key: 'message', label: 'Messages', icon: 'chatbubble-ellipses-outline' },
  { key: 'song', label: 'Songs', icon: 'musical-notes-outline' },
  { key: 'event', label: 'Events', icon: 'calendar-outline' },
];

const formatDate = (value) => {
  if (!value) return 'Recently';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
};

const isImageUrl = (value = '') => /^https?:\/\//i.test(String(value || '')) || String(value || '').startsWith('file:');

const openLink = async (url) => {
  if (!url) return;
  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) Linking.openURL(url);
};

function VideoModal({ visible, item, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <SafeAreaView style={styles.videoModalSafe}>
        <View style={styles.videoHeader}>
          <TouchableOpacity style={styles.videoCloseBtn} onPress={onClose} activeOpacity={0.8}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.videoTitle} numberOfLines={1}>{item?.title || 'Church Video'}</Text>
            <Text style={styles.videoSub} numberOfLines={1}>{item?.churchName || 'Church'}</Text>
          </View>
        </View>

        <View style={styles.playerWrap}>
          {!!item?.youtubeVideoId && (
            <YoutubePlayer height={Math.min(250, width * 0.58)} play videoId={item.youtubeVideoId} />
          )}
        </View>

        <ScrollView contentContainerStyle={styles.videoDetails}>
          <Text style={styles.videoDetailTitle}>{item?.title}</Text>
          <Text style={styles.videoDetailMeta}>{item?.type?.toUpperCase()} • {formatDate(item?.createdAt)}</Text>
          <Text style={styles.videoDetailDescription}>{item?.description}</Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function ContentCard({ item, onPlay, getContentPreviewImage }) {
  const category = CATEGORIES.find((cat) => cat.key === item.type) || CATEGORIES[0];
  const hasYoutube = !!item.youtubeVideoId;
  const hasFile = !!item.fileUri;
  const hasOnlyFileName = !item.fileUri && !!item.fileName;
  const previewImage = getContentPreviewImage(item);

  return (
    <View style={styles.contentCard}>
      {!!previewImage && (
        <TouchableOpacity
          style={styles.mediaPreview}
          onPress={() => (hasYoutube ? onPlay(item) : undefined)}
          activeOpacity={hasYoutube ? 0.85 : 1}
        >
          <Image source={{ uri: previewImage }} style={styles.mediaImage} />
          {hasYoutube && (
            <View style={styles.youtubeOverlay}>
              <Ionicons name="play" size={22} color="#fff" />
            </View>
          )}
          <View style={styles.mediaTypeBadge}>
            <Ionicons name={hasYoutube ? 'logo-youtube' : category.icon} size={13} color="#fff" />
            <Text style={styles.mediaTypeText}>{hasYoutube ? 'Play in app' : category.label}</Text>
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.contentTopRow}>
        <View style={styles.contentIconWrap}>
          <Ionicons name={category.icon} size={18} color={colors.goldDeep} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.contentTitle}>{item.title}</Text>
          <Text style={styles.contentMeta}>{item.churchName} • {formatDate(item.createdAt)}</Text>
        </View>
      </View>

      {!!item.description && <Text style={styles.contentDescription}>{item.description}</Text>}

      {item.type === 'event' && !!item.eventDate && (
        <View style={styles.eventDateBox}>
          <Ionicons name="calendar" size={14} color={colors.sageDeep} />
          <Text style={styles.eventDateText}>Event Date: {formatDate(item.eventDate)}</Text>
        </View>
      )}

      {(hasYoutube || hasFile || hasOnlyFileName) && (
        <View style={styles.contentActions}>
          {hasYoutube && (
            <TouchableOpacity style={styles.smallActionBtn} onPress={() => onPlay(item)}>
              <Ionicons name="play-circle" size={15} color="#E63946" />
              <Text style={styles.smallActionText}>Play Video</Text>
            </TouchableOpacity>
          )}
          {hasFile && (
            <TouchableOpacity style={styles.smallActionBtn} onPress={() => openLink(item.fileUri)}>
              <Ionicons name="document-attach-outline" size={15} color={colors.goldDeep} />
              <Text style={styles.smallActionText}>{item.fileName || 'Open File'}</Text>
            </TouchableOpacity>
          )}
          {hasOnlyFileName && (
            <View style={styles.smallActionBtn}>
              <Ionicons name="document-attach-outline" size={15} color={colors.goldDeep} />
              <Text style={styles.smallActionText}>{item.fileName}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export default function ChurchScreen() {
  const insets = useSafeAreaInsets();
  const { approvedChurches, getChurchContentByChurch, getContentPreviewImage } = useApp();

  const [search, setSearch] = useState('');
  const [selectedChurch, setSelectedChurch] = useState(null);
  const [activeCategory, setActiveCategory] = useState('message');
  const [playingItem, setPlayingItem] = useState(null);

  const filteredChurches = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return approvedChurches;
    return approvedChurches.filter(
      (church) =>
        church.name.toLowerCase().includes(query) ||
        church.location.toLowerCase().includes(query) ||
        church.address.toLowerCase().includes(query)
    );
  }, [approvedChurches, search]);

  const selectedPosts = useMemo(() => {
    if (!selectedChurch) return [];
    return getChurchContentByChurch(selectedChurch.id, activeCategory);
  }, [selectedChurch, activeCategory, getChurchContentByChurch]);

  if (selectedChurch) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.paper }}>
        <View style={[styles.detailHeader, { paddingTop: insets.top + 12 }]}> 
          <TouchableOpacity onPress={() => setSelectedChurch(null)} style={styles.backBtn} activeOpacity={0.75}>
            <Ionicons name="arrow-back" size={22} color={colors.paper} />
          </TouchableOpacity>
          <Text style={styles.detailHeaderTitle}>Church Details</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.heroBox}>
            {isImageUrl(selectedChurch.image) ? (
              <Image source={{ uri: selectedChurch.image }} style={styles.heroChurchImage} />
            ) : (
              <Text style={styles.heroEmoji}>{selectedChurch.image || '⛪'}</Text>
            )}
            <Text style={styles.detailName}>{selectedChurch.name}</Text>
            <Text style={styles.detailLoc}>{selectedChurch.location}</Text>
            <Text style={styles.detailAbout}>{selectedChurch.about}</Text>
          </View>

          <View style={styles.detailContent}>
            <Text style={styles.sectionTitle}>Church Information</Text>
            {[
              { icon: 'location-outline', label: 'Address', value: selectedChurch.address },
              { icon: 'time-outline', label: 'Service Time', value: selectedChurch.timing },
              { icon: 'call-outline', label: 'Phone', value: selectedChurch.phone, action: `tel:${selectedChurch.phone}` },
              { icon: 'mail-outline', label: 'Email', value: selectedChurch.email, action: `mailto:${selectedChurch.email}` },
              { icon: 'person-outline', label: 'Church Admin', value: selectedChurch.adminName },
            ].map((row, index) => (
              <TouchableOpacity
                key={index}
                style={styles.detailRow}
                onPress={() => row.action && openLink(row.action)}
                activeOpacity={row.action ? 0.75 : 1}
              >
                <View style={styles.detailIcon}>
                  <Ionicons name={row.icon} size={18} color={colors.goldDeep} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailLabel}>{row.label}</Text>
                  <Text style={styles.detailValue}>{row.value || 'Not added'}</Text>
                </View>
                {!!row.action && <Ionicons name="chevron-forward" size={16} color={colors.inkFaint} />}
              </TouchableOpacity>
            ))}

            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Uploaded Items</Text>
            <View style={styles.categoryRow}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.key}
                  style={[styles.categoryBtn, activeCategory === category.key && styles.categoryBtnActive]}
                  onPress={() => setActiveCategory(category.key)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={category.icon}
                    size={15}
                    color={activeCategory === category.key ? colors.paper : colors.goldDeep}
                  />
                  <Text style={[styles.categoryText, activeCategory === category.key && styles.categoryTextActive]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedPosts.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons name="folder-open-outline" size={36} color={colors.inkFaint} />
                <Text style={styles.emptyTitle}>No {activeCategory}s uploaded</Text>
                <Text style={styles.emptyText}>Church admin uploads will appear here automatically.</Text>
              </View>
            ) : (
              selectedPosts.map((item) => (
                <ContentCard
                  key={item.id}
                  item={item}
                  onPlay={setPlayingItem}
                  getContentPreviewImage={getContentPreviewImage}
                />
              ))
            )}
          </View>
          <View style={{ height: insets.bottom + 24 }} />
        </ScrollView>

        <VideoModal visible={!!playingItem} item={playingItem} onClose={() => setPlayingItem(null)} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}> 
        <Text style={styles.headerTitle}>Churches</Text>
        <Text style={styles.headerSub}>Only admin-approved registered churches are shown here</Text>
      </View>

      <View style={styles.searchWrap}>
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={18} color={colors.inkFaint} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search church, city, or address..."
            placeholderTextColor={colors.inkFaint}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.inkFaint} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={styles.listWrap}>
          <Text style={styles.resultCount}>
            {filteredChurches.length} {filteredChurches.length === 1 ? 'registered church' : 'registered churches'} found
          </Text>

          {filteredChurches.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="business-outline" size={38} color={colors.inkFaint} />
              <Text style={styles.emptyTitle}>No Churches Found</Text>
              <Text style={styles.emptyText}>When admin approves church registrations, they will appear here.</Text>
            </View>
          ) : (
            filteredChurches.map((church) => {
              const messageCount = getChurchContentByChurch(church.id, 'message').length;
              const songCount = getChurchContentByChurch(church.id, 'song').length;
              const eventCount = getChurchContentByChurch(church.id, 'event').length;
              const churchImage = isImageUrl(church.image) ? church.image : '';

              return (
                <TouchableOpacity
                  key={church.id}
                  style={styles.churchCard}
                  onPress={() => {
                    setSelectedChurch(church);
                    setActiveCategory('message');
                  }}
                  activeOpacity={0.85}
                >
                  {churchImage ? (
                    <Image source={{ uri: churchImage }} style={styles.churchPreview} />
                  ) : (
                    <View style={styles.churchEmojiWrap}>
                      <Text style={styles.churchEmoji}>{church.image || '⛪'}</Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.churchName}>{church.name}</Text>
                    <View style={styles.churchMeta}>
                      <Ionicons name="location-outline" size={12} color={colors.inkFaint} />
                      <Text style={styles.churchLoc}>{church.location}</Text>
                    </View>
                    <View style={styles.countRow}>
                      <Text style={styles.countText}>{messageCount} Messages</Text>
                      <Text style={styles.dot}>•</Text>
                      <Text style={styles.countText}>{songCount} Songs</Text>
                      <Text style={styles.dot}>•</Text>
                      <Text style={styles.countText}>{eventCount} Events</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.inkFaint} />
                </TouchableOpacity>
              );
            })
          )}
        </View>
        <View style={{ height: insets.bottom + 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.ink,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: fonts.serif,
    color: colors.paper,
  },
  headerSub: {
    fontSize: 13,
    fontFamily: fonts.sans,
    color: colors.goldSoft,
    marginTop: 3,
    lineHeight: 18,
  },
  searchWrap: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 4,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink,
  },
  listWrap: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  resultCount: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.inkFaint,
    marginBottom: 12,
  },
  churchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 12,
  },
  churchEmojiWrap: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  churchPreview: {
    width: 72,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.goldSoft,
  },
  churchEmoji: {
    fontSize: 30,
  },
  churchName: {
    fontSize: 15,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
    marginBottom: 4,
  },
  churchMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  churchLoc: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.inkFaint,
  },
  countRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
  },
  countText: {
    fontSize: 11,
    fontFamily: fonts.sansMedium,
    color: colors.goldDeep,
  },
  dot: {
    fontSize: 11,
    color: colors.inkFaint,
  },
  detailHeader: {
    backgroundColor: colors.ink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailHeaderTitle: {
    fontSize: 16,
    fontFamily: fonts.sansSemiBold,
    color: colors.paper,
  },
  heroBox: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 22,
    backgroundColor: colors.ink,
  },
  heroEmoji: {
    fontSize: 58,
  },
  heroChurchImage: {
    width: '100%',
    height: 210,
    borderRadius: radii.xl,
    resizeMode: 'cover',
    marginBottom: 12,
  },
  detailName: {
    fontSize: 20,
    fontFamily: fonts.sansSemiBold,
    color: colors.paper,
    marginTop: 12,
    textAlign: 'center',
  },
  detailLoc: {
    fontSize: 13,
    fontFamily: fonts.sans,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 4,
  },
  detailAbout: {
    fontSize: 13,
    fontFamily: fonts.sans,
    color: colors.goldSoft,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 12,
  },
  detailContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    gap: 13,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 11,
    fontFamily: fonts.sans,
    color: colors.inkFaint,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: fonts.sansMedium,
    color: colors.ink,
    lineHeight: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  categoryBtn: {
    flex: 1,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  categoryBtnActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  categoryText: {
    fontSize: 11,
    fontFamily: fonts.sansSemiBold,
    color: colors.goldDeep,
  },
  categoryTextActive: {
    color: colors.paper,
  },
  contentCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 12,
  },
  mediaPreview: {
    height: 176,
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: colors.paper,
    marginBottom: 12,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  youtubeOverlay: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 50,
    height: 50,
    marginLeft: -25,
    marginTop: -25,
    borderRadius: 25,
    backgroundColor: 'rgba(230,57,70,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaTypeBadge: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    backgroundColor: 'rgba(0,0,0,0.62)',
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  mediaTypeText: {
    fontSize: 11,
    fontFamily: fonts.sansSemiBold,
    color: '#fff',
  },
  contentTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contentIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentTitle: {
    fontSize: 14,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
  },
  contentMeta: {
    fontSize: 11,
    fontFamily: fonts.sans,
    color: colors.inkFaint,
    marginTop: 2,
  },
  contentDescription: {
    fontSize: 13,
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    lineHeight: 19,
    marginTop: 10,
  },
  eventDateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F5E9',
    borderRadius: radii.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
  },
  eventDateText: {
    fontSize: 12,
    fontFamily: fonts.sansSemiBold,
    color: colors.sageDeep,
  },
  contentActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  smallActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.paper,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  smallActionText: {
    fontSize: 11,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
  },
  emptyBox: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.line,
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
    marginTop: 4,
  },
  videoModalSafe: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  videoCloseBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoTitle: {
    fontSize: 15,
    fontFamily: fonts.sansSemiBold,
    color: '#fff',
  },
  videoSub: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  playerWrap: {
    width: '100%',
    backgroundColor: '#000',
  },
  videoDetails: {
    padding: 18,
  },
  videoDetailTitle: {
    fontSize: 18,
    fontFamily: fonts.sansSemiBold,
    color: '#fff',
  },
  videoDetailMeta: {
    fontSize: 12,
    fontFamily: fonts.sansMedium,
    color: colors.goldSoft,
    marginTop: 5,
  },
  videoDetailDescription: {
    fontSize: 13,
    fontFamily: fonts.sans,
    color: 'rgba(255,255,255,0.78)',
    lineHeight: 20,
    marginTop: 14,
  },
});
