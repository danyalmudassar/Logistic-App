import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { COLORS, SPACING, SIZES } from '../src/constants/theme';
import { useShipmentStore } from '../src/context/shipmentStore';

export default function CreateShipment() {
  const router = useRouter();
  const addShipment = useShipmentStore((state) => state.addShipment);

  const [form, setForm] = useState({
    label: '',
    freightType: 'Sea',
    expectedCost: '',
    clearanceCost: '',
    lcRequired: false,
    lcCost: '',
    expectedEta: '',
  });

  const handleSave = () => {
    if (!form.label || !form.expectedCost || !form.expectedEta) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const totalExpected = parseFloat(form.expectedCost) + 
                          parseFloat(form.clearanceCost || 0) + 
                          parseFloat(form.lcCost || 0);

    const newShipment = {
      ...form,
      expectedCost: totalExpected,
      status: 'Pending Finance',
      createdAt: new Date().toISOString(),
    };

    addShipment(newShipment);
    Alert.alert('Success', 'Shipment created and sent for Finance approval', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'Create Shipment' }} />
      
      <View style={styles.section}>
        <Text style={styles.label}>Shipment Name / Label *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Electronics Batch A"
          value={form.label}
          onChangeText={(text) => setForm({ ...form, label: text })}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Freight Type</Text>
        <View style={styles.tabContainer}>
          {['Air', 'Sea', 'Road'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.tab,
                form.freightType === type && styles.activeTab
              ]}
              onPress={() => setForm({ ...form, freightType: type })}
            >
              <Text style={[
                styles.tabText,
                form.freightType === type && styles.activeTabText
              ]}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Base Freight Cost ($) *</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          keyboardType="numeric"
          value={form.expectedCost}
          onChangeText={(text) => setForm({ ...form, expectedCost: text })}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Clearance Cost ($)</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          keyboardType="numeric"
          value={form.clearanceCost}
          onChangeText={(text) => setForm({ ...form, clearanceCost: text })}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.switchRow}>
          <Text style={styles.label}>LC (Letter of Credit) Required?</Text>
          <Switch
            value={form.lcRequired}
            onValueChange={(val) => setForm({ ...form, lcRequired: val })}
            trackColor={{ false: COLORS.border, true: COLORS.finance }}
          />
        </View>
        {form.lcRequired && (
          <TextInput
            style={[styles.input, { marginTop: SPACING.sm }]}
            placeholder="LC Processing Fee ($)"
            keyboardType="numeric"
            value={form.lcCost}
            onChangeText={(text) => setForm({ ...form, lcCost: text })}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Expected ETA (YYYY-MM-DD) *</Text>
        <TextInput
          style={styles.input}
          placeholder="2026-06-01"
          value={form.expectedEta}
          onChangeText={(text) => setForm({ ...form, expectedEta: text })}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Submit for Approval</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: SIZES.fontSm,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: SPACING.md,
    fontSize: SIZES.fontMd,
    color: COLORS.text,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: SIZES.radius - 2,
  },
  activeTab: {
    backgroundColor: COLORS.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: SIZES.fontSm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  buttonText: {
    color: COLORS.surface,
    fontSize: SIZES.fontMd,
    fontWeight: 'bold',
  },
});
