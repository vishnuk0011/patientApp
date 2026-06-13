import React, { useState, useEffect } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';

import { CalibrationAPI } from '../../../services/api';

export default function EditCalibration() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { id } = route.params;

  const [showDate, setShowDate] = useState(false);
  const [showNextDate, setShowNextDate] = useState(false);

  const [form, setForm] = useState({
    calibration_type: '',
    calibration_date: new Date(),
    technician: '',
    result: '',
    next_due_date: new Date(),
    notes: '',
  });

  const update = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  useEffect(() => {
    loadCalibration();
  }, []);

  const loadCalibration = async () => {
    try {
      const res = await CalibrationAPI.getCalibrationById(id);

      const data = res.data;

      setForm({
        calibration_type: data.calibration_type || '',
        calibration_date: new Date(data.calibration_date),
        technician: data.technician || '',
        result: data.result || '',
        next_due_date: data.next_due_date
          ? new Date(data.next_due_date)
          : new Date(),
        notes: data.notes || '',
      });
    } catch (error: any) {
      Alert.alert('Error', error?.message);
    }
  };

  const handleUpdate = async () => {
    try {
      await CalibrationAPI.updateCalibration(id, {
        calibration_type: form.calibration_type,
        calibration_date: form.calibration_date
          .toISOString()
          .split('T')[0],
        technician: form.technician,
        result: form.result,
        next_due_date: form.next_due_date
          .toISOString()
          .split('T')[0],
        notes: form.notes,
      });

      Alert.alert('Success', 'Calibration Updated');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error?.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Edit Calibration</Text>

        <Text style={styles.label}>Calibration Type</Text>
        <Picker
          selectedValue={form.calibration_type}
          onValueChange={(v) =>
            update('calibration_type', v)
          }
        >
          <Picker.Item label="Internal" value="Internal" />
          <Picker.Item label="External" value="External" />
        </Picker>

        <Text style={styles.label}>Calibration Date</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDate(true)}
        >
          <Text>
            {form.calibration_date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {showDate && (
          <DateTimePicker
            value={form.calibration_date}
            mode="date"
            onChange={(e, date) => {
              setShowDate(false);
              if (date) update('calibration_date', date);
            }}
          />
        )}

        <Text style={styles.label}>Technician</Text>
        <TextInput
          style={styles.input}
          value={form.technician}
          onChangeText={(t) =>
            update('technician', t)
          }
        />

        <Text style={styles.label}>Result</Text>
        <Picker
          selectedValue={form.result}
          onValueChange={(v) =>
            update('result', v)
          }
        >
          <Picker.Item label="Pass" value="Pass" />
          <Picker.Item label="Fail" value="Fail" />
        </Picker>

        <Text style={styles.label}>Next Due Date</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowNextDate(true)}
        >
          <Text>
            {form.next_due_date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {showNextDate && (
          <DateTimePicker
            value={form.next_due_date}
            mode="date"
            onChange={(e, date) => {
              setShowNextDate(false);
              if (date) update('next_due_date', date);
            }}
          />
        )}

        <Text style={styles.label}>Notes</Text>
        <TextInput
          multiline
          style={[styles.input, { height: 100 }]}
          value={form.notes}
          onChangeText={(t) => update('notes', t)}
        />
      </View>

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleUpdate}
      >
        <Text style={{ color: '#fff' }}>
          UPDATE CALIBRATION
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#f4f6f9', padding: 15 },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
  },
  title: {
    fontWeight: '600',
    marginBottom: 10,
  },
  label: {
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 6,
  },
  saveBtn: {
    marginTop: 15,
    backgroundColor: '#2e59d9',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
});