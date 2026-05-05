import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, SIZES } from '../constants/theme';

const DashboardCard = ({ title, value, icon: Icon, color, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.card, { borderLeftColor: color || COLORS.primary }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {Icon && <Icon size={20} color={color || COLORS.primary} />}
      </View>
      <Text style={[styles.value, { color: color || COLORS.primary }]}>{value}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderLeftWidth: 4,
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  value: {
    fontSize: SIZES.fontXl,
    fontWeight: 'bold',
  },
});

export default DashboardCard;
