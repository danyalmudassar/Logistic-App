import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Truck, Package, CheckCircle, Clock, PlusCircle, TrendingUp, DollarSign } from 'lucide-react-native';
import { COLORS, SPACING, SIZES } from '../src/constants/theme';
import DashboardCard from '../src/components/DashboardCard';
import { useShipmentStore } from '../src/context/shipmentStore';

export default function Dashboard() {
  const router = useRouter();
  const { shipments } = useShipmentStore();

  const inTransit = shipments.filter(s => s.status === 'In Transit').length;
  const inProcess = shipments.filter(s => s.status === 'In Process').length;
  const completed = shipments.filter(s => s.status === 'Completed').length;
  const pendingFinance = shipments.filter(s => s.status === 'Pending Finance').length;

  const currentMonth = new Date().getMonth();
  const monthlyCreated = shipments.filter(s => new Date(s.createdAt).getMonth() === currentMonth).length;

  const totalLcCosts = shipments
    .filter(s => s.lcRequired && new Date(s.createdAt).getMonth() === currentMonth)
    .reduce((acc, curr) => acc + (parseFloat(curr.lcCost) || 0), 0);

  const totalCostGap = shipments
    .filter(s => s.status === 'Completed' && s.actualCost)
    .reduce((acc, curr) => acc + (curr.actualCost - curr.expectedCost), 0);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Logistics Dashboard' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome Back,</Text>
          <Text style={styles.subtitle}>Here is your logistics summary</Text>
        </View>

        <View style={styles.row}>
          <DashboardCard 
            title="In Transit" 
            value={inTransit} 
            icon={Truck} 
            color={COLORS.secondary}
          />
          <DashboardCard 
            title="In Process" 
            value={inProcess} 
            icon={Package} 
            color={COLORS.warning}
          />
        </View>

        <View style={styles.row}>
          <DashboardCard 
            title="Completed" 
            value={completed} 
            icon={CheckCircle} 
            color={COLORS.success}
          />
          <DashboardCard 
            title="Pending Finance" 
            value={pendingFinance} 
            icon={Clock} 
            color={COLORS.finance}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Health (Monthly)</Text>
          <View style={styles.row}>
            <DashboardCard 
                title="Total LC Costs" 
                value={`$${totalLcCosts.toLocaleString()}`} 
                icon={DollarSign} 
                color={COLORS.finance}
            />
            <DashboardCard 
                title="Total Cost Gap" 
                value={`$${totalCostGap.toLocaleString()}`} 
                icon={TrendingUp} 
                color={totalCostGap > 0 ? COLORS.error : COLORS.success}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Performance</Text>
          <View style={styles.monthlyStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Created</Text>
              <Text style={styles.statValue}>{monthlyCreated}</Text>
            </View>
            <View style={[styles.statItem, styles.statBorder]}>
              <Text style={styles.statLabel}>Completed</Text>
              <Text style={styles.statValue}>{completed}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Active</Text>
              <Text style={styles.statValue}>{inTransit + inProcess}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Efficiency Metric</Text>
          <View style={styles.efficiencyCard}>
            <View style={styles.efficiencyInfo}>
                <TrendingUp size={24} color={COLORS.primary} style={{ marginRight: SPACING.sm }} />
                <View>
                    <Text style={styles.efficiencyLabel}>Avg. Cost Variance</Text>
                    <Text style={styles.efficiencySublabel}>Difference between expected and actual</Text>
                </View>
            </View>
            <Text style={styles.efficiencyValue}>+6.2%</Text>
          </View>
        </View>

        <View style={styles.actionContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
                <DashboardCard 
                    title="New Shipment" 
                    value="+" 
                    icon={PlusCircle} 
                    color={COLORS.primary}
                    onPress={() => router.push('/create')}
                />
                <DashboardCard 
                    title="Reports" 
                    value="View" 
                    icon={TrendingUp} 
                    color={COLORS.textSecondary}
                    onPress={() => router.push('/reports')}
                />
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  greeting: {
    fontSize: SIZES.fontXl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: SIZES.fontMd,
    color: COLORS.textSecondary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section: {
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  monthlyStats: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    flexDirection: 'row',
    padding: SPACING.md,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.border,
  },
  statLabel: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: SIZES.fontLg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  efficiencyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  efficiencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  efficiencyLabel: {
    fontSize: SIZES.fontMd,
    fontWeight: '600',
    color: COLORS.text,
  },
  efficiencySublabel: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
  },
  efficiencyValue: {
    fontSize: SIZES.fontLg,
    fontWeight: 'bold',
    color: COLORS.error,
  },
  actionContainer: {
      marginTop: SPACING.lg,
  },
  quickActions: {
      flexDirection: 'row',
  }
});
