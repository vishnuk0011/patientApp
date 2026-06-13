import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

import { BreakdownAPI } from '../../../services/api';

export default function BreakdownDetails() {
  const route = useRoute<any>();
  const { id } = route.params;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    loadBreakdown();
  }, []);

  const loadBreakdown = async () => {
    try {
      const res = await BreakdownAPI.getBreakdownById(id);

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
        <Text>No Breakdown Found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          Breakdown Details
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
            Breakdown Date:
          </Text>
          <Text>{data.breakdown_date}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Reported By:
          </Text>
          <Text>{data.reported_by}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Severity:
          </Text>
          <Text
            style={{
              color:
                data.severity === 'High'
                  ? 'red'
                  : data.severity === 'Medium'
                  ? 'orange'
                  : 'green',
              fontWeight: '600',
            }}
          >
            {data.severity}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Status:
          </Text>
          <Text>{data.status}</Text>
        </View>

        <View style={styles.notesBox}>
          <Text style={styles.label}>
            Description
          </Text>

          <Text>
            {data.description ||
              'No description available'}
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