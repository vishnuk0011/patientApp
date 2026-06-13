import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

import { PreventiveAPI } from '../../../services/api';

export default function PreventiveDetails() {
  const route = useRoute<any>();
  const { id } = route.params;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
    try {
      const res =
        await PreventiveAPI.getPreventiveById(id);

      setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (date: string) => {
    const today = new Date();
    const nextDate = new Date(date);

    return nextDate < today
      ? 'OVERDUE'
      : 'UPCOMING';
  };

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

  const status = getStatus(
    data.next_maintenance_date
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          Preventive Schedule Details
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>
            Equipment:
          </Text>

          <Text>
            {data.equipment?.name || '-'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Equipment Code:
          </Text>

          <Text>
            {data.equipment?.equipment_code ||
              '-'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Frequency:
          </Text>

          <Text>{data.frequency}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Next Date:
          </Text>

          <Text>
            {data.next_maintenance_date}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Technician:
          </Text>

          <Text>
            {data.technician || '-'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Status:
          </Text>

          <Text
            style={{
              color:
                status === 'OVERDUE'
                  ? '#e74a3b'
                  : '#1cc88a',
              fontWeight: '600',
            }}
          >
            {status}
          </Text>
        </View>
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
    padding: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  label: {
    width: 140,
    fontWeight: '600',
  },
});