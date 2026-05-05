import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Truck, Airplay, Ship, ChevronRight } from 'lucide-react-native';
import { COLORS, SPACING, SIZES } from '../src/constants/theme';
import { useShipmentStore } from '../src/context/shipmentStore';

export default function Reports() {
  const router = useRouter();
  const { shipments } = useShipmentStore();

  const renderItem = ({ item }) => {
    const Icon = item.freightType === 'Air' ? Airplay : (item.freightType === 'Sea' ? Ship : Truck);
    
    const getStatusColor = (status) => {
        switch(status) {
            case 'Completed': return COLORS.success;
            case 'In Transit': return COLORS.secondary;
            case 'Pending Finance': return COLORS.finance;
            default: return COLORS.warning;
        }
    };

    return (
      <TouchableOpacity 
        style={styles.shipmentItem}
        onPress={() => router.push(`/shipment/${item.id}`)}
      >
        <View style={[styles.iconContainer, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Icon size={24} color={getStatusColor(item.status)} />
        </View>
        <View style={styles.shipmentInfo}>
          <Text style={styles.shipmentLabel}>{item.label}</Text>
          <Text style={styles.shipmentSubtext}>{item.freightType} • {item.expectedEta}</Text>
        </View>
        <View style={styles.shipmentRight}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          <ChevronRight size={20} color={COLORS.border} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Shipment Reports' }} />
      <FlatList
        data={shipments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No shipments found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.md,
  },
  shipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: SIZES.radius,
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  shipmentInfo: {
    flex: 1,
  },
  shipmentLabel: {
    fontSize: SIZES.fontMd,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  shipmentSubtext: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  shipmentRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: SPACING.xs,
  },
  statusText: {
    color: COLORS.surface,
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.fontMd,
  },
});
