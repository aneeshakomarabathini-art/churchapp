// import React, { useMemo, useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { colors, fonts, radii } from '../theme/theme';
// import { useApp } from '../context/AppContext';

// const roleLabel = {
//   admin: 'Super Admin',
//   church_admin: 'Church Admin',
//   user: 'User',
// };

// const roleColor = {
//   admin: '#E63946',
//   church_admin: '#6366F1',
//   user: colors.goldDeep,
// };

// const formatDate = (value) => {
//   if (!value) return 'Recently';
//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return 'Recently';
//   return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
// };

// export default function AdminScreen() {
//   const insets = useSafeAreaInsets();
//   const {
//     currentUser,
//     signOut,
//     allAccounts = [],
//     churchAdminRequests = [],
//     approvedChurches = [],
//     matrimonyProfiles = [],
//     recentChurchPosts = [],
//     approveChurchAdmin,
//     rejectChurchAdmin,
//   } = useApp();

//   const [activeTab, setActiveTab] = useState('overview');
//   const [loggingOut, setLoggingOut] = useState(false);
//   const [actionLoadingId, setActionLoadingId] = useState(null);

//   const pendingChurches = useMemo(() => {
//     return churchAdminRequests.filter((item) => item.status === 'pending');
//   }, [churchAdminRequests]);

//   const stats = [
//     { label: 'Total Users', value: allAccounts.length, icon: 'people', color: '#6366F1' },
//     { label: 'Approved Churches', value: approvedChurches.length, icon: 'business', color: colors.goldDeep },
//     { label: 'Pending Requests', value: pendingChurches.length, icon: 'time', color: '#F59E0B' },
//     { label: 'Matrimony Profiles', value: matrimonyProfiles.length, icon: 'heart', color: '#E63946' },
//     { label: 'Church Posts', value: recentChurchPosts.length, icon: 'megaphone', color: '#52B788' },
//   ];

//   const handleSignOut = async () => {
//     if (loggingOut) return;
//     setLoggingOut(true);
//     try {
//       await signOut();
//     } catch (error) {
//       console.log('Logout error:', error);
//       Alert.alert('Logout Error', 'Something went wrong. Please try again.');
//     } finally {
//       setLoggingOut(false);
//     }
//   };

//   const handleApprove = async (church) => {
//     if (actionLoadingId) return;
//     setActionLoadingId(church.id);
//     try {
//       await approveChurchAdmin(church.id);
//       Alert.alert('Approved', `${church.churchName} is approved. It will now appear in the user Churches screen.`);
//     } catch (error) {
//       console.log('Approve error:', error);
//       Alert.alert('Approval Failed', error?.message || 'Something went wrong.');
//     } finally {
//       setActionLoadingId(null);
//     }
//   };

//   const handleReject = async (church) => {
//     if (actionLoadingId) return;
//     setActionLoadingId(church.id);
//     try {
//       await rejectChurchAdmin(church.id);
//       Alert.alert('Rejected', `${church.churchName} request rejected.`);
//     } catch (error) {
//       console.log('Reject error:', error);
//       Alert.alert('Reject Failed', error?.message || 'Something went wrong.');
//     } finally {
//       setActionLoadingId(null);
//     }
//   };

//   return (
//     <View style={{ flex: 1, backgroundColor: colors.paper }}>
//       <View style={[styles.header, { paddingTop: insets.top + 12 }]}> 
//         <View style={{ flex: 1 }}>
//           <Text style={styles.headerRole}>Admin Dashboard</Text>
//           <Text style={styles.headerName}>{currentUser?.name || 'Super Admin'}</Text>
//         </View>
//         <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn} disabled={loggingOut} activeOpacity={0.75}>
//           {loggingOut ? (
//             <ActivityIndicator size="small" color="#E63946" />
//           ) : (
//             <Ionicons name="log-out-outline" size={22} color="#E63946" />
//           )}
//         </TouchableOpacity>
//       </View>

//       <View style={styles.tabRow}>
//         {['overview', 'requests', 'churches', 'users'].map((tab) => (
//           <TouchableOpacity
//             key={tab}
//             style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
//             onPress={() => setActiveTab(tab)}
//             activeOpacity={0.75}
//           >
//             <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
//         {activeTab === 'overview' && (
//           <View style={styles.content}>
//             <Text style={styles.sectionTitle}>App Overview</Text>
//             <View style={styles.statsGrid}>
//               {stats.map((item) => (
//                 <View key={item.label} style={styles.statCard}>
//                   <View style={[styles.statIcon, { backgroundColor: `${item.color}18` }]}> 
//                     <Ionicons name={item.icon} size={22} color={item.color} />
//                   </View>
//                   <Text style={styles.statValue}>{item.value}</Text>
//                   <Text style={styles.statLabel}>{item.label}</Text>
//                 </View>
//               ))}
//             </View>

//             <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Pending Church Requests</Text>
//             {pendingChurches.length === 0 ? (
//               <EmptyCard icon="checkmark-circle-outline" title="No Pending Requests" text="Church admin registrations will appear here for approval." />
//             ) : (
//               pendingChurches.slice(0, 2).map((church) => <RequestCard key={church.id} church={church} loading={actionLoadingId === church.id} onApprove={handleApprove} onReject={handleReject} />)
//             )}
//           </View>
//         )}

//         {activeTab === 'requests' && (
//           <View style={styles.content}>
//             <Text style={styles.sectionTitle}>Church Admin Approval Requests</Text>
//             {pendingChurches.length === 0 ? (
//               <EmptyCard icon="checkmark-circle-outline" title="All Caught Up" text="No pending church admin registrations." />
//             ) : (
//               pendingChurches.map((church) => <RequestCard key={church.id} church={church} loading={actionLoadingId === church.id} onApprove={handleApprove} onReject={handleReject} />)
//             )}
//           </View>
//         )}

//         {activeTab === 'churches' && (
//           <View style={styles.content}>
//             <Text style={styles.sectionTitle}>Approved Registered Churches</Text>
//             {approvedChurches.length === 0 ? (
//               <EmptyCard icon="business-outline" title="No Churches" text="Approved churches will appear here and on user Church screen." />
//             ) : (
//               approvedChurches.map((church) => (
//                 <View key={church.id} style={styles.churchCard}>
//                   <Text style={styles.churchEmoji}>{church.image}</Text>
//                   <View style={{ flex: 1 }}>
//                     <Text style={styles.churchName}>{church.name}</Text>
//                     <Text style={styles.churchLoc}>{church.location}</Text>
//                     <Text style={styles.churchMembers}>{church.adminName} • {church.phone || 'No phone'}</Text>
//                   </View>
//                   <View style={styles.activeBadge}>
//                     <Text style={styles.activeBadgeText}>Active</Text>
//                   </View>
//                 </View>
//               ))
//             )}
//           </View>
//         )}

//         {activeTab === 'users' && (
//           <View style={styles.content}>
//             <Text style={styles.sectionTitle}>User Management</Text>
//             {allAccounts.map((user) => {
//               const color = roleColor[user.role] || colors.goldDeep;
//               return (
//                 <View key={user.id} style={styles.userRow}>
//                   <View style={[styles.userAvatar, { backgroundColor: `${color}18` }]}> 
//                     <Text style={[styles.userAvatarText, { color }]}>{user.name?.charAt(0)?.toUpperCase() || '?'}</Text>
//                   </View>
//                   <View style={{ flex: 1 }}>
//                     <Text style={styles.userName}>{user.name}</Text>
//                     <Text style={styles.userEmail}>{user.email}</Text>
//                   </View>
//                   <View style={{ alignItems: 'flex-end' }}>
//                     <View style={[styles.userRoleBadge, { backgroundColor: `${color}18` }]}> 
//                       <Text style={[styles.userRole, { color }]}>{roleLabel[user.role] || 'User'}</Text>
//                     </View>
//                     <Text style={styles.userJoined}>{formatDate(user.createdAt)}</Text>
//                   </View>
//                 </View>
//               );
//             })}
//           </View>
//         )}

//         <View style={{ height: insets.bottom + 24 }} />
//       </ScrollView>
//     </View>
//   );
// }

// function RequestCard({ church, loading, onApprove, onReject }) {
//   return (
//     <View style={styles.pendingCard}>
//       <View style={styles.pendingTop}>
//         <View style={styles.pendingIcon}>
//           <Ionicons name="business-outline" size={20} color={colors.goldDeep} />
//         </View>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.pendingName}>{church.churchName}</Text>
//           <Text style={styles.pendingLoc}>{church.churchLocation}</Text>
//         </View>
//         <View style={styles.pendingBadge}>
//           <Text style={styles.pendingBadgeText}>Pending</Text>
//         </View>
//       </View>

//       <View style={styles.requestInfoBox}>
//         <InfoLine icon="person-outline" label="Admin" value={church.name} />
//         <InfoLine icon="mail-outline" label="Email" value={church.email} />
//         <InfoLine icon="call-outline" label="Phone" value={church.phone} />
//         <InfoLine icon="map-outline" label="Address" value={church.churchAddress} />
//       </View>

//       <View style={styles.actionRow}>
//         <TouchableOpacity style={[styles.approveBtn, loading && { opacity: 0.7 }]} onPress={() => onApprove(church)} disabled={loading} activeOpacity={0.75}>
//           {loading ? (
//             <ActivityIndicator size="small" color="#fff" />
//           ) : (
//             <>
//               <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
//               <Text style={styles.approveBtnText}>Approve</Text>
//             </>
//           )}
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.rejectBtn, loading && { opacity: 0.7 }]} onPress={() => onReject(church)} disabled={loading} activeOpacity={0.75}>
//           <Ionicons name="close-circle-outline" size={16} color="#E63946" />
//           <Text style={styles.rejectBtnText}>Reject</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// function InfoLine({ icon, label, value }) {
//   return (
//     <View style={styles.infoLine}>
//       <Ionicons name={icon} size={14} color={colors.goldDeep} />
//       <Text style={styles.infoLabel}>{label}</Text>
//       <Text style={styles.infoValue}>{value || 'Not added'}</Text>
//     </View>
//   );
// }

// function EmptyCard({ icon, title, text }) {
//   return (
//     <View style={styles.emptyCard}>
//       <Ionicons name={icon} size={34} color={colors.inkFaint} />
//       <Text style={styles.emptyTitle}>{title}</Text>
//       <Text style={styles.emptyText}>{text}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingBottom: 14,
//     backgroundColor: colors.ink,
//   },
//   headerRole: {
//     fontSize: 12,
//     fontFamily: fonts.sans,
//     color: colors.goldSoft,
//     letterSpacing: 0.5,
//   },
//   headerName: {
//     fontSize: 18,
//     fontFamily: fonts.sansSemiBold,
//     color: '#fff',
//     marginTop: 2,
//   },
//   signOutBtn: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   tabRow: {
//     flexDirection: 'row',
//     backgroundColor: colors.surface,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.line,
//   },
//   tabBtn: {
//     flex: 1,
//     paddingVertical: 13,
//     alignItems: 'center',
//   },
//   tabBtnActive: {
//     borderBottomWidth: 2,
//     borderBottomColor: colors.goldDeep,
//   },
//   tabBtnText: {
//     fontFamily: fonts.sansMedium,
//     fontSize: 12,
//     color: colors.inkFaint,
//   },
//   tabBtnTextActive: {
//     color: colors.goldDeep,
//     fontFamily: fonts.sansSemiBold,
//   },
//   content: {
//     padding: 20,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontFamily: fonts.sansSemiBold,
//     color: colors.ink,
//     marginBottom: 14,
//   },
//   statsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//   },
//   statCard: {
//     width: '47%',
//     backgroundColor: colors.surface,
//     borderRadius: radii.md,
//     padding: 16,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: colors.line,
//   },
//   statIcon: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 8,
//   },
//   statValue: {
//     fontSize: 20,
//     fontFamily: fonts.sansSemiBold,
//     color: colors.ink,
//   },
//   statLabel: {
//     fontSize: 11,
//     fontFamily: fonts.sans,
//     color: colors.inkFaint,
//     marginTop: 2,
//     textAlign: 'center',
//   },
//   pendingCard: {
//     backgroundColor: colors.surface,
//     borderRadius: radii.xl,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: colors.line,
//     marginBottom: 12,
//   },
//   pendingTop: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   pendingIcon: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: colors.goldSoft,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   pendingName: {
//     fontSize: 14,
//     fontFamily: fonts.sansSemiBold,
//     color: colors.ink,
//   },
//   pendingLoc: {
//     fontSize: 12,
//     fontFamily: fonts.sans,
//     color: colors.inkFaint,
//     marginTop: 2,
//   },
//   pendingBadge: {
//     backgroundColor: '#FFF7E6',
//     borderRadius: radii.pill,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//   },
//   pendingBadgeText: {
//     fontSize: 11,
//     fontFamily: fonts.sansSemiBold,
//     color: '#F59E0B',
//   },
//   requestInfoBox: {
//     backgroundColor: colors.paper,
//     borderRadius: radii.md,
//     padding: 12,
//     marginTop: 12,
//     gap: 8,
//   },
//   infoLine: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 7,
//   },
//   infoLabel: {
//     width: 58,
//     fontSize: 11,
//     fontFamily: fonts.sansSemiBold,
//     color: colors.inkFaint,
//   },
//   infoValue: {
//     flex: 1,
//     fontSize: 12,
//     fontFamily: fonts.sansMedium,
//     color: colors.ink,
//   },
//   actionRow: {
//     flexDirection: 'row',
//     gap: 10,
//     marginTop: 12,
//   },
//   approveBtn: {
//     flex: 1,
//     backgroundColor: '#52B788',
//     borderRadius: radii.md,
//     paddingVertical: 11,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     gap: 6,
//   },
//   approveBtnText: {
//     color: '#fff',
//     fontFamily: fonts.sansSemiBold,
//     fontSize: 12,
//   },
//   rejectBtn: {
//     flex: 1,
//     backgroundColor: '#FDECEA',
//     borderRadius: radii.md,
//     paddingVertical: 11,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     gap: 6,
//   },
//   rejectBtnText: {
//     color: '#E63946',
//     fontFamily: fonts.sansSemiBold,
//     fontSize: 12,
//   },
//   churchCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: colors.surface,
//     borderRadius: radii.md,
//     padding: 14,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: colors.line,
//     gap: 12,
//   },
//   churchEmoji: {
//     fontSize: 28,
//   },
//   churchName: {
//     fontFamily: fonts.sansSemiBold,
//     fontSize: 14,
//     color: colors.ink,
//   },
//   churchLoc: {
//     fontFamily: fonts.sans,
//     fontSize: 12,
//     color: colors.inkFaint,
//     marginTop: 2,
//   },
//   churchMembers: {
//     fontFamily: fonts.sans,
//     fontSize: 11,
//     color: colors.goldDeep,
//     marginTop: 2,
//   },
//   activeBadge: {
//     backgroundColor: '#E8F5E9',
//     borderRadius: radii.pill,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//   },
//   activeBadgeText: {
//     color: '#52B788',
//     fontFamily: fonts.sansSemiBold,
//     fontSize: 11,
//   },
//   userRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.line,
//     gap: 12,
//   },
//   userAvatar: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   userAvatarText: {
//     fontFamily: fonts.sansSemiBold,
//     fontSize: 16,
//   },
//   userName: {
//     fontFamily: fonts.sansSemiBold,
//     fontSize: 14,
//     color: colors.ink,
//   },
//   userEmail: {
//     fontFamily: fonts.sans,
//     fontSize: 12,
//     color: colors.inkFaint,
//     marginTop: 1,
//   },
//   userRoleBadge: {
//     borderRadius: radii.pill,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//   },
//   userRole: {
//     fontFamily: fonts.sansSemiBold,
//     fontSize: 10,
//     textAlign: 'right',
//   },
//   userJoined: {
//     fontFamily: fonts.sans,
//     fontSize: 10,
//     color: colors.inkFaint,
//     textAlign: 'right',
//     marginTop: 3,
//   },
//   emptyCard: {
//     backgroundColor: colors.surface,
//     borderRadius: radii.xl,
//     padding: 22,
//     borderWidth: 1,
//     borderColor: colors.line,
//     alignItems: 'center',
//   },
//   emptyTitle: {
//     fontSize: 15,
//     fontFamily: fonts.sansSemiBold,
//     color: colors.ink,
//     marginTop: 10,
//   },
//   emptyText: {
//     fontSize: 12,
//     fontFamily: fonts.sans,
//     color: colors.inkFaint,
//     textAlign: 'center',
//     marginTop: 4,
//     lineHeight: 18,
//   },
// });































import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radii } from '../theme/theme';
import { useApp } from '../context/AppContext';

const roleLabel = {
  admin: 'Super Admin',
  church_admin: 'Church Admin',
  user: 'User',
};

const roleColor = {
  admin: '#E63946',
  church_admin: '#6366F1',
  user: colors.goldDeep,
};

const isImageUrl = (value = '') =>
  /^https?:\/\//i.test(String(value || '')) || String(value || '').startsWith('file:');

const formatDate = (value) => {
  if (!value) return 'Recently';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently';
  return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const {
    currentUser,
    signOut,
    allAccounts = [],
    churchAdminRequests = [],
    approvedChurches = [],
    matrimonyProfiles = [],
    recentChurchPosts = [],
    approveChurchAdmin,
    rejectChurchAdmin,
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview');
  const [loggingOut, setLoggingOut] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const pendingChurches = useMemo(() => {
    return churchAdminRequests.filter((item) => item.status === 'pending');
  }, [churchAdminRequests]);

  const stats = [
    { label: 'Total Users', value: allAccounts.length, icon: 'people', color: '#6366F1' },
    { label: 'Approved Churches', value: approvedChurches.length, icon: 'business', color: colors.goldDeep },
    { label: 'Pending Requests', value: pendingChurches.length, icon: 'time', color: '#F59E0B' },
    { label: 'Matrimony Profiles', value: matrimonyProfiles.length, icon: 'heart', color: '#E63946' },
    { label: 'Church Posts', value: recentChurchPosts.length, icon: 'megaphone', color: '#52B788' },
  ];

  const handleSignOut = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await signOut();
    } catch (error) {
      console.log('Logout error:', error);
      Alert.alert('Logout Error', 'Something went wrong. Please try again.');
    } finally {
      setLoggingOut(false);
    }
  };

  const handleApprove = async (church) => {
    if (actionLoadingId) return;
    setActionLoadingId(church.id);
    try {
      await approveChurchAdmin(church.id);
      Alert.alert('Approved', `${church.churchName} is approved. It will now appear in the user Churches screen.`);
    } catch (error) {
      console.log('Approve error:', error);
      Alert.alert('Approval Failed', error?.message || 'Something went wrong.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (church) => {
    if (actionLoadingId) return;
    setActionLoadingId(church.id);
    try {
      await rejectChurchAdmin(church.id);
      Alert.alert('Rejected', `${church.churchName} request rejected.`);
    } catch (error) {
      console.log('Reject error:', error);
      Alert.alert('Reject Failed', error?.message || 'Something went wrong.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}> 
        <View style={{ flex: 1 }}>
          <Text style={styles.headerRole}>Admin Dashboard</Text>
          <Text style={styles.headerName}>{currentUser?.name || 'Super Admin'}</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn} disabled={loggingOut} activeOpacity={0.75}>
          {loggingOut ? (
            <ActivityIndicator size="small" color="#E63946" />
          ) : (
            <Ionicons name="log-out-outline" size={22} color="#E63946" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        {['overview', 'requests', 'churches', 'users'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.75}
          >
            <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {activeTab === 'overview' && (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>App Overview</Text>
            <View style={styles.statsGrid}>
              {stats.map((item) => (
                <View key={item.label} style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: `${item.color}18` }]}> 
                    <Ionicons name={item.icon} size={22} color={item.color} />
                  </View>
                  <Text style={styles.statValue}>{item.value}</Text>
                  <Text style={styles.statLabel}>{item.label}</Text>
                </View>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Pending Church Requests</Text>
            {pendingChurches.length === 0 ? (
              <EmptyCard icon="checkmark-circle-outline" title="No Pending Requests" text="Church admin registrations will appear here for approval." />
            ) : (
              pendingChurches.slice(0, 2).map((church) => <RequestCard key={church.id} church={church} loading={actionLoadingId === church.id} onApprove={handleApprove} onReject={handleReject} />)
            )}
          </View>
        )}

        {activeTab === 'requests' && (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Church Admin Approval Requests</Text>
            {pendingChurches.length === 0 ? (
              <EmptyCard icon="checkmark-circle-outline" title="All Caught Up" text="No pending church admin registrations." />
            ) : (
              pendingChurches.map((church) => <RequestCard key={church.id} church={church} loading={actionLoadingId === church.id} onApprove={handleApprove} onReject={handleReject} />)
            )}
          </View>
        )}

        {activeTab === 'churches' && (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Approved Registered Churches</Text>
            {approvedChurches.length === 0 ? (
              <EmptyCard icon="business-outline" title="No Churches" text="Approved churches will appear here and on user Church screen." />
            ) : (
              approvedChurches.map((church) => (
                <View key={church.id} style={styles.churchCard}>
                  {isImageUrl(church.image) ? (
                    <Image source={{ uri: church.image }} style={styles.churchThumb} />
                  ) : (
                    <View style={styles.churchEmojiWrap}>
                      <Text style={styles.churchEmoji}>{church.image || '⛪'}</Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.churchName}>{church.name}</Text>
                    <Text style={styles.churchLoc}>{church.location}</Text>
                    <Text style={styles.churchMembers}>{church.adminName} • {church.phone || 'No phone'}</Text>
                  </View>
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>Active</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'users' && (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>User Management</Text>
            {allAccounts.map((user) => {
              const color = roleColor[user.role] || colors.goldDeep;
              return (
                <View key={user.id} style={styles.userRow}>
                  <View style={[styles.userAvatar, { backgroundColor: `${color}18` }]}> 
                    <Text style={[styles.userAvatarText, { color }]}>{user.name?.charAt(0)?.toUpperCase() || '?'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <View style={[styles.userRoleBadge, { backgroundColor: `${color}18` }]}> 
                      <Text style={[styles.userRole, { color }]}>{roleLabel[user.role] || 'User'}</Text>
                    </View>
                    <Text style={styles.userJoined}>{formatDate(user.createdAt)}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={{ height: insets.bottom + 24 }} />
      </ScrollView>
    </View>
  );
}

function RequestCard({ church, loading, onApprove, onReject }) {
  return (
    <View style={styles.pendingCard}>
      <View style={styles.pendingTop}>
        <View style={styles.pendingIcon}>
          <Ionicons name="business-outline" size={20} color={colors.goldDeep} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.pendingName}>{church.churchName}</Text>
          <Text style={styles.pendingLoc}>{church.churchLocation}</Text>
        </View>
        <View style={styles.pendingBadge}>
          <Text style={styles.pendingBadgeText}>Pending</Text>
        </View>
      </View>

      <View style={styles.requestInfoBox}>
        <InfoLine icon="person-outline" label="Admin" value={church.name} />
        <InfoLine icon="mail-outline" label="Email" value={church.email} />
        <InfoLine icon="call-outline" label="Phone" value={church.phone} />
        <InfoLine icon="map-outline" label="Address" value={church.churchAddress} />
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.approveBtn, loading && { opacity: 0.7 }]} onPress={() => onApprove(church)} disabled={loading} activeOpacity={0.75}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
              <Text style={styles.approveBtnText}>Approve</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.rejectBtn, loading && { opacity: 0.7 }]} onPress={() => onReject(church)} disabled={loading} activeOpacity={0.75}>
          <Ionicons name="close-circle-outline" size={16} color="#E63946" />
          <Text style={styles.rejectBtnText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function InfoLine({ icon, label, value }) {
  return (
    <View style={styles.infoLine}>
      <Ionicons name={icon} size={14} color={colors.goldDeep} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || 'Not added'}</Text>
    </View>
  );
}

function EmptyCard({ icon, title, text }) {
  return (
    <View style={styles.emptyCard}>
      <Ionicons name={icon} size={34} color={colors.inkFaint} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: colors.ink,
  },
  headerRole: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.goldSoft,
    letterSpacing: 0.5,
  },
  headerName: {
    fontSize: 18,
    fontFamily: fonts.sansSemiBold,
    color: '#fff',
    marginTop: 2,
  },
  signOutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 13,
    alignItems: 'center',
  },
  tabBtnActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.goldDeep,
  },
  tabBtnText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.inkFaint,
  },
  tabBtnTextActive: {
    color: colors.goldDeep,
    fontFamily: fonts.sansSemiBold,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
    marginBottom: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: fonts.sans,
    color: colors.inkFaint,
    marginTop: 2,
    textAlign: 'center',
  },
  pendingCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 12,
  },
  pendingTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pendingIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingName: {
    fontSize: 14,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
  },
  pendingLoc: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.inkFaint,
    marginTop: 2,
  },
  pendingBadge: {
    backgroundColor: '#FFF7E6',
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pendingBadgeText: {
    fontSize: 11,
    fontFamily: fonts.sansSemiBold,
    color: '#F59E0B',
  },
  requestInfoBox: {
    backgroundColor: colors.paper,
    borderRadius: radii.md,
    padding: 12,
    marginTop: 12,
    gap: 8,
  },
  infoLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  infoLabel: {
    width: 58,
    fontSize: 11,
    fontFamily: fonts.sansSemiBold,
    color: colors.inkFaint,
  },
  infoValue: {
    flex: 1,
    fontSize: 12,
    fontFamily: fonts.sansMedium,
    color: colors.ink,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  approveBtn: {
    flex: 1,
    backgroundColor: '#52B788',
    borderRadius: radii.md,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  approveBtnText: {
    color: '#fff',
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: '#FDECEA',
    borderRadius: radii.md,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  rejectBtnText: {
    color: '#E63946',
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
  },
  churchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 12,
  },
  churchThumb: {
    width: 44,
    height: 44,
    borderRadius: radii.sm,
    marginRight: 12,
    backgroundColor: colors.line,
  },
  churchEmojiWrap: {
    width: 44,
    height: 44,
    borderRadius: radii.sm,
    backgroundColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  churchEmoji: {
    fontSize: 22,
    maxWidth: 44,
  },
  churchName: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.ink,
  },
  churchLoc: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.inkFaint,
    marginTop: 2,
  },
  churchMembers: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.goldDeep,
    marginTop: 2,
  },
  activeBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activeBadgeText: {
    color: '#52B788',
    fontFamily: fonts.sansSemiBold,
    fontSize: 11,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    gap: 12,
  },
  userAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
  },
  userName: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.ink,
  },
  userEmail: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.inkFaint,
    marginTop: 1,
  },
  userRoleBadge: {
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  userRole: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 10,
    textAlign: 'right',
  },
  userJoined: {
    fontFamily: fonts.sans,
    fontSize: 10,
    color: colors.inkFaint,
    textAlign: 'right',
    marginTop: 3,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: 22,
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
    marginTop: 4,
    lineHeight: 18,
  },
});