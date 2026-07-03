import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, fonts, radii } from '../theme/theme';

export function PillButton({ label, icon, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.pillBtn, style]} onPress={onPress} activeOpacity={0.85}>
      {icon}
      <Text style={styles.pillBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function PillButtonOutline({ label, icon, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.pillBtnOutline, style]} onPress={onPress} activeOpacity={0.7}>
      {icon}
      <Text style={styles.pillBtnOutlineText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.ink,
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: radii.pill,
  },
  pillBtnText: {
    color: colors.paper,
    fontSize: 14,
    fontFamily: fonts.sansSemiBold,
  },
  pillBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: radii.pill,
    borderWidth: 1.3,
    borderColor: colors.line,
  },
  pillBtnOutlineText: {
    color: colors.ink,
    fontSize: 14,
    fontFamily: fonts.sansSemiBold,
  },
});
