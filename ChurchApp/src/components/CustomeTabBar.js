// import React from 'react';
// import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { colors, fonts } from '../theme/theme';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const ICONS = {
//   Home: 'home-outline',
//   Bible: 'book-outline',
//   Church: 'business-outline',
//   Matrimony: 'heart-outline',
//   Profile: 'person-outline',
// };

// const HIDDEN_TABS = ['Notifications'];

// export default function CustomTabBar({ state, descriptors, navigation }) {
//   const insets = useSafeAreaInsets();

//   const visibleRoutes = state.routes
//     .map((route, index) => ({ route, index }))
//     .filter(({ route }) => !HIDDEN_TABS.includes(route.name));

//   return (
//     <View style={[styles.tabbar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
//       {visibleRoutes.map(({ route, index }) => {
//         const isFocused = state.index === index;
//         const iconName = ICONS[route.name] || 'ellipse-outline';

//         const onPress = () => {
//           const event = navigation.emit({
//             type: 'tabPress',
//             target: route.key,
//             canPreventDefault: true,
//           });
//           if (!isFocused && !event.defaultPrevented) {
//             navigation.navigate(route.name);
//           }
//         };

//         return (
//           <TouchableOpacity
//             key={route.key}
//             onPress={onPress}
//             style={styles.tab}
//             activeOpacity={0.7}
//           >
//             <Ionicons
//               name={isFocused ? iconName.replace('-outline', '') : iconName}
//               size={22}
//               color={isFocused ? colors.goldDeep : colors.inkFaint}
//             />
//             <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
//               {route.name}
//             </Text>
//             {isFocused && <View style={styles.dot} />}
//           </TouchableOpacity>
//         );
//       })}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   tabbar: {
//     flexDirection: 'row',
//     backgroundColor: colors.surface,
//     borderTopWidth: 1,
//     borderTopColor: colors.line,
//     paddingTop: 10,
//   },
//   tab: {
//     flex: 1,
//     alignItems: 'center',
//     gap: 4,
//   },
//   tabLabel: {
//     fontSize: 11,
//     fontFamily: fonts.sansMedium,
//     color: colors.inkFaint,
//   },
//   tabLabelActive: {
//     color: colors.goldDeep,
//   },
//   dot: {
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: colors.gold,
//     marginTop: 2,
//   },
// });  


























import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../theme/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ICONS = {
  Home: 'home-outline',
  Bible: 'book-outline',
  Church: 'business-outline',
  Matrimony: 'heart-outline',
  Profile: 'person-outline',
};

const HIDDEN_TABS = ['Notifications'];

export default function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();

  const visibleRoutes = state.routes
    .map((route, index) => ({ route, index }))
    .filter(({ route }) => !HIDDEN_TABS.includes(route.name));

  return (
    <View style={[styles.tabbar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {visibleRoutes.map(({ route, index }) => {
        const isFocused = state.index === index;
        const iconName = ICONS[route.name] || 'ellipse-outline';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tab}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFocused ? iconName.replace('-outline', '') : iconName}
              size={22}
              color={isFocused ? colors.goldDeep : colors.inkFaint}
            />

            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
              {route.name}
            </Text>

            {isFocused && <View style={styles.dot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: fonts.sansMedium,
    color: colors.inkFaint,
  },
  tabLabelActive: {
    color: colors.goldDeep,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gold,
    marginTop: 2,
  },
});
