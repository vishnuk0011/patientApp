import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import {
  EquipmentAPI,
  PreventiveAPI,
} from '../../../services/api';

export default function AddSchedule() {
  const [loading, setLoading] = useState(false);

  const [equipment, setEquipment] = useState<any[]>([]);

  const [showDate, setShowDate] = useState(false);

  const [form, setForm] = useState({
    equipment_id: '',
    frequency: 'Monthly',
    next_maintenance_date: new Date(),
    technician: '',
  });

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = async () => {
    try {
      const res = await EquipmentAPI.getEquipment();
      setEquipment(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const update = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const handleSave = async () => {
    try {
      if (!form.equipment_id) {
        Alert.alert('Error', 'Select Equipment');
        return;
      }

      setLoading(true);

      await PreventiveAPI.createPreventiveSchedule({
        equipment_id: form.equipment_id,
        frequency: form.frequency,
        next_maintenance_date:
          form.next_maintenance_date
            .toISOString()
            .split('T')[0],
        technician: form.technician,
      });

      Alert.alert(
        'Success',
        'Preventive Schedule Created'
      );

      setForm({
        equipment_id: '',
        frequency: 'Monthly',
        next_maintenance_date: new Date(),
        technician: '',
      });

    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.message || 'Failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Schedule Details
        </Text>

        <Text style={styles.label}>
          Equipment *
        </Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.equipment_id}
            onValueChange={(value) =>
              update('equipment_id', value)
            }
          >
            <Picker.Item
              label="Select Equipment"
              value=""
            />

            {equipment.map((eq) => (
              <Picker.Item
                key={eq.id}
                label={`${eq.name} (${eq.equipment_code})`}
                value={eq.id}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>
          Frequency *
        </Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.frequency}
            onValueChange={(value) =>
              update('frequency', value)
            }
          >
            <Picker.Item
              label="Monthly"
              value="Monthly"
            />
            <Picker.Item
              label="Quarterly"
              value="Quarterly"
            />
            <Picker.Item
              label="Yearly"
              value="Yearly"
            />
          </Picker>
        </View>

        <Text style={styles.label}>
          Next Date *
        </Text>

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDate(true)}
        >
          <Text>
            {form.next_maintenance_date
              .toISOString()
              .split('T')[0]}
          </Text>
        </TouchableOpacity>

        {showDate && (
          <DateTimePicker
            value={form.next_maintenance_date}
            mode="date"
            onChange={(e, date) => {
              setShowDate(false);

              if (date) {
                update(
                  'next_maintenance_date',
                  date
                );
              }
            }}
          />
        )}

        <Text style={styles.label}>
          Technician
        </Text>

        <TextInput
          style={styles.input}
          value={form.technician}
          onChangeText={(text) =>
            update('technician', text)
          }
        />
      </View>

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}
      >
        <Text style={styles.saveText}>
          {loading ? 'Saving...' : 'SAVE'}
        </Text>
      </TouchableOpacity>

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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  label: {
    marginTop: 12,
    marginBottom: 5,
  },
  pickerWrapper: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 6,
  },
  saveBtn: {
    marginTop: 20,
    backgroundColor: '#2e59d9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
  },
});