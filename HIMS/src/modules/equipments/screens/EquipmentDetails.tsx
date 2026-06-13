import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

import EquipmentAPI from '../../../services/api';

export default function EquipmentDetails() {
  const route = useRoute<any>();
  const { id } = route.params;

  const [loading, setLoading] = useState(true);
  const [equipment, setEquipment] = useState<any>(null);

  const loadEquipment = async () => {
    try {
      const res =
        await EquipmentAPI.getEquipmentById(id);

      setEquipment(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipment();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        style={{ marginTop: 50 }}
      />
    );
  }

  if (!equipment) {
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
          {equipment.name}
        </Text>

        <Text style={styles.label}>
          Equipment Code
        </Text>
        <Text>{equipment.equipment_code}</Text>

        <Text style={styles.label}>
          Type
        </Text>
        <Text>{equipment.type}</Text>

        <Text style={styles.label}>
          Manufacturer
        </Text>
        <Text>
          {equipment.manufacturer || '-'}
        </Text>

        <Text style={styles.label}>
          Model Number
        </Text>
        <Text>
          {equipment.model_number || '-'}
        </Text>

        <Text style={styles.label}>
          Serial Number
        </Text>
        <Text>
          {equipment.serial_number || '-'}
        </Text>

        <Text style={styles.label}>
          Installation Date
        </Text>
        <Text>
          {equipment.installation_date || '-'}
        </Text>

        <Text style={styles.label}>
          Location
        </Text>
        <Text>
          {equipment.location || '-'}
        </Text>

        <Text style={styles.label}>
          Condition Status
        </Text>
        <Text>
          {equipment.condition_status}
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
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
  },
  label: {
    marginTop: 10,
    fontWeight: '600',
  },
});