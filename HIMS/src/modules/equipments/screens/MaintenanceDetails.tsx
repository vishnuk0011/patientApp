import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import { useRoute } from '@react-navigation/native';

import { MaintenanceAPI } from '../../../services/api';

export default function MaintenanceDetails() {
  const route = useRoute<any>();
  const { id } = route.params;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const loadDetails = async () => {
    try {
      const res =
        await MaintenanceAPI.getMaintenanceById(id);

      setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        style={{ marginTop: 50 }}
      />
    );
  }

  if (!data) {
    return (
      <View style={styles.container}>
        <Text>No Data Found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          Maintenance Details
        </Text>

        <Text style={styles.label}>
          Equipment
        </Text>
        <Text>
          {data.equipment?.name}
          {' '}
          ({data.equipment?.equipment_code})
        </Text>

        <Text style={styles.label}>
          Maintenance Type
        </Text>
        <Text>{data.maintenance_type}</Text>

        <Text style={styles.label}>
          Maintenance Date
        </Text>
        <Text>{data.maintenance_date}</Text>

        <Text style={styles.label}>
          Technician
        </Text>
        <Text>{data.technician || '-'}</Text>

        <Text style={styles.label}>
          Status
        </Text>
        <Text>{data.status}</Text>

        <Text style={styles.label}>
          Description
        </Text>
        <Text>
          {data.description || '-'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
    padding: 15,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },

  label: {
    marginTop: 10,
    fontWeight: '600',
  },
});