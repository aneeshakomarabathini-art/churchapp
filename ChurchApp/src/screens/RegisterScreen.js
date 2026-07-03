import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radii } from '../theme/theme';
import { registerUserApi, registerChurchAdminApi } from '../services/authApi';

export default function RegisterScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const initialType = route?.params?.type || 'user';

  const [accountType, setAccountType] = useState(initialType);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [churchName, setChurchName] = useState('');
  const [churchLocation, setChurchLocation] = useState('');
  const [churchAddress, setChurchAddress] = useState('');
  const [churchPhone, setChurchPhone] = useState('');
  const [churchEmail, setChurchEmail] = useState('');
  const [churchTiming, setChurchTiming] = useState('');
  const [churchAbout, setChurchAbout] = useState('');
  const [churchPhoto, setChurchPhoto] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isChurchAdmin = accountType === 'church_admin';

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

      if (!result.canceled && result.assets?.[0]) {
        setChurchPhoto(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Image Error', 'Unable to pick church photo. Please try again.');
    }
  };

  const validateEmail = (value) => /\S+@\S+\.\S+/.test(String(value || '').trim());

  const validate = () => {
    if (!name.trim()) return Alert.alert('Required', 'Please enter your full name.'), false;
    if (!email.trim()) return Alert.alert('Required', 'Please enter your email.'), false;
    if (!validateEmail(email)) return Alert.alert('Invalid Email', 'Please enter a valid personal email address.'), false;
    if (!phone.trim()) return Alert.alert('Required', 'Please enter your phone number.'), false;

    if (isChurchAdmin) {
      if (!churchPhoto?.uri) return Alert.alert('Required', 'Please upload your church photo.'), false;
      if (!churchName.trim()) return Alert.alert('Required', 'Please enter church name.'), false;
      if (!churchLocation.trim()) return Alert.alert('Required', 'Please enter church location.'), false;
      if (!churchAddress.trim()) return Alert.alert('Required', 'Please enter church address.'), false;
      if (!churchPhone.trim()) return Alert.alert('Required', 'Please enter church phone number.'), false;
      if (!churchEmail.trim()) return Alert.alert('Required', 'Please enter church email.'), false;
      if (!validateEmail(churchEmail)) return Alert.alert('Invalid Email', 'Please enter a valid church email address.'), false;
      if (!churchTiming.trim()) return Alert.alert('Required', 'Please enter church service timings.'), false;
    }

    if (!password.trim()) return Alert.alert('Required', 'Please enter password.'), false;
    if (password.length < 6) return Alert.alert('Weak Password', 'Password must be at least 6 characters.'), false;
    if (password !== confirmPassword) return Alert.alert('Password Error', 'Password and confirm password do not match.'), false;
    return true;
  };

  const clearForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setChurchName('');
    setChurchLocation('');
    setChurchAddress('');
    setChurchPhone('');
    setChurchEmail('');
    setChurchTiming('');
    setChurchAbout('');
    setChurchPhoto(null);
    setPassword('');
    setConfirmPassword('');
  };

  const handleRegister = async () => {
    if (!validate() || loading) return;
    setLoading(true);
    try {
      if (isChurchAdmin) {
        await registerChurchAdminApi({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password,
          churchName: churchName.trim(),
          churchLocation: churchLocation.trim(),
          churchAddress: churchAddress.trim(),
          churchPhone: churchPhone.trim(),
          churchEmail: churchEmail.trim().toLowerCase(),
          churchTiming: churchTiming.trim(),
          churchAbout: churchAbout.trim(),
          churchPhoto,
        });
        clearForm();
        Alert.alert('Request Sent', 'Your church admin account, church photo and church details are saved in DB. After admin approval, you can login.', [
          { text: 'Go to Login', onPress: () => navigation.navigate('Login') },
        ]);
        return;
      }

      await registerUserApi({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
      });
      clearForm();
      Alert.alert('Registration Successful', 'Your user account is saved in DB. Please login now.', [
        { text: 'Go to Login', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      Alert.alert('Registration Failed', error?.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}> 
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.75}>
          <Ionicons name="chevron-back" size={22} color={colors.paper} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.headerSub}>Register as user or church admin</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}>
        <View style={styles.typeRow}>
          <TouchableOpacity style={[styles.typeBtn, accountType === 'user' && styles.typeBtnActive]} onPress={() => setAccountType('user')} activeOpacity={0.75} disabled={loading}>
            <Ionicons name="person-outline" size={18} color={accountType === 'user' ? '#fff' : colors.goldDeep} />
            <Text style={[styles.typeText, accountType === 'user' && styles.typeTextActive]}>User</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.typeBtn, accountType === 'church_admin' && styles.typeBtnActive]} onPress={() => setAccountType('church_admin')} activeOpacity={0.75} disabled={loading}>
            <Ionicons name="business-outline" size={18} color={accountType === 'church_admin' ? '#fff' : colors.goldDeep} />
            <Text style={[styles.typeText, accountType === 'church_admin' && styles.typeTextActive]}>Church Admin</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Personal Details</Text>
          <Input icon="person-outline" placeholder="Full Name" value={name} onChangeText={setName} />
          <Input icon="mail-outline" placeholder="Personal Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Input icon="call-outline" placeholder="Personal Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        </View>

        {isChurchAdmin && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Church Details</Text>

            <TouchableOpacity style={styles.photoPicker} onPress={pickChurchPhoto} activeOpacity={0.85}>
              {churchPhoto?.uri ? (
                <Image source={{ uri: churchPhoto.uri }} style={styles.churchPhotoPreview} />
              ) : (
                <View style={styles.photoEmpty}>
                  <Ionicons name="camera-outline" size={30} color={colors.goldDeep} />
                  <Text style={styles.photoEmptyText}>Upload Church Photo</Text>
                </View>
              )}
            </TouchableOpacity>

            <Input icon="business-outline" placeholder="Church Name" value={churchName} onChangeText={setChurchName} />
            <Input icon="location-outline" placeholder="Church Location / City" value={churchLocation} onChangeText={setChurchLocation} />
            <Input icon="map-outline" placeholder="Church Full Address" value={churchAddress} onChangeText={setChurchAddress} multiline />
            <Input icon="call-outline" placeholder="Church Contact Number" value={churchPhone} onChangeText={setChurchPhone} keyboardType="phone-pad" />
            <Input icon="mail-outline" placeholder="Church Email" value={churchEmail} onChangeText={setChurchEmail} keyboardType="email-address" autoCapitalize="none" />
            <Input icon="time-outline" placeholder="Service Timings, e.g. Sunday 9 AM & 6 PM" value={churchTiming} onChangeText={setChurchTiming} />
            <Input icon="information-circle-outline" placeholder="Church information / short description optional" value={churchAbout} onChangeText={setChurchAbout} multiline />

            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={18} color="#6366F1" />
              <Text style={styles.infoText}>Church photo and details will be visible to users after admin approval. Church admin can edit these details later.</Text>
            </View>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Password</Text>
          <Input icon="lock-closed-outline" placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
          <Input icon="shield-checkmark-outline" placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
        </View>

        <TouchableOpacity style={[styles.registerBtn, loading && styles.registerBtnDisabled]} onPress={handleRegister} disabled={loading} activeOpacity={0.82}>
          {loading ? <ActivityIndicator color="#fff" /> : <>
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.registerBtnText}>{isChurchAdmin ? 'Send Approval Request' : 'Create User Account'}</Text>
          </>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')} activeOpacity={0.75} disabled={loading}>
          <Text style={styles.loginText}>Already have an account? <Text style={styles.loginTextBold}>Login</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function Input({ icon, placeholder, value, onChangeText, keyboardType, autoCapitalize, secureTextEntry, multiline }) {
  return (
    <View style={[styles.inputWrap, multiline && { minHeight: 76 }]}> 
      <Ionicons name={icon} size={18} color={colors.inkFaint} />
      <TextInput
        style={[styles.input, multiline && { minHeight: 62, textAlignVertical: 'top' }]}
        placeholder={placeholder}
        placeholderTextColor={colors.inkFaint}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.ink, paddingHorizontal: 20, paddingBottom: 22, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontFamily: fonts.serif, color: colors.paper },
  headerSub: { fontSize: 12, fontFamily: fonts.sans, color: colors.goldSoft, marginTop: 2 },
  typeRow: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  typeBtn: { flex: 1, borderWidth: 1, borderColor: colors.goldDeep, borderRadius: radii.lg, paddingVertical: 13, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, backgroundColor: colors.surface },
  typeBtnActive: { backgroundColor: colors.goldDeep },
  typeText: { fontSize: 13, fontFamily: fonts.sansSemiBold, color: colors.goldDeep },
  typeTextActive: { color: '#fff' },
  card: { backgroundColor: colors.surface, borderRadius: radii.xl, padding: 16, borderWidth: 1, borderColor: colors.line, marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontFamily: fonts.sansSemiBold, color: colors.ink, marginBottom: 12 },
  inputWrap: { minHeight: 50, borderRadius: radii.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.paper, paddingHorizontal: 13, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  input: { flex: 1, fontSize: 13, fontFamily: fonts.sans, color: colors.ink, paddingVertical: 10 },
  photoPicker: { height: 150, borderRadius: radii.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.line, backgroundColor: colors.paper, marginBottom: 12 },
  churchPhotoPreview: { width: '100%', height: '100%', resizeMode: 'cover' },
  photoEmpty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  photoEmptyText: { fontSize: 13, fontFamily: fonts.sansSemiBold, color: colors.goldDeep },
  infoBox: { backgroundColor: '#EEF2FF', borderRadius: radii.md, padding: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  infoText: { flex: 1, fontSize: 12, fontFamily: fonts.sans, color: '#3949AB', lineHeight: 18 },
  registerBtn: { backgroundColor: colors.goldDeep, borderRadius: radii.lg, paddingVertical: 15, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginTop: 4 },
  registerBtnDisabled: { opacity: 0.7 },
  registerBtnText: { fontSize: 14, fontFamily: fonts.sansSemiBold, color: '#fff' },
  loginLink: { alignItems: 'center', marginTop: 18 },
  loginText: { fontSize: 13, fontFamily: fonts.sans, color: colors.inkFaint },
  loginTextBold: { color: colors.goldDeep, fontFamily: fonts.sansSemiBold },
});
