import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';

import { PreventiveAPI } from '../../../services/api';

export default function EditPreventiveSchedule() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { id } = route.params;

  const [showDate, setShowDate] = useState(false);

  const [form, setForm] = useState({
    frequency: '',
    next_maintenance_date: new Date(),
    technician: '',
  });

  const update = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      const res = await PreventiveAPI.getPreventiveById(id);

      const data = res.data;

      setForm({
        frequency: data.frequency || '',
        next_maintenance_date: data.next_maintenance_date
          ? new Date(data.next_maintenance_date)
          : new Date(),
        technician: data.technician || '',
      });
    } catch (error: any) {
      Alert.alert('Error', error?.message);
    }
  };

  const handleUpdate = async () => {
    try {
      await PreventiveAPI.updatePreventiveSchedule(id, {
        frequency: form.frequency,
        next_maintenance_date:
          form.next_maintenance_date
            .toISOString()
            .split('T')[0],
        technician: form.technician,
      });

      Alert.alert(
        'Success',
        'Schedule Updated Successfully'
      );

      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.message || 'Update Failed'
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          Edit Schedule
        </Text>

        <Text style={styles.label}>
          Frequency
        </Text>

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

        <Text style={styles.label}>
          Next Maintenance Date
        </Text>

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDate(true)}
        >
          <Text>
            {form.next_maintenance_date.toLocaleDateString()}
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
        onPress={handleUpdate}
      >
        <Text style={styles.saveText}>
          UPDATE SCHEDULE
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
    padding: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 6,
  },
  saveBtn: {
    marginTop: 15,
    backgroundColor: '#2e59d9',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
  },
});