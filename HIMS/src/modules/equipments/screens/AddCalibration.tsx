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

import {
  CalibrationAPI,
  EquipmentAPI,
} from '../../../services/api';

export default function AddCalibration() {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(false);
  const [equipment, setEquipment] = useState<any[]>([]);

  const [form, setForm] = useState({
    equipment_id: '',
    calibration_type: '',
    calibration_date: new Date(),
    technician: '',
    result: 'Pass',
    next_due_date: new Date(),
    notes: '',
  });

  const [showDate, setShowDate] = useState(false);
  const [showNextDate, setShowNextDate] = useState(false);

  const update = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  /* ================= LOAD EQUIPMENT ================= */

  const loadEquipment = async () => {
    try {
      const res = await EquipmentAPI.getEquipment();

      setEquipment(res.data || []);

      console.log('EQUIPMENT LIST:', res.data);
    } catch (error: any) {
      console.log(error);
      Alert.alert(
        'Error',
        error?.message || 'Failed to load equipment'
      );
    }
  };

  useEffect(() => {
    loadEquipment();
  }, []);

  /* ================= SAVE ================= */

  const handleSave = async () => {
    try {
      if (
        !form.equipment_id ||
        !form.calibration_type ||
        !form.result
      ) {
        Alert.alert(
          'Error',
          'Please fill required fields'
        );
        return;
      }

      setLoading(true);

      await CalibrationAPI.createCalibration({
        equipment_id: form.equipment_id,
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

      Alert.alert(
        'Success',
        'Calibration Saved Successfully'
      );

      setForm({
        equipment_id: '',
        calibration_type: '',
        calibration_date: new Date(),
        technician: '',
        result: 'Pass',
        next_due_date: new Date(),
        notes: '',
      });

      navigation.goBack();
    } catch (error: any) {
      console.log(error);

      Alert.alert(
        'Error',
        error?.message || 'Failed to save calibration'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* CALIBRATION DETAILS */}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Calibration Details
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

            {equipment.map((item) => (
              <Picker.Item
                key={item.id}
                label={`${item.name} (${item.equipment_code})`}
                value={item.id}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>
          Calibration Type *
        </Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.calibration_type}
            onValueChange={(value) =>
              update('calibration_type', value)
            }
          >
            <Picker.Item
              label="Select Type"
              value=""
            />
            <Picker.Item
              label="Internal"
              value="Internal"
            />
            <Picker.Item
              label="External"
              value="External"
            />
          </Picker>
        </View>

        <Text style={styles.label}>
          Calibration Date *
        </Text>

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
            display="default"
            onChange={(event, date) => {
              setShowDate(false);

              if (date) {
                update(
                  'calibration_date',
                  date
                );
              }
            }}
          />
        )}
      </View>

      {/* RESULT & INFO */}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Result & Info
        </Text>

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

        <Text style={styles.label}>
          Result *
        </Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.result}
            onValueChange={(value) =>
              update('result', value)
            }
          >
            <Picker.Item
              label="Pass"
              value="Pass"
            />
            <Picker.Item
              label="Fail"
              value="Fail"
            />
          </Picker>
        </View>

        <Text style={styles.label}>
          Next Due Date
        </Text>

        <TouchableOpacity
          style={styles.input}
          onPress={() =>
            setShowNextDate(true)
          }
        >
          <Text>
            {form.next_due_date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {showNextDate && (
          <DateTimePicker
            value={form.next_due_date}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowNextDate(false);

              if (date) {
                update(
                  'next_due_date',
                  date
                );
              }
            }}
          />
        )}

        <Text style={styles.label}>
          Notes
        </Text>

        <TextInput
          style={[
            styles.input,
            { height: 100 },
          ]}
          multiline
          value={form.notes}
          onChangeText={(text) =>
            update('notes', text)
          }
        />
      </View>

      {/* SAVE */}

      <TouchableOpacity
        style={[
          styles.saveButton,
          loading && {
            opacity: 0.6,
          },
        ]}
        disabled={loading}
        onPress={handleSave}
      >
        <Text style={styles.saveText}>
          {loading
            ? 'Saving...'
            : 'SAVE CALIBRATION'}
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
    marginBottom: 18,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },

  label: {
    fontSize: 13,
    marginTop: 10,
    marginBottom: 6,
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