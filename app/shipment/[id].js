import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, DollarSign, Calendar, AlertTriangle, ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react-native';
import { COLORS, SPACING, SIZES } from '../../src/constants/theme';
import ShipmentStatus from '../../src/components/ShipmentStatus';
import { useShipmentStore } from '../../src/context/shipmentStore';

export default function ShipmentDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { shipments, updateShipment } = useShipmentStore();
  const shipment = shipments.find(s => s.id === id);

  const [modalVisible, setModalVisible] = useState(false);
  const [actuals, setActuals] = useState({
    actualCost: '',
    actualArrival: '',
    gapReason: '',
  });

  if (!shipment) {
    return (
      <View style={styles.centered}>
        <Text>Shipment not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: COLORS.primary, marginTop: SPACING.md }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleFinanceApproval = () => {
    Alert.alert(
      'Finance Approval',
      'Confirm approval for this shipment and LC costs?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Approve', 
          onPress: () => {
            updateShipment(id, { status: 'In Process' });
            Alert.alert('Success', 'Shipment approved and moved to In Process');
          }
        }
      ]
    );
  };

  const handleUpdateStatus = () => {
      const nextStatus = {
          'In Process': 'In Transit',
          'In Transit': 'Customs Clearance',
          'Customs Clearance': 'COMPLETE_UI', // Trigger complete modal
      };

      const next = nextStatus[shipment.status];
      if (next === 'COMPLETE_UI') {
          setModalVisible(true);
      } else if (next) {
          updateShipment(id, { status: next });
      }
  };

  const handleComplete = () => {
    const cost = parseFloat(actuals.actualCost);
    if (isNaN(cost) || !actuals.actualArrival) {
      Alert.alert('Error', 'Please enter valid actual cost and arrival date');
      return;
    }

    const variancePercent = Math.abs((cost - shipment.expectedCost) / shipment.expectedCost) * 100;
    
    if (variancePercent > 5 && !actuals.gapReason) {
      Alert.alert('Mandatory Requirement', 'Variance is >5%. Please provide a Reason for Gap as per PRD Section 3.3.');
      return;
    }

    updateShipment(id, {
      status: 'Completed',
      actualCost: cost,
      actualArrival: actuals.actualArrival,
      gapReason: actuals.gapReason,
    });
    setModalVisible(false);
    Alert.alert('Success', 'Shipment marked as Completed');
  };

  const costGap = shipment.actualCost ? shipment.actualCost - shipment.expectedCost : null;
  const isCostOver = costGap > 0;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
          title: shipment.label,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: SPACING.xs }}>
              <ArrowLeft size={24} color={COLORS.text} />
            </TouchableOpacity>
          )
      }} />
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Actions Section */}
        <View style={styles.actionsRow}>
            {shipment.status === 'Pending Finance' && (
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.finance }]} onPress={handleFinanceApproval}>
                    <CheckCircle size={18} color={COLORS.surface} style={{ marginRight: SPACING.xs }} />
                    <Text style={styles.actionButtonText}>Finance Approve</Text>
                </TouchableOpacity>
            )}
            {['In Process', 'In Transit', 'Customs Clearance'].includes(shipment.status) && (
                <TouchableOpacity style={styles.actionButton} onPress={handleUpdateStatus}>
                    <ArrowRight size={18} color={COLORS.surface} style={{ marginRight: SPACING.xs }} />
                    <Text style={styles.actionButtonText}>
                        {shipment.status === 'Customs Clearance' ? 'Mark Completed' : 'Next Status'}
                    </Text>
                </TouchableOpacity>
            )}
        </View>

        {/* Status Bar Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Status</Text>
          <ShipmentStatus currentStatus={shipment.status} />
        </View>

        {/* Live Map Placeholder */}
        <View style={[styles.card, styles.mapCard]}>
          <View style={styles.mapPlaceholder}>
            <MapPin size={40} color={COLORS.secondary} />
            <Text style={styles.mapText}>Live Tracking Map Placeholder</Text>
            <Text style={styles.mapSubtext}>Integration with Google Maps Platform</Text>
          </View>
        </View>

        {/* Cost & Time Analysis */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cost & Time Analysis</Text>
          
          <View style={styles.analysisRow}>
            <View style={styles.analysisItem}>
              <View style={styles.iconLabel}>
                <DollarSign size={16} color={COLORS.textSecondary} />
                <Text style={styles.analysisLabel}>Expected Cost</Text>
              </View>
              <Text style={styles.analysisValue}>${shipment.expectedCost.toLocaleString()}</Text>
            </View>
            <View style={styles.analysisItem}>
              <View style={styles.iconLabel}>
                <Calendar size={16} color={COLORS.textSecondary} />
                <Text style={styles.analysisLabel}>Expected ETA</Text>
              </View>
              <Text style={styles.analysisValue}>{shipment.expectedEta}</Text>
            </View>
          </View>

          <View style={[styles.analysisRow, { borderTopWidth: 1, borderColor: COLORS.border, paddingTop: SPACING.md }]}>
            <View style={styles.analysisItem}>
              <View style={styles.iconLabel}>
                <DollarSign size={16} color={COLORS.textSecondary} />
                <Text style={styles.analysisLabel}>Actual Cost</Text>
              </View>
              <Text style={styles.analysisValue}>
                {shipment.actualCost ? `$${shipment.actualCost.toLocaleString()}` : 'Pending...'}
              </Text>
            </View>
            <View style={styles.analysisItem}>
              <View style={styles.iconLabel}>
                <Calendar size={16} color={COLORS.textSecondary} />
                <Text style={styles.analysisLabel}>Actual Arrival</Text>
              </View>
              <Text style={styles.analysisValue}>
                {shipment.actualArrival || 'Pending...'}
              </Text>
            </View>
          </View>
        </View>

        {/* Gap Analysis */}
        {shipment.actualCost && (
          <View style={[styles.card, isCostOver ? styles.errorCard : styles.successCard]}>
            <View style={styles.gapHeader}>
              <AlertTriangle size={20} color={isCostOver ? COLORS.error : COLORS.success} />
              <Text style={[styles.cardTitle, { marginBottom: 0, marginLeft: SPACING.xs }]}>Gap Analysis</Text>
            </View>
            
            <View style={styles.gapMetrics}>
              <Text style={styles.gapText}>
                Variance: <Text style={{ fontWeight: 'bold' }}>${Math.abs(costGap).toLocaleString()}</Text> 
                ({isCostOver ? 'Over' : 'Under'} budget)
              </Text>
              <Text style={styles.gapReasonLabel}>Reason for Gap:</Text>
              <Text style={styles.gapReasonValue}>{shipment.gapReason || 'No reason provided'}</Text>
            </View>
          </View>
        )}

      </ScrollView>

      {/* Completion Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Complete Shipment</Text>
            
            <Text style={styles.modalLabel}>Actual Final Cost ($)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="0.00"
              keyboardType="numeric"
              value={actuals.actualCost}
              onChangeText={(text) => setActuals({ ...actuals, actualCost: text })}
            />

            <Text style={styles.modalLabel}>Actual Arrival Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="2026-05-05"
              value={actuals.actualArrival}
              onChangeText={(text) => setActuals({ ...actuals, actualArrival: text })}
            />

            <Text style={styles.modalLabel}>Reason for Gap (Mandatory if >5% variance)</Text>
            <TextInput
              style={[styles.modalInput, { height: 80 }]}
              placeholder="e.g., Customs Delay, Fuel Surcharge"
              multiline
              value={actuals.gapReason}
              onChangeText={(text) => setActuals({ ...actuals, gapReason: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleComplete}>
                <Text style={styles.confirmButtonText}>Complete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsRow: {
      flexDirection: 'row',
      marginBottom: SPACING.md,
  },
  actionButton: {
      backgroundColor: COLORS.primary,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderRadius: SIZES.radius,
      marginRight: SPACING.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
  },
  actionButtonText: {
      color: COLORS.surface,
      fontWeight: 'bold',
      fontSize: SIZES.fontSm,
  },
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
  },
  cardTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  mapCard: {
    height: 200,
    padding: 0,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    marginTop: SPACING.sm,
    fontSize: SIZES.fontMd,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  mapSubtext: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
  },
  analysisRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  analysisItem: {
    flex: 1,
  },
  iconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  analysisLabel: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  analysisValue: {
    fontSize: SIZES.fontLg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  errorCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  successCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  gapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  gapMetrics: {
    marginTop: SPACING.xs,
  },
  gapText: {
    fontSize: SIZES.fontMd,
    color: COLORS.text,
  },
  gapReasonLabel: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    fontWeight: 'bold',
  },
  gapReasonValue: {
    fontSize: SIZES.fontMd,
    color: COLORS.text,
    fontStyle: 'italic',
  },
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      padding: SPACING.md,
  },
  modalContent: {
      backgroundColor: COLORS.surface,
      borderRadius: SIZES.radius,
      padding: SPACING.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 5,
  },
  modalTitle: {
      fontSize: SIZES.fontLg,
      fontWeight: 'bold',
      color: COLORS.text,
      marginBottom: SPACING.md,
  },
  modalLabel: {
      fontSize: SIZES.fontSm,
      fontWeight: '600',
      color: COLORS.textSecondary,
      marginBottom: SPACING.xs,
      marginTop: SPACING.sm,
  },
  modalInput: {
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: SIZES.radius / 2,
      padding: SPACING.sm,
      fontSize: SIZES.fontMd,
  },
  modalButtons: {
      flexDirection: 'row',
      marginTop: SPACING.lg,
      justifyContent: 'flex-end',
  },
  modalButton: {
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.sm,
      borderRadius: SIZES.radius,
      marginLeft: SPACING.sm,
  },
  cancelButton: {
      backgroundColor: COLORS.border,
  },
  confirmButton: {
      backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
      color: COLORS.text,
      fontWeight: '600',
  },
  confirmButtonText: {
      color: COLORS.surface,
      fontWeight: 'bold',
  },
});
