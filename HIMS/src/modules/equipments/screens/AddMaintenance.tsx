import React, { useEffect, useState } from 'react';
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

import EquipmentAPI, {
  MaintenanceAPI,
} from '../../../services/api';

export default function AddMaintenance() {
  const [loading, setLoading] = useState(false);

  const [equipmentList, setEquipmentList] = useState<any[]>([]);

  const [form, setForm] = useState({
    equipment_id: '',
    maintenance_type: '',
    maintenance_date: new Date(),
    technician: '',
    description: '',
    status: 'Pending',
  });

  const [showDate, setShowDate] = useState(false);

  const update = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  /* ================= LOAD EQUIPMENT ================= */

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = async () => {
    try {
      const res = await EquipmentAPI.getEquipment();

      setEquipmentList(res.data || []);
    } catch (error) {
      console.log('Equipment Load Error:', error);
    }
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    try {
      if (!form.equipment_id || !form.maintenance_type) {
        Alert.alert(
          'Error',
          'Please select equipment and maintenance type'
        );
        return;
      }

      setLoading(true);

      await MaintenanceAPI.createMaintenance({
        equipment_id: form.equipment_id,
        maintenance_type: form.maintenance_type,
        maintenance_date: form.maintenance_date
          .toISOString()
          .split('T')[0],
        technician: form.technician,
        description: form.description,
        status: form.status,
      });

      Alert.alert(
        'Success',
        'Maintenance Logged Successfully'
      );

      setForm({
        equipment_id: '',
        maintenance_type: '',
        maintenance_date: new Date(),
        technician: '',
        description: '',
        status: 'Pending',
      });

    } catch (error: any) {
      console.log('Maintenance Save Error:', error);

      Alert.alert(
        'Error',
        error?.message || 'Failed to save maintenance'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>

      {/* Maintenance Details */}

      <View style={styles.card}>
        <Text style={styles.title}>
          Maintenance Details
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

            {equipmentList.map((item) => (
              <Picker.Item
                key={item.id}
                label={`${item.name} (${item.equipment_code})`}
                value={item.id}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>
          Maintenance Type *
        </Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.maintenance_type}
            onValueChange={(value) =>
              update('maintenance_type', value)
            }
          >
            <Picker.Item
              label="Select"
              value=""
            />
            <Picker.Item
              label="Preventive"
              value="Preventive"
            />
            <Picker.Item
              label="Corrective"
              value="Corrective"
            />
          </Picker>
        </View>

        <Text style={styles.label}>
          Date *
        </Text>

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDate(true)}
        >
          <Text>
            {form.maintenance_date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {showDate && (
          <DateTimePicker
            value={form.maintenance_date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDate(false);

              if (
                event.type === 'set' &&
                selectedDate
              ) {
                update(
                  'maintenance_date',
                  selectedDate
                );
              }
            }}
          />
        )}
      </View>

      {/* Additional Info */}

      <View style={styles.card}>
        <Text style={styles.title}>
          Additional Info
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
          Status *
        </Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.status}
            onValueChange={(value) =>
              update('status', value)
            }
          >
            <Picker.Item
              label="Pending"
              value="Pending"
            />
            <Picker.Item
              label="Completed"
              value="Completed"
            />
          </Picker>
        </View>

        <Text style={styles.label}>
          Description
        </Text>

        <TextInput
          style={[
            styles.input,
            { height: 100 },
          ]}
          multiline
          value={form.description}
          onChangeText={(text) =>
            update('description', text)
          }
        />
      </View>

      <TouchableOpacity
        style={[
          styles.saveBtn,
          loading && { opacity: 0.6 },
        ]}
        onPress={handleSave}
        disabled={loading}
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
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
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

  pickerWrapper: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
  },

  saveBtn: {
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