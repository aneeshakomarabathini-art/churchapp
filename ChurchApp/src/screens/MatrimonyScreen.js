import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radii } from '../theme/theme';
import { useApp } from '../context/AppContext';

const emptyForm = {
  name: '',
  age: '',
  gender: 'Bride',
  location: '',
  denomination: '',
  occupation: '',
  education: '',
  photoUri: '',
  familyDetails: '',
  phone: '',
  email: '',
};

function ProfilePhoto({ profile, size = 58 }) {
  const hasPhoto = !!profile?.photoUri;
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}> 
      {hasPhoto ? (
        <Image source={{ uri: profile.photoUri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <Text style={[styles.avatarText, { fontSize: size > 80 ? 42 : 22 }]}>
          {profile?.avatar || profile?.name?.charAt(0)?.toUpperCase() || '?'}
        </Text>
      )}
    </View>
  );
}

export default function MatrimonyScreen() {
  const insets = useSafeAreaInsets();
  const {
    currentUser,
    matrimonyProfiles,
    addOrUpdateMatrimonyProfile,
    sendMatrimonyInterest,
    acceptMatrimonyInterest,
    getMyReceivedMatrimonyRequests,
    getMyMatrimonyProfile,
    hasSentInterest,
    hasReceivedInterest,
    isMutualInterest,
    canViewMatrimonyContact,
  } = useApp();

  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [interestLoadingId, setInterestLoadingId] = useState(null);

  const myProfile = getMyMatrimonyProfile();
  const receivedRequests = getMyReceivedMatrimonyRequests().filter((item) => !item.accepted);
  const visibleProfiles = useMemo(() => {
    return matrimonyProfiles.filter((profile) => profile.userId !== currentUser?.id);
  }, [matrimonyProfiles, currentUser]);

  const fillProfileForm = () => {
    const source = myProfile || {
      ...emptyForm,
      name: currentUser?.name || '',
      phone: currentUser?.phone || '',
      email: currentUser?.email || '',
    };

    setForm({
      name: source.name || '',
      age: String(source.age || ''),
      gender: source.gender || 'Bride',
      location: source.location || '',
      denomination: source.denomination || '',
      occupation: source.occupation || '',
      education: source.education || '',
      photoUri: source.photoUri || '',
      familyDetails: source.familyDetails || source.bio || '',
      phone: source.phone || '',
      email: source.email || '',
    });
    setProfileModalVisible(true);
  };

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const pickPhoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Needed', 'Please allow photo access to select profile photo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.75,
      });

      if (result.canceled || result.cancelled) return;
      const asset = result.assets?.[0] || result;
      if (asset?.uri) updateForm('photoUri', asset.uri);
    } catch (error) {
      console.log('Image picker error:', error);
      Alert.alert('Photo Error', 'Unable to select photo. Please try again.');
    }
  };

  const submitProfile = async () => {
    if (saving) return;

    const requiredFields = [
      'photoUri',
      'name',
      'age',
      'gender',
      'location',
      'denomination',
      'occupation',
      'education',
      'phone',
      'email',
      'familyDetails',
    ];

    const missing = requiredFields.find((field) => !String(form[field] || '').trim());

    if (missing) {
      Alert.alert('Fill the Details', 'Please fill all the details before saving your matrimony profile.');
      return;
    }

    const ageNumber = Number(form.age);
    if (!Number.isFinite(ageNumber) || ageNumber < 18) {
      Alert.alert('Fill the Details', 'Please enter a valid age. Age must be 18 or above.');
      return;
    }

    const emailValue = String(form.email || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      Alert.alert('Fill the Details', 'Please enter a valid email address.');
      return;
    }

    setSaving(true);
    try {
      await addOrUpdateMatrimonyProfile(form);
      setProfileModalVisible(false);
      Alert.alert('Profile Saved', 'Your matrimony profile is now visible to all users.');
    } catch (error) {
      console.log('Save matrimony profile error:', error);
      Alert.alert('Save Failed', error?.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const openDetails = (profile) => {
    setSelectedProfile(profile);
    setDetailModalVisible(true);
  };

  const handleInterest = async (profile) => {
    if (!myProfile) {
      Alert.alert(
        'Create Profile First',
        'Please create your matrimony profile before sending or accepting interest.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add Profile', onPress: fillProfileForm },
        ]
      );
      return;
    }

    if (interestLoadingId) return;
    setInterestLoadingId(profile.id);
    try {
      const accepting = hasReceivedInterest(profile.userId) && !hasSentInterest(profile.userId);
      if (accepting) {
        await acceptMatrimonyInterest(profile.userId);
      } else {
        await sendMatrimonyInterest(profile.userId);
      }
      Alert.alert(
        accepting ? 'Interest Accepted' : 'Interest Sent',
        accepting
          ? 'Both users are interested. Contact details are now unlocked for both profiles.'
          : 'Your interest was sent. The other user will receive a notification.'
      );
    } catch (error) {
      console.log('Interest error:', error);
      Alert.alert('Interest Failed', error?.message || 'Something went wrong.');
    } finally {
      setInterestLoadingId(null);
    }
  };

  const renderActionText = (profile) => {
    if (!myProfile) return 'Create Profile First';
    if (isMutualInterest(profile.userId)) return 'Contact Unlocked';
    if (hasSentInterest(profile.userId)) return 'Interest Sent';
    if (hasReceivedInterest(profile.userId)) return 'Accept Interest';
    return 'Send Interest';
  };

  const renderActionIcon = (profile) => {
    if (!myProfile) return 'person-add-outline';
    if (isMutualInterest(profile.userId)) return 'checkmark-circle-outline';
    if (hasSentInterest(profile.userId)) return 'time-outline';
    if (hasReceivedInterest(profile.userId)) return 'heart';
    return 'heart-outline';
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}> 
        <View>
          <Text style={styles.title}>Matrimony</Text>
          <Text style={styles.subtitle}>Create your profile and connect after mutual interest</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.addProfileCard} onPress={fillProfileForm} activeOpacity={0.85}>
            <View style={styles.addIconBox}>
              <Ionicons name={myProfile ? 'create-outline' : 'person-add-outline'} size={24} color={colors.goldDeep} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.addTitle}>{myProfile ? 'Update Your Profile' : 'Add Your Profile'}</Text>
              <Text style={styles.addText}>
                {myProfile
                  ? 'Your profile is visible to users. Update details anytime.'
                  : 'Create your profile so other users can view your basic details.'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.inkFaint} />
          </TouchableOpacity>

          {myProfile && (
            <View style={styles.myProfileBox}>
              <Text style={styles.sectionTitle}>My Profile</Text>
              <View style={styles.myProfileRow}>
                <ProfilePhoto profile={myProfile} size={54} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.profileName}>{myProfile.name}</Text>
                  <Text style={styles.profileSub}>{myProfile.age} yrs • {myProfile.gender} • {myProfile.location}</Text>
                  <Text style={styles.profileOcc}>{myProfile.occupation}</Text>
                </View>
              </View>
            </View>
          )}

          {!myProfile && (
            <View style={styles.profileRequiredBox}>
              <Ionicons name="lock-closed-outline" size={22} color={colors.goldDeep} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.profileRequiredTitle}>Profile required for interests</Text>
                <Text style={styles.profileRequiredText}>You can view basic details, but you must add your profile before sending or accepting interest.</Text>
              </View>
            </View>
          )}

          {receivedRequests.length > 0 && (
            <View style={styles.requestsBox}>
              <View style={styles.requestsHeader}>
                <Text style={styles.sectionTitle}>Interest Requests</Text>
                <View style={styles.requestCountBadge}>
                  <Text style={styles.requestCountText}>{receivedRequests.length}</Text>
                </View>
              </View>

              {receivedRequests.map((request) => (
                <View key={request.id} style={styles.requestCard}>
                  <ProfilePhoto profile={request.profile} size={48} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.requestName}>{request.profile.name}</Text>
                    <Text style={styles.requestText}>Sent interest to your profile</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.acceptSmallBtn}
                    onPress={() => handleInterest(request.profile)}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="heart" size={14} color="#fff" />
                    <Text style={styles.acceptSmallText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>All Profiles</Text>

          {visibleProfiles.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="people-outline" size={38} color={colors.inkFaint} />
              <Text style={styles.emptyTitle}>No profiles yet</Text>
              <Text style={styles.emptyText}>When users create matrimony profiles, they will appear here.</Text>
            </View>
          ) : (
            visibleProfiles.map((profile) => {
              const mutual = isMutualInterest(profile.userId);
              const sent = hasSentInterest(profile.userId);
              const loading = interestLoadingId === profile.id;

              return (
                <TouchableOpacity key={profile.id} style={styles.profileCard} onPress={() => openDetails(profile)} activeOpacity={0.9}>
                  <View style={styles.profileHeader}>
                    <ProfilePhoto profile={profile} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.profileName}>{profile.name}</Text>
                      <Text style={styles.profileSub}>{profile.age} yrs • {profile.gender} • {profile.location}</Text>
                      <Text style={styles.profileDenom}>{profile.denomination}</Text>
                    </View>
                    <View style={[styles.contactBadge, mutual && styles.contactBadgeUnlocked]}>
                      <Ionicons
                        name={mutual ? 'lock-open-outline' : 'lock-closed-outline'}
                        size={13}
                        color={mutual ? '#52B788' : colors.inkFaint}
                      />
                    </View>
                  </View>

                  <Text style={styles.profileBio} numberOfLines={2}>{profile.familyDetails || profile.bio}</Text>

                  <View style={styles.footerRow}>
                    <View style={styles.occupationBadge}>
                      <Ionicons name="briefcase" size={12} color={colors.goldDeep} />
                      <Text style={styles.occupationText}>{profile.occupation}</Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.interestBtn, (sent || mutual) && styles.interestBtnDone]}
                      onPress={() => {
                        if (!myProfile) {
                          fillProfileForm();
                          return;
                        }
                        if (!mutual && !sent) {
                          handleInterest(profile);
                        } else {
                          openDetails(profile);
                        }
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color={colors.paper} />
                      ) : (
                        <>
                          <Ionicons name={renderActionIcon(profile)} size={14} color={colors.paper} />
                          <Text style={styles.interestBtnText}>{renderActionText(profile)}</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
        <View style={{ height: insets.bottom + 24 }} />
      </ScrollView>

      <Modal visible={profileModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
              <Ionicons name="close" size={24} color={colors.ink} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{myProfile ? 'Update Profile' : 'Add Profile'}</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.photoPicker} onPress={pickPhoto} activeOpacity={0.8}>
              {form.photoUri ? (
                <Image source={{ uri: form.photoUri }} style={styles.formPhoto} />
              ) : (
                <View style={styles.formPhotoEmpty}>
                  <Ionicons name="camera-outline" size={28} color={colors.goldDeep} />
                </View>
              )}
              <Text style={styles.photoText}>Choose Profile Photo</Text>
            </TouchableOpacity>

            <Input label="Full Name" value={form.name} onChangeText={(text) => updateForm('name', text)} placeholder="Enter name" />
            <Input label="Age" value={form.age} onChangeText={(text) => updateForm('age', text)} placeholder="Enter age" keyboardType="number-pad" />

            <Text style={styles.inputLabel}>Gender</Text>
            <View style={styles.genderRow}>
              {['Bride', 'Groom'].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[styles.genderBtn, form.gender === gender && styles.genderBtnActive]}
                  onPress={() => updateForm('gender', gender)}
                >
                  <Text style={[styles.genderText, form.gender === gender && styles.genderTextActive]}>{gender}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input label="Location" value={form.location} onChangeText={(text) => updateForm('location', text)} placeholder="City / State" />
            <Input label="Denomination" value={form.denomination} onChangeText={(text) => updateForm('denomination', text)} placeholder="Pentecostal / Baptist / Methodist" />
            <Input label="Occupation" value={form.occupation} onChangeText={(text) => updateForm('occupation', text)} placeholder="Job / Work" />
            <Input label="Education" value={form.education} onChangeText={(text) => updateForm('education', text)} placeholder="Education details" />
            <Input label="Phone" value={form.phone} onChangeText={(text) => updateForm('phone', text)} placeholder="Contact number" keyboardType="phone-pad" />
            <Input label="Email" value={form.email} onChangeText={(text) => updateForm('email', text)} placeholder="Email address" keyboardType="email-address" autoCapitalize="none" />

            <Text style={styles.inputLabel}>Family Details</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={form.familyDetails}
              onChangeText={(text) => updateForm('familyDetails', text)}
              placeholder="Write family details, parents, siblings, background and expectations..."
              placeholderTextColor={colors.inkFaint}
              multiline
              textAlignVertical="top"
            />

            <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.7 }]} onPress={submitProfile} disabled={saving}>
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={18} color="#fff" />
                  <Text style={styles.saveBtnText}>Save Profile</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal visible={detailModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
              <Ionicons name="close" size={24} color={colors.ink} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Profile Details</Text>
            <View style={{ width: 24 }} />
          </View>

          {selectedProfile && (
            <ScrollView contentContainerStyle={styles.detailContent} showsVerticalScrollIndicator={false}>
              <ProfilePhoto profile={selectedProfile} size={116} />
              <Text style={styles.detailName}>{selectedProfile.name}</Text>
              <Text style={styles.detailSub}>{selectedProfile.age} yrs • {selectedProfile.gender} • {selectedProfile.location}</Text>

              <View style={styles.infoBox}>
                <InfoRow icon="business-outline" label="Occupation" value={selectedProfile.occupation} />
                <InfoRow icon="school-outline" label="Education" value={selectedProfile.education} />
                <InfoRow icon="church-outline" label="Denomination" value={selectedProfile.denomination} />
                <InfoRow icon="location-outline" label="Location" value={selectedProfile.location} />
              </View>

              <Text style={styles.aboutTitle}>Family Details</Text>
              <Text style={styles.aboutText}>{selectedProfile.familyDetails || selectedProfile.bio}</Text>

              {canViewMatrimonyContact(selectedProfile) ? (
                <View style={styles.contactBox}>
                  <View style={styles.contactTitleRow}>
                    <Ionicons name="lock-open-outline" size={18} color="#52B788" />
                    <Text style={styles.contactTitle}>Contact Details Unlocked</Text>
                  </View>
                  <InfoRow icon="call-outline" label="Phone" value={selectedProfile.phone} />
                  <InfoRow icon="mail-outline" label="Email" value={selectedProfile.email} />
                </View>
              ) : (
                <View style={styles.lockedBox}>
                  <Ionicons name="lock-closed-outline" size={24} color={colors.goldDeep} />
                  <Text style={styles.lockedTitle}>Contact Hidden</Text>
                  <Text style={styles.lockedText}>Contact details will show only after both users create profiles and accept mutual interest.</Text>
                </View>
              )}

              {!canViewMatrimonyContact(selectedProfile) && (!hasSentInterest(selectedProfile.userId) || !myProfile) && (
                <TouchableOpacity
                  style={styles.detailInterestBtn}
                  onPress={() => {
                    if (!myProfile) {
                      setDetailModalVisible(false);
                      fillProfileForm();
                      return;
                    }
                    handleInterest(selectedProfile);
                  }}
                >
                  <Ionicons name={renderActionIcon(selectedProfile)} size={18} color="#fff" />
                  <Text style={styles.detailInterestText}>
                    {renderActionText(selectedProfile)}
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
}

function Input({ label, ...props }) {
  return (
    <>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor={colors.inkFaint} {...props} />
    </>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={16} color={colors.goldDeep} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || 'Not added'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.ink,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.serif,
    color: colors.paper,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: fonts.sans,
    color: colors.goldSoft,
    marginTop: 4,
    lineHeight: 18,
  },
  content: {
    padding: 20,
  },
  addProfileCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTitle: {
    fontSize: 15,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
  },
  addText: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.inkFaint,
    lineHeight: 17,
    marginTop: 3,
  },
  profileRequiredBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E5',
    borderRadius: radii.xl,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#F5D48A',
  },
  profileRequiredTitle: {
    fontSize: 14,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
  },
  profileRequiredText: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.inkFaint,
    lineHeight: 17,
    marginTop: 3,
  },
  requestsBox: {
    backgroundColor: '#FFF4F4',
    borderRadius: radii.xl,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FFD6D6',
  },
  requestsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  requestCountBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E63946',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7,
    marginBottom: 12,
  },
  requestCountText: {
    fontSize: 11,
    fontFamily: fonts.sansSemiBold,
    color: '#fff',
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.paper,
    borderRadius: radii.lg,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FFD6D6',
    marginBottom: 8,
  },
  requestName: {
    fontSize: 14,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
  },
  requestText: {
    fontSize: 11,
    fontFamily: fonts.sans,
    color: colors.inkFaint,
    marginTop: 2,
  },
  acceptSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E63946',
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  acceptSmallText: {
    fontSize: 11,
    fontFamily: fonts.sansSemiBold,
    color: '#fff',
  },
  myProfileBox: {
    backgroundColor: colors.goldSoft,
    borderRadius: radii.xl,
    padding: 14,
    marginTop: 16,
  },
  myProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
    marginBottom: 12,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },
  avatar: {
    backgroundColor: colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarText: {
    fontFamily: fonts.sansSemiBold,
    color: colors.goldDeep,
  },
  profileName: {
    fontSize: 16,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
  },
  profileSub: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    marginTop: 2,
  },
  profileDenom: {
    fontSize: 11,
    fontFamily: fonts.sansMedium,
    color: colors.goldDeep,
    marginTop: 3,
  },
  profileOcc: {
    fontSize: 12,
    fontFamily: fonts.sansMedium,
    color: colors.goldDeep,
    marginTop: 3,
  },
  contactBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactBadgeUnlocked: {
    backgroundColor: '#E8F5E9',
    borderColor: '#C8E6C9',
  },
  profileBio: {
    fontSize: 13,
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    lineHeight: 19,
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  occupationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.goldSoft,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 5,
    flexShrink: 1,
  },
  occupationText: {
    fontSize: 11,
    fontFamily: fonts.sansSemiBold,
    color: colors.goldDeep,
  },
  interestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.ink,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 5,
  },
  interestBtnDone: {
    backgroundColor: colors.sageDeep,
  },
  interestBtnText: {
    fontSize: 11,
    fontFamily: fonts.sansSemiBold,
    color: colors.paper,
  },
  emptyCard: {
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
    marginTop: 4,
    lineHeight: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
  },
  formContent: {
    padding: 20,
    paddingBottom: 34,
  },
  photoPicker: {
    alignItems: 'center',
    marginBottom: 8,
  },
  formPhoto: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  formPhotoEmpty: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoText: {
    fontSize: 12,
    fontFamily: fonts.sansSemiBold,
    color: colors.goldDeep,
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
    marginTop: 12,
    marginBottom: 7,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: fonts.sans,
    color: colors.ink,
  },
  textArea: {
    minHeight: 96,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10,
  },
  genderBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  genderBtnActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  genderText: {
    fontSize: 13,
    fontFamily: fonts.sansSemiBold,
    color: colors.inkSoft,
  },
  genderTextActive: {
    color: colors.paper,
  },
  saveBtn: {
    marginTop: 22,
    backgroundColor: colors.ink,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  saveBtnText: {
    fontSize: 14,
    fontFamily: fonts.sansSemiBold,
    color: '#fff',
  },
  detailContent: {
    padding: 22,
    alignItems: 'center',
    paddingBottom: 34,
  },
  detailName: {
    fontSize: 22,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
    marginTop: 14,
  },
  detailSub: {
    fontSize: 13,
    fontFamily: fonts.sans,
    color: colors.inkFaint,
    marginTop: 4,
    marginBottom: 18,
  },
  infoBox: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 11,
    fontFamily: fonts.sans,
    color: colors.inkFaint,
  },
  infoValue: {
    fontSize: 13,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
    marginTop: 2,
  },
  aboutTitle: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
    marginTop: 18,
    marginBottom: 8,
  },
  aboutText: {
    alignSelf: 'stretch',
    fontSize: 13,
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    lineHeight: 20,
  },
  contactBox: {
    width: '100%',
    backgroundColor: '#E8F5E9',
    borderRadius: radii.xl,
    padding: 14,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  contactTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  contactTitle: {
    fontSize: 14,
    fontFamily: fonts.sansSemiBold,
    color: '#2F7D32',
  },
  lockedBox: {
    width: '100%',
    backgroundColor: colors.goldSoft,
    borderRadius: radii.xl,
    padding: 18,
    alignItems: 'center',
    marginTop: 18,
  },
  lockedTitle: {
    fontSize: 15,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
    marginTop: 8,
  },
  lockedText: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 5,
  },
  detailInterestBtn: {
    alignSelf: 'stretch',
    marginTop: 18,
    backgroundColor: colors.ink,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  detailInterestText: {
    fontSize: 14,
    fontFamily: fonts.sansSemiBold,
    color: '#fff',
  },
});
