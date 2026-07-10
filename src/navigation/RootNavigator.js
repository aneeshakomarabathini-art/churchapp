// import React from 'react';
// import { View, ActivityIndicator } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import HomeScreen from '../screens/HomeScreen';
// import BibleScreen from '../screens/BibleScreen';
// import ChurchScreen from '../screens/ChurchScreen';
// import MatrimonyScreen from '../screens/MatrimonyScreen';
// import ProfileScreen from '../screens/ProfileScreen';
// import NotificationScreen from '../screens/NotificationScreen';
// import LoginScreen from '../screens/LoginScreen';
// import AdminScreen from '../screens/AdminScreen';
// import ChurchAdminScreen from '../screens/ChurchAdminScreen';
// import CustomTabBar from '../components/CustomeTabBar';

// import { useApp } from '../context/AppContext';
// import { colors } from '../theme/theme';

// const Tab = createBottomTabNavigator();

// function UserTabs() {
//   return (
//     <Tab.Navigator
//       tabBar={(props) => <CustomTabBar {...props} />}
//       screenOptions={{ headerShown: false }}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Bible" component={BibleScreen} />
//       <Tab.Screen name="Church" component={ChurchScreen} />
//       <Tab.Screen name="Matrimony" component={MatrimonyScreen} />
//       <Tab.Screen name="Profile" component={ProfileScreen} />
//       <Tab.Screen
//         name="Notifications"
//         component={NotificationScreen}
//         options={{ tabBarButton: () => null }}
//       />
//     </Tab.Navigator>
//   );
// }

// export default function RootNavigator() {
//   const { currentUser, authLoading } = useApp();

//   if (authLoading) {
//     return (
//       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.paper }}>
//         <ActivityIndicator size="large" color={colors.goldDeep} />
//       </View>
//     );
//   }

//   if (!currentUser) {
//     return (
//       <NavigationContainer>
//         <LoginScreen />
//       </NavigationContainer>
//     );
//   }

//   if (currentUser.role === 'admin') {
//     return (
//       <NavigationContainer>
//         <AdminScreen />
//       </NavigationContainer>
//     );
//   }

//   if (currentUser.role === 'church_admin') {
//     return (
//       <NavigationContainer>
//         <ChurchAdminScreen />
//       </NavigationContainer>
//     );
//   }

//   // Regular user
//   return (
//     <NavigationContainer>
//       <UserTabs />
//     </NavigationContainer>
//   );
// }  

























// import React from 'react';
// import { View, ActivityIndicator } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import HomeScreen from '../screens/HomeScreen';
// import BibleScreen from '../screens/BibleScreen';
// import ChurchScreen from '../screens/ChurchScreen';
// import MatrimonyScreen from '../screens/MatrimonyScreen';
// import ProfileScreen from '../screens/ProfileScreen';
// import NotificationScreen from '../screens/NotificationScreen';
// import LoginScreen from '../screens/LoginScreen';
// import AdminScreen from '../screens/AdminScreen';
// import ChurchAdminScreen from '../screens/ChurchAdminScreen';
// import CustomTabBar from '../components/CustomeTabBar';

// import { useApp } from '../context/AppContext';
// import { colors } from '../theme/theme';

// const Tab = createBottomTabNavigator();

// function UserTabs() {
//   return (
//     <Tab.Navigator
//       tabBar={(props) => <CustomTabBar {...props} />}
//       screenOptions={{ headerShown: false }}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Bible" component={BibleScreen} />
//       <Tab.Screen name="Church" component={ChurchScreen} />
//       <Tab.Screen name="Matrimony" component={MatrimonyScreen} />
//       <Tab.Screen name="Profile" component={ProfileScreen} />

//       <Tab.Screen
//         name="Notifications"
//         component={NotificationScreen}
//         options={{
//           tabBarButton: () => null,
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

// export default function RootNavigator() {
//   const { currentUser, authLoading } = useApp();

//   if (authLoading) {
//     return (
//       <View
//         style={{
//           flex: 1,
//           alignItems: 'center',
//           justifyContent: 'center',
//           backgroundColor: colors.paper,
//         }}
//       >
//         <ActivityIndicator size="large" color={colors.goldDeep} />
//       </View>
//     );
//   }

//   if (!currentUser) {
//     return (
//       <NavigationContainer key="auth">
//         <LoginScreen />
//       </NavigationContainer>
//     );
//   }

//   if (currentUser.role === 'admin') {
//     return (
//       <NavigationContainer key="admin">
//         <AdminScreen />
//       </NavigationContainer>
//     );
//   }

//   if (currentUser.role === 'church_admin') {
//     return (
//       <NavigationContainer key="church-admin">
//         <ChurchAdminScreen />
//       </NavigationContainer>
//     );
//   }

//   return (
//     <NavigationContainer key="user">
//       <UserTabs />
//     </NavigationContainer>
//   );
// }



























import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import BibleScreen from '../screens/BibleScreen';
import ChurchScreen from '../screens/ChurchScreen';
import MatrimonyScreen from '../screens/MatrimonyScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationScreen from '../screens/NotificationScreen';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

import AdminScreen from '../screens/AdminScreen';
import ChurchAdminScreen from '../screens/ChurchAdminScreen';
import CustomTabBar from '../components/CustomeTabBar';

import { useApp } from '../context/AppContext';
import { colors } from '../theme/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function UserTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bible" component={BibleScreen} />
      <Tab.Screen name="Church" component={ChurchScreen} />
      <Tab.Screen name="Matrimony" component={MatrimonyScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />

      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { currentUser, authLoading } = useApp();

  if (authLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.paper,
        }}
      >
        <ActivityIndicator size="large" color={colors.goldDeep} />
      </View>
    );
  }

  if (!currentUser) {
    return (
      <NavigationContainer key="auth">
        <AuthStack />
      </NavigationContainer>
    );
  }

  if (currentUser.role === 'admin') {
    return (
      <NavigationContainer key="admin">
        <AdminScreen />
      </NavigationContainer>
    );
  }

  if (currentUser.role === 'church_admin') {
    return (
      <NavigationContainer key="church-admin">
        <ChurchAdminScreen />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer key="user">
      <UserTabs />
    </NavigationContainer>
  );
}