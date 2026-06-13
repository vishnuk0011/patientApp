import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

import { CalibrationAPI } from '../../../services/api';

export default function CalibrationDetails() {
  const route = useRoute<any>();
  const { id } = route.params;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    loadCalibration();
  }, []);

  const loadCalibration = async () => {
    try {
      const res = await CalibrationAPI.getCalibrationById(id);

      setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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
        <Text>No Calibration Found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          Calibration Details
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
            {data.equipment?.equipment_code || '-'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Calibration Type:
          </Text>
          <Text>{data.calibration_type}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Calibration Date:
          </Text>
          <Text>{data.calibration_date}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Technician:
          </Text>
          <Text>{data.technician || '-'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Result:
          </Text>

          <Text
            style={{
              color:
                data.result === 'Pass'
                  ? '#1cc88a'
                  : '#e74a3b',
              fontWeight: '600',
            }}
          >
            {data.result}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Next Due Date:
          </Text>
          <Text>
            {data.next_due_date || '-'}
          </Text>
        </View>

        <View style={styles.notesBox}>
          <Text style={styles.label}>
            Notes
          </Text>

          <Text>
            {data.notes || 'No notes available'}
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
    elevation: 2,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },

  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  label: {
    fontWeight: '600',
    width: 140,
  },

  notesBox: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});