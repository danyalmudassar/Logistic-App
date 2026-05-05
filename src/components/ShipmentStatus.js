import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, SIZES } from '../constants/theme';
import { Check } from 'lucide-react-native';

const STATUS_STEPS = [
  'Order Placed',
  'Pending Finance',
  'In Process',
  'In Transit',
  'Customs Clearance',
  'Delivered',
];

const ShipmentStatus = ({ currentStatus }) => {
  const currentIndex = STATUS_STEPS.indexOf(currentStatus);

  return (
    <View style={styles.container}>
      {STATUS_STEPS.map((step, index) => {
        const isCompleted = index < currentIndex || currentStatus === 'Completed';
        const isCurrent = index === currentIndex;

        return (
          <View key={step} style={styles.stepContainer}>
            <View style={styles.leftColumn}>
              <View style={[
                styles.circle,
                isCompleted && styles.completedCircle,
                isCurrent && styles.currentCircle,
              ]}>
                {isCompleted ? (
                  <Check size={14} color={COLORS.surface} />
                ) : (
                  <View style={[styles.innerCircle, isCurrent && styles.currentInnerCircle]} />
                )}
              </View>
              {index < STATUS_STEPS.length - 1 && (
                <View style={[
                  styles.line,
                  isCompleted && styles.completedLine
                ]} />
              )}
            </View>
            <View style={styles.rightColumn}>
              <Text style={[
                styles.stepText,
                (isCompleted || isCurrent) && styles.activeStepText
              ]}>{step}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
  },
  stepContainer: {
    flexDirection: 'row',
    height: 50,
  },
  leftColumn: {
    alignItems: 'center',
    width: 30,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    zIndex: 1,
  },
  completedCircle: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  currentCircle: {
    borderColor: COLORS.primary,
  },
  innerCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  currentInnerCircle: {
    backgroundColor: COLORS.primary,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.border,
    position: 'absolute',
    top: 24,
    bottom: 0,
  },
  completedLine: {
    backgroundColor: COLORS.success,
  },
  rightColumn: {
    marginLeft: SPACING.md,
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  stepText: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  activeStepText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
});

export default ShipmentStatus;
