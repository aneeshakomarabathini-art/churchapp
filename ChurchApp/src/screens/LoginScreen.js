// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { colors, fonts, radii } from '../theme/theme';
// import { useApp, DEMO_ACCOUNTS } from '../context/AppContext';

// export default function LoginScreen() {
//   const insets = useSafeAreaInsets();
//   const { signIn } = useApp();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleLogin = async () => {
//     if (!email.trim() || !password.trim()) {
//       setError('Please enter both email and password.');
//       return;
//     }
//     setError('');
//     setLoading(true);
//     try {
//       await signIn(email.trim(), password);
//     } catch (e) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fillDemo = (account) => {
//     setEmail(account.email);
//     setPassword(account.password);
//     setError('');
//   };

//   const roleColor = {
//     admin: '#E63946',
//     church_admin: '#6366F1',
//     user: colors.goldDeep,
//   };

//   const roleLabel = {
//     admin: 'Super Admin',
//     church_admin: 'Church Admin',
//     user: 'User',
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1, backgroundColor: colors.paper }}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <ScrollView
//         contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 20, paddingBottom: 40 }}
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <View style={styles.logoCircle}>
//             <Ionicons name="book" size={36} color={colors.goldDeep} />
//           </View>
//           <Text style={styles.appName}>Grace Community</Text>
//           <Text style={styles.tagline}>Bible & Church App</Text>
//         </View>

//         {/* Form Card */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Sign In</Text>

//           {error ? (
//             <View style={styles.errorBox}>
//               <Ionicons name="alert-circle" size={16} color="#E63946" />
//               <Text style={styles.errorText}>{error}</Text>
//             </View>
//           ) : null}

//           {/* Email */}
//           <Text style={styles.inputLabel}>Email</Text>
//           <View style={styles.inputRow}>
//             <Ionicons name="mail-outline" size={18} color={colors.inkFaint} style={styles.inputIcon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Enter your email"
//               placeholderTextColor={colors.inkFaint}
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               autoCapitalize="none"
//               autoCorrect={false}
//             />
//           </View>

//           {/* Password */}
//           <Text style={styles.inputLabel}>Password</Text>
//           <View style={styles.inputRow}>
//             <Ionicons name="lock-closed-outline" size={18} color={colors.inkFaint} style={styles.inputIcon} />
//             <TextInput
//               style={[styles.input, { flex: 1 }]}
//               placeholder="Enter your password"
//               placeholderTextColor={colors.inkFaint}
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry={!showPassword}
//               autoCapitalize="none"
//             />
//             <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={{ paddingHorizontal: 10 }}>
//               <Ionicons
//                 name={showPassword ? 'eye-off-outline' : 'eye-outline'}
//                 size={18}
//                 color={colors.inkFaint}
//               />
//             </TouchableOpacity>
//           </View>

//           {/* Login Button */}
//           <TouchableOpacity
//             style={[styles.loginBtn, loading && { opacity: 0.7 }]}
//             onPress={handleLogin}
//             disabled={loading}
//             activeOpacity={0.85}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.loginBtnText}>Sign In</Text>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* Demo Accounts */}
//         <View style={styles.demoSection}>
//           <Text style={styles.demoTitle}>Demo Accounts — Tap to fill</Text>
//           {DEMO_ACCOUNTS.map((acc) => (
//             <TouchableOpacity
//               key={acc.id}
//               style={styles.demoRow}
//               onPress={() => fillDemo(acc)}
//               activeOpacity={0.8}
//             >
//               <View style={[styles.demoBadge, { backgroundColor: roleColor[acc.role] + '20' }]}>
//                 <Text style={[styles.demoBadgeText, { color: roleColor[acc.role] }]}>
//                   {roleLabel[acc.role]}
//                 </Text>
//               </View>
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.demoName}>{acc.name}</Text>
//                 <Text style={styles.demoEmail}>{acc.email}</Text>
//               </View>
//               <Ionicons name="arrow-forward-circle-outline" size={20} color={colors.goldDeep} />
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     marginBottom: 32,
//   },
//   logoCircle: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: colors.goldSoft,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 12,
//   },
//   appName: {
//     fontSize: 26,
//     fontFamily: fonts.serif,
//     color: colors.ink,
//     textAlign: 'center',
//   },
//   tagline: {
//     fontSize: 14,
//     fontFamily: fonts.sans,
//     color: colors.inkSoft,
//     marginTop: 4,
//   },
//   card: {
//     marginHorizontal: 20,
//     backgroundColor: colors.surface,
//     borderRadius: radii.xl,
//     padding: 24,
//     borderWidth: 1,
//     borderColor: colors.line,
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowRadius: 12,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 3,
//   },
//   cardTitle: {
//     fontSize: 20,
//     fontFamily: fonts.sansSemiBold,
//     color: colors.ink,
//     marginBottom: 20,
//   },
//   errorBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FDECEA',
//     borderRadius: radii.sm,
//     padding: 10,
//     marginBottom: 16,
//     gap: 8,
//   },
//   errorText: {
//     color: '#E63946',
//     fontFamily: fonts.sans,
//     fontSize: 13,
//     flex: 1,
//   },
//   inputLabel: {
//     fontSize: 13,
//     fontFamily: fonts.sansMedium,
//     color: colors.inkSoft,
//     marginBottom: 6,
//     marginTop: 4,
//   },
//   inputRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: colors.paper,
//     borderRadius: radii.md,
//     borderWidth: 1,
//     borderColor: colors.line,
//     marginBottom: 14,
//     paddingHorizontal: 12,
//   },
//   inputIcon: {
//     marginRight: 8,
//   },
//   input: {
//     flex: 1,
//     paddingVertical: 13,
//     fontFamily: fonts.sans,
//     fontSize: 14,
//     color: colors.ink,
//   },
//   loginBtn: {
//     backgroundColor: colors.ink,
//     borderRadius: radii.md,
//     paddingVertical: 15,
//     alignItems: 'center',
//     marginTop: 6,
//   },
//   loginBtnText: {
//     color: '#fff',
//     fontFamily: fonts.sansSemiBold,
//     fontSize: 15,
//   },
//   demoSection: {
//     marginHorizontal: 20,
//     marginTop: 28,
//   },
//   demoTitle: {
//     fontSize: 13,
//     fontFamily: fonts.sansMedium,
//     color: colors.inkFaint,
//     marginBottom: 12,
//     textAlign: 'center',
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
//   demoRow: {
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
//   demoBadge: {
//     borderRadius: radii.pill,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//   },
//   demoBadgeText: {
//     fontSize: 11,
//     fontFamily: fonts.sansSemiBold,
//   },
//   demoName: {
//     fontFamily: fonts.sansMedium,
//     fontSize: 14,
//     color: colors.ink,
//   },
//   demoEmail: {
//     fontFamily: fonts.sans,
//     fontSize: 12,
//     color: colors.inkFaint,
//     marginTop: 2,
//   },
// });  



























// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
//   ScrollView,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { colors, fonts, radii } from '../theme/theme';
// import { useApp, DEMO_ACCOUNTS } from '../context/AppContext';

// export default function LoginScreen({ navigation }) {
//   const insets = useSafeAreaInsets();
//   const { signIn } = useApp();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleLogin = async () => {
//     if (!email.trim() || !password.trim()) {
//       setError('Please enter both email and password.');
//       return;
//     }

//     setError('');
//     setLoading(true);

//     try {
//       await signIn(email.trim(), password);
//     } catch (e) {
//       setError(e?.message || 'Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fillDemo = (account) => {
//     setEmail(account.email);
//     setPassword(account.password);
//     setError('');
//   };

//   const goToUserRegister = () => {
//     navigation.navigate('Register', { type: 'user' });
//   };

//   const goToChurchAdminRegister = () => {
//     navigation.navigate('Register', { type: 'church_admin' });
//   };

//   const roleColor = {
//     admin: '#E63946',
//     church_admin: '#6366F1',
//     user: colors.goldDeep,
//   };

//   const roleLabel = {
//     admin: 'Super Admin',
//     church_admin: 'Church Admin',
//     user: 'User',
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1, backgroundColor: colors.paper }}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <ScrollView
//         contentContainerStyle={{
//           flexGrow: 1,
//           paddingTop: insets.top + 20,
//           paddingBottom: 40,
//         }}
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <View style={styles.logoCircle}>
//             <Ionicons name="book" size={36} color={colors.goldDeep} />
//           </View>

//           <Text style={styles.appName}>Grace Community</Text>
//           <Text style={styles.tagline}>Bible & Church App</Text>
//         </View>

//         {/* Form Card */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Sign In</Text>
//           <Text style={styles.cardSubTitle}>
//             Login to continue your Bible reading and church updates
//           </Text>

//           {error ? (
//             <View style={styles.errorBox}>
//               <Ionicons name="alert-circle" size={16} color="#E63946" />
//               <Text style={styles.errorText}>{error}</Text>
//             </View>
//           ) : null}

//           {/* Email */}
//           <Text style={styles.inputLabel}>Email</Text>
//           <View style={styles.inputRow}>
//             <Ionicons
//               name="mail-outline"
//               size={18}
//               color={colors.inkFaint}
//               style={styles.inputIcon}
//             />

//             <TextInput
//               style={styles.input}
//               placeholder="Enter your email"
//               placeholderTextColor={colors.inkFaint}
//               value={email}
//               onChangeText={(text) => {
//                 setEmail(text);
//                 if (error) setError('');
//               }}
//               keyboardType="email-address"
//               autoCapitalize="none"
//               autoCorrect={false}
//             />
//           </View>

//           {/* Password */}
//           <Text style={styles.inputLabel}>Password</Text>
//           <View style={styles.inputRow}>
//             <Ionicons
//               name="lock-closed-outline"
//               size={18}
//               color={colors.inkFaint}
//               style={styles.inputIcon}
//             />

//             <TextInput
//               style={styles.input}
//               placeholder="Enter your password"
//               placeholderTextColor={colors.inkFaint}
//               value={password}
//               onChangeText={(text) => {
//                 setPassword(text);
//                 if (error) setError('');
//               }}
//               secureTextEntry={!showPassword}
//               autoCapitalize="none"
//             />

//             <TouchableOpacity
//               onPress={() => setShowPassword((v) => !v)}
//               style={styles.eyeBtn}
//               activeOpacity={0.75}
//             >
//               <Ionicons
//                 name={showPassword ? 'eye-off-outline' : 'eye-outline'}
//                 size={18}
//                 color={colors.inkFaint}
//               />
//             </TouchableOpacity>
//           </View>

//           {/* Login Button */}
//           <TouchableOpacity
//             style={[styles.loginBtn, loading && { opacity: 0.7 }]}
//             onPress={handleLogin}
//             disabled={loading}
//             activeOpacity={0.85}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <>
//                 <Ionicons name="log-in-outline" size={18} color="#fff" />
//                 <Text style={styles.loginBtnText}>Sign In</Text>
//               </>
//             )}
//           </TouchableOpacity>

//           {/* Registration Buttons */}
//           <View style={styles.dividerRow}>
//             <View style={styles.dividerLine} />
//             <Text style={styles.dividerText}>OR REGISTER</Text>
//             <View style={styles.dividerLine} />
//           </View>

//           <TouchableOpacity
//             style={styles.registerUserBtn}
//             onPress={goToUserRegister}
//             activeOpacity={0.75}
//           >
//             <Ionicons name="person-add-outline" size={18} color={colors.goldDeep} />
//             <Text style={styles.registerUserText}>Create User Account</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.registerChurchBtn}
//             onPress={goToChurchAdminRegister}
//             activeOpacity={0.75}
//           >
//             <Ionicons name="business-outline" size={18} color="#6366F1" />
//             <Text style={styles.registerChurchText}>Register as Church Admin</Text>
//           </TouchableOpacity>

//           <Text style={styles.churchApprovalText}>
//             Church admin registration needs admin approval before login.
//           </Text>
//         </View>


//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     marginBottom: 28,
//   },
//   logoCircle: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: colors.goldSoft,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 12,
//   },
//   appName: {
//     fontSize: 26,
//     fontFamily: fonts.serif,
//     color: colors.ink,
//     textAlign: 'center',
//   },
//   tagline: {
//     fontSize: 14,
//     fontFamily: fonts.sans,
//     color: colors.inkSoft,
//     marginTop: 4,
//   },
//   card: {
//     marginHorizontal: 20,
//     backgroundColor: colors.surface,
//     borderRadius: radii.xl,
//     padding: 24,
//     borderWidth: 1,
//     borderColor: colors.line,
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowRadius: 12,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 3,
//   },
//   cardTitle: {
//     fontSize: 20,
//     fontFamily: fonts.sansSemiBold,
//     color: colors.ink,
//     marginBottom: 4,
//   },
//   cardSubTitle: {
//     fontSize: 12,
//     fontFamily: fonts.sans,
//     color: colors.inkFaint,
//     marginBottom: 18,
//     lineHeight: 18,
//   },
//   errorBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FDECEA',
//     borderRadius: radii.sm,
//     padding: 10,
//     marginBottom: 16,
//     gap: 8,
//   },
//   errorText: {
//     color: '#E63946',
//     fontFamily: fonts.sans,
//     fontSize: 13,
//     flex: 1,
//   },
//   inputLabel: {
//     fontSize: 13,
//     fontFamily: fonts.sansMedium,
//     color: colors.inkSoft,
//     marginBottom: 6,
//     marginTop: 4,
//   },
//   inputRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: colors.paper,
//     borderRadius: radii.md,
//     borderWidth: 1,
//     borderColor: colors.line,
//     marginBottom: 14,
//     paddingHorizontal: 12,
//     minHeight: 50,
//   },
//   inputIcon: {
//     marginRight: 8,
//   },
//   input: {
//     flex: 1,
//     paddingVertical: 13,
//     fontFamily: fonts.sans,
//     fontSize: 14,
//     color: colors.ink,
//   },
//   eyeBtn: {
//     paddingLeft: 10,
//     paddingVertical: 10,
//   },
//   loginBtn: {
//     backgroundColor: colors.ink,
//     borderRadius: radii.md,
//     paddingVertical: 15,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 6,
//     flexDirection: 'row',
//     gap: 8,
//   },
//   loginBtnText: {
//     color: '#fff',
//     fontFamily: fonts.sansSemiBold,
//     fontSize: 15,
//   },
//   dividerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 22,
//     marginBottom: 14,
//     gap: 10,
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: colors.line,
//   },
//   dividerText: {
//     fontSize: 10,
//     fontFamily: fonts.sansSemiBold,
//     color: colors.inkFaint,
//     letterSpacing: 0.7,
//   },
//   registerUserBtn: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 13,
//     borderRadius: radii.md,
//     borderWidth: 1,
//     borderColor: colors.goldDeep,
//     backgroundColor: colors.surface,
//     flexDirection: 'row',
//     gap: 8,
//   },
//   registerUserText: {
//     fontSize: 13,
//     fontFamily: fonts.sansSemiBold,
//     color: colors.goldDeep,
//   },
//   registerChurchBtn: {
//     marginTop: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 13,
//     borderRadius: radii.md,
//     borderWidth: 1,
//     borderColor: '#6366F1',
//     backgroundColor: '#EEF2FF',
//     flexDirection: 'row',
//     gap: 8,
//   },
//   registerChurchText: {
//     fontSize: 13,
//     fontFamily: fonts.sansSemiBold,
//     color: '#6366F1',
//   },
//   churchApprovalText: {
//     marginTop: 10,
//     fontSize: 11,
//     fontFamily: fonts.sans,
//     color: colors.inkFaint,
//     textAlign: 'center',
//     lineHeight: 16,
//   },
//   demoSection: {
//     marginHorizontal: 20,
//     marginTop: 28,
//   },
//   demoTitle: {
//     fontSize: 13,
//     fontFamily: fonts.sansMedium,
//     color: colors.inkFaint,
//     marginBottom: 12,
//     textAlign: 'center',
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
//   demoRow: {
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
//   demoBadge: {
//     borderRadius: radii.pill,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//   },
//   demoBadgeText: {
//     fontSize: 11,
//     fontFamily: fonts.sansSemiBold,
//   },
//   demoName: {
//     fontFamily: fonts.sansMedium,
//     fontSize: 14,
//     color: colors.ink,
//   },
//   demoEmail: {
//     fontFamily: fonts.sans,
//     fontSize: 12,
//     color: colors.inkFaint,
//     marginTop: 2,
//   },
// });  

































import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radii } from '../theme/theme';
import { useApp } from '../context/AppContext';

const DEMO_CREDENTIALS = [
  {
    role: 'admin',
    email: 'admin@gracechurch.com',
    password: 'admin123',
  },
  {
    role: 'church_admin',
    email: 'smily1@gmail.com',
    password: 'smilysmily',
  },
  {
    role: 'user',
    email: 'anu@gmail.com',
    password: 'anuanu',
  },
];

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { signIn } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await signIn(email.trim(), password);
    } catch (e) {
      setError(e?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  };

  const goToUserRegister = () => {
    navigation.navigate('Register', { type: 'user' });
  };

  const goToChurchAdminRegister = () => {
    navigation.navigate('Register', { type: 'church_admin' });
  };

  const roleColor = {
    admin: '#E63946',
    church_admin: '#6366F1',
    user: colors.goldDeep,
  };

  const roleLabel = {
    admin: 'Admin',
    church_admin: 'Church Admin',
    user: 'User',
  };

  const roleIcon = {
    admin: 'shield-checkmark-outline',
    church_admin: 'business-outline',
    user: 'person-outline',
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.paper }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 20,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="book" size={36} color={colors.goldDeep} />
          </View>

          <Text style={styles.appName}>Grace Community</Text>
          <Text style={styles.tagline}>Bible & Church App</Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign In</Text>
          <Text style={styles.cardSubTitle}>
            Login to continue your Bible reading and church updates
          </Text>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color="#E63946" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Email */}
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputRow}>
            <Ionicons
              name="mail-outline"
              size={18}
              color={colors.inkFaint}
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={colors.inkFaint}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password */}
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputRow}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={colors.inkFaint}
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={colors.inkFaint}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) setError('');
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />

            <TouchableOpacity
              onPress={() => setShowPassword((v) => !v)}
              style={styles.eyeBtn}
              activeOpacity={0.75}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={colors.inkFaint}
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="log-in-outline" size={18} color="#fff" />
                <Text style={styles.loginBtnText}>Sign In</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Demo Credentials */}
          <View style={styles.demoSection}>
            <View style={styles.demoTitleRow}>
              <View style={styles.demoLine} />
              <Text style={styles.demoTitle}>DEMO CREDENTIALS</Text>
              <View style={styles.demoLine} />
            </View>

            {DEMO_CREDENTIALS.map((account) => {
              const color = roleColor[account.role];

              return (
                <TouchableOpacity
                  key={account.role}
                  style={styles.demoRow}
                  onPress={() => fillDemo(account)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.demoIconCircle,
                      { backgroundColor: `${color}18` },
                    ]}
                  >
                    <Ionicons
                      name={roleIcon[account.role]}
                      size={18}
                      color={color}
                    />
                  </View>

                  <View style={styles.demoInfo}>
                    <View style={styles.demoTopRow}>
                      <View
                        style={[
                          styles.demoBadge,
                          { backgroundColor: `${color}15` },
                        ]}
                      >
                        <Text style={[styles.demoBadgeText, { color }]}>
                          {roleLabel[account.role]}
                        </Text>
                      </View>

                      <Text style={styles.tapText}>Tap to fill</Text>
                    </View>

                    <Text style={styles.demoEmail}>
                      Email: {account.email}
                    </Text>
                    <Text style={styles.demoPassword}>
                      Password: {account.password}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.inkFaint}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Registration Buttons */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR REGISTER</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.registerUserBtn}
            onPress={goToUserRegister}
            activeOpacity={0.75}
          >
            <Ionicons name="person-add-outline" size={18} color={colors.goldDeep} />
            <Text style={styles.registerUserText}>Create User Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerChurchBtn}
            onPress={goToChurchAdminRegister}
            activeOpacity={0.75}
          >
            <Ionicons name="business-outline" size={18} color="#6366F1" />
            <Text style={styles.registerChurchText}>Register as Church Admin</Text>
          </TouchableOpacity>

          <Text style={styles.churchApprovalText}>
            Church admin registration needs admin approval before login.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 26,
    fontFamily: fonts.serif,
    color: colors.ink,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 14,
    fontFamily: fonts.sans,
    color: colors.inkSoft,
    marginTop: 4,
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
    marginBottom: 4,
  },
  cardSubTitle: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: colors.inkFaint,
    marginBottom: 18,
    lineHeight: 18,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDECEA',
    borderRadius: radii.sm,
    padding: 10,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: '#E63946',
    fontFamily: fonts.sans,
    fontSize: 13,
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: fonts.sansMedium,
    color: colors.inkSoft,
    marginBottom: 6,
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.paper,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 14,
    paddingHorizontal: 12,
    minHeight: 50,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink,
  },
  eyeBtn: {
    paddingLeft: 10,
    paddingVertical: 10,
  },
  loginBtn: {
    backgroundColor: colors.ink,
    borderRadius: radii.md,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    flexDirection: 'row',
    gap: 8,
  },
  loginBtnText: {
    color: '#fff',
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
  },

  demoSection: {
    marginTop: 22,
  },
  demoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  demoLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.line,
  },
  demoTitle: {
    fontSize: 10,
    fontFamily: fonts.sansSemiBold,
    color: colors.inkFaint,
    letterSpacing: 0.7,
  },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.paper,
    borderRadius: radii.md,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 10,
  },
  demoIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoInfo: {
    flex: 1,
  },
  demoTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    gap: 8,
  },
  demoBadge: {
    borderRadius: radii.pill,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  demoBadgeText: {
    fontSize: 11,
    fontFamily: fonts.sansSemiBold,
  },
  tapText: {
    fontSize: 10,
    fontFamily: fonts.sans,
    color: colors.inkFaint,
  },
  demoEmail: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.ink,
    marginBottom: 3,
  },
  demoPassword: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.inkFaint,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 14,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.line,
  },
  dividerText: {
    fontSize: 10,
    fontFamily: fonts.sansSemiBold,
    color: colors.inkFaint,
    letterSpacing: 0.7,
  },
  registerUserBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.goldDeep,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    gap: 8,
  },
  registerUserText: {
    fontSize: 13,
    fontFamily: fonts.sansSemiBold,
    color: colors.goldDeep,
  },
  registerChurchBtn: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
    flexDirection: 'row',
    gap: 8,
  },
  registerChurchText: {
    fontSize: 13,
    fontFamily: fonts.sansSemiBold,
    color: '#6366F1',
  },
  churchApprovalText: {
    marginTop: 10,
    fontSize: 11,
    fontFamily: fonts.sans,
    color: colors.inkFaint,
    textAlign: 'center',
    lineHeight: 16,
  },
});
