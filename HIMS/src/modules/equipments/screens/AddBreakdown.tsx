import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

import EquipmentAPI, { BreakdownAPI } from '../../../services/api';

export default function AddBreakdown() {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(false);
  const [equipment, setEquipment] = useState<any[]>([]);

  const [form, setForm] = useState({
    equipment_id: '',
    description: '',
    reported_by: '',
    breakdown_date: new Date(),
    severity: 'Low',
    status: 'Reported',
  });

  const [showDate, setShowDate] = useState(false);

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
      if (
        !form.equipment_id ||
        !form.description ||
        !form.reported_by
      ) {
        Alert.alert('Error', 'Please fill all required fields');
        return;
      }

      setLoading(true);

      await BreakdownAPI.createBreakdown({
        equipment_id: form.equipment_id,
        description: form.description,
        reported_by: form.reported_by,
        breakdown_date: form.breakdown_date
          .toISOString()
          .split('T')[0],
        severity: form.severity,
        status: form.status,
      });

      Alert.alert('Success', 'Breakdown Recorded');

      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.message || 'Failed to save'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Breakdown Details
        </Text>

        <Text style={styles.label}>Equipment *</Text>

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

            {equipment.map((item) => (
              <Picker.Item
                key={item.id}
                label={`${item.name} (${item.equipment_code})`}
                value={item.id}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Description *</Text>

        <TextInput
          style={[styles.input, { height: 100 }]}
          multiline
          value={form.description}
          onChangeText={(text) =>
            update('description', text)
          }
        />

        <Text style={styles.label}>Breakdown Date *</Text>

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDate(true)}
        >
          <Text>
            {form.breakdown_date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {showDate && (
          <DateTimePicker
            value={form.breakdown_date}
            mode="date"
            onChange={(e, date) => {
              setShowDate(false);

              if (date) {
                update('breakdown_date', date);
              }
            }}
          />
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Additional Info
        </Text>

        <Text style={styles.label}>Reported By *</Text>

        <TextInput
          style={styles.input}
          value={form.reported_by}
          onChangeText={(text) =>
            update('reported_by', text)
          }
        />

        <Text style={styles.label}>Severity *</Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.severity}
            onValueChange={(value) =>
              update('severity', value)
            }
          >
            <Picker.Item label="Low" value="Low" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="High" value="High" />
          </Picker>
        </View>

        <Text style={styles.label}>Status *</Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.status}
            onValueChange={(value) =>
              update('status', value)
            }
          >
            <Picker.Item
              label="Reported"
              value="Reported"
            />
            <Picker.Item
              label="Under Repair"
              value="Under Repair"
            />
            <Picker.Item
              label="Resolved"
              value="Resolved"
            />
          </Picker>
        </View>
      </View>

      <TouchableOpacity
        style={styles.saveButton}
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
    backgroundColor: '#f4f6f9',
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 18,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 12,
  },
  pickerWrapper: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
  },
  saveButton: {
    backgroundColor: '#2e59d9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
  },
});