import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radii } from '../theme/theme';
import { useApp } from '../context/AppContext';

const formatTime = (value) => {
  if (!value) return 'Now';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Now';

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
};

export default function NotificationScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const {
    currentUserNotifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    clearMyNotifications,
  } = useApp();

  const handleOpen = async (item) => {
    await markNotificationRead(item.id);
    navigation.navigate(item.screen || 'Home');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <View style={[styles.headerBg, { paddingTop: insets.top + 14 }]}> 
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.75}
          >
            <Ionicons name="chevron-back" size={22} color={colors.paper} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.screenTitle}>Notifications</Text>
            <Text style={styles.screenSub}>Church updates and matrimony interests</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 36 }}
      >
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Ionicons name="notifications" size={22} color={colors.goldDeep} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryTitle}>{unreadNotificationCount} unread notifications</Text>
            <Text style={styles.summaryText}>{currentUserNotifications.length} total updates available</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={markAllNotificationsRead} activeOpacity={0.8}>
            <Ionicons name="checkmark-done-outline" size={15} color={colors.goldDeep} />
            <Text style={styles.actionText}>Mark all read</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={clearMyNotifications} activeOpacity={0.8}>
            <Ionicons name="trash-outline" size={15} color="#E63946" />
            <Text style={[styles.actionText, { color: '#E63946' }]}>Clear</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Recent Notifications</Text>

        {currentUserNotifications.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="notifications-off-outline" size={38} color={colors.inkFaint} />
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyText}>Matrimony interest requests and new church posts will appear here.</Text>
          </View>
        ) : (
          currentUserNotifications.map((item) => {
            const unread = !item.readAt;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.notificationCard, unread && styles.unreadCard]}
                activeOpacity={0.82}
                onPress={() => handleOpen(item)}
              >
                <View style={[styles.iconWrap, { backgroundColor: `${item.iconColor || colors.goldDeep}18` }]}> 
                  <Ionicons name={item.icon || 'notifications-outline'} size={21} color={item.iconColor || colors.goldDeep} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text style={styles.notificationTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
                  </View>
                  <Text style={styles.messageText} numberOfLines={2}>{item.message}</Text>
                </View>
                {unread ? <View style={styles.unreadDot} /> : <Ionicons name="chevron-forward" size={17} color={colors.inkFaint} />}
              </TouchableOpacity>
            );
          })
        )}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    fontSize: 22,
    fontFamily: fonts.serif,
    color: colors.paper,
  },
  screenSub: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.goldSoft,
    marginTop: 3,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 12,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  summaryTitle: {
    fontSize: 15,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
  },
  summaryText: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.inkFaint,
    marginTop: 3,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 12,
    fontFamily: fonts.sansSemiBold,
    color: colors.goldDeep,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
    marginBottom: 14,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 12,
  },
  unreadCard: {
    borderColor: colors.goldDeep,
    backgroundColor: '#FFFDF6',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  notificationTitle: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
  },
  timeText: {
    fontSize: 10,
    fontFamily: fonts.sansMedium,
    color: colors.inkFaint,
  },
  messageText: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    lineHeight: 18,
    marginTop: 4,
  },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#E63946',
    marginLeft: 8,
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
    marginTop: 4,
  },
});
