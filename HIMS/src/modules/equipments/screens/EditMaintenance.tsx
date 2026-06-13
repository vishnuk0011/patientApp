import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import EquipmentAPI, {
  MaintenanceAPI,
} from '../../../services/api';

export default function EditMaintenance() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { id } = route.params;

  const [loading, setLoading] = useState(false);

  const [equipment, setEquipment] = useState<any[]>([]);

  const [showDate, setShowDate] = useState(false);

  const [form, setForm] = useState({
    equipment_id: '',
    maintenance_type: '',
    maintenance_date: new Date(),
    technician: '',
    description: '',
    status: 'Pending',
  });

  const update = (key: string, value: any) => {
    setForm(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  /* ================= LOAD ================= */

  const loadData = async () => {
    try {
      setLoading(true);

      const [maintenanceRes, equipmentRes] =
        await Promise.all([
          MaintenanceAPI.getMaintenanceById(id),
          EquipmentAPI.getEquipment(),
        ]);

      const maintenance = maintenanceRes.data;
      const equipmentData = equipmentRes.data || [];

      setEquipment(equipmentData);

      setForm({
        equipment_id: maintenance.equipment_id,
        maintenance_type:
          maintenance.maintenance_type || '',
        maintenance_date:
          maintenance.maintenance_date
            ? new Date(
                maintenance.maintenance_date
              )
            : new Date(),
        technician:
          maintenance.technician || '',
        description:
          maintenance.description || '',
        status:
          maintenance.status || 'Pending',
      });
    } catch (error: any) {
      console.log(error);

      Alert.alert(
        'Error',
        error?.message || 'Failed to load'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= UPDATE ================= */

  const handleUpdate = async () => {
    try {
      if (
        !form.equipment_id ||
        !form.maintenance_type
      ) {
        Alert.alert(
          'Error',
          'Please fill required fields'
        );
        return;
      }

      setLoading(true);

      await MaintenanceAPI.updateMaintenance(
        id,
        {
          equipment_id:
            form.equipment_id,

          maintenance_type:
            form.maintenance_type,

          maintenance_date:
            form.maintenance_date
              .toISOString()
              .split('T')[0],

          technician:
            form.technician,

          description:
            form.description,

          status:
            form.status,
        }
      );

      Alert.alert(
        'Success',
        'Maintenance Updated Successfully'
      );

      navigation.goBack();
    } catch (error: any) {
      console.log(error);

      Alert.alert(
        'Error',
        error?.message || 'Update Failed'
      );
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

  return (
    <ScrollView style={styles.container}>
      {/* DETAILS */}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Edit Maintenance
        </Text>

        <Text style={styles.label}>
          Equipment *
        </Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={
              form.equipment_id
            }
            onValueChange={value =>
              update(
                'equipment_id',
                value
              )
            }
          >
            <Picker.Item
              label="Select Equipment"
              value=""
            />

            {equipment.map(item => (
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
            selectedValue={
              form.maintenance_type
            }
            onValueChange={value =>
              update(
                'maintenance_type',
                value
              )
            }
          >
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
          Maintenance Date
        </Text>

        <TouchableOpacity
          style={styles.input}
          onPress={() =>
            setShowDate(true)
          }
        >
          <Text>
            {form.maintenance_date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {showDate && (
          <DateTimePicker
            value={
              form.maintenance_date
            }
            mode="date"
            onChange={(
              event,
              date
            ) => {
              setShowDate(false);

              if (date) {
                update(
                  'maintenance_date',
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
          onChangeText={text =>
            update(
              'technician',
              text
            )
          }
        />

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
          onChangeText={text =>
            update(
              'description',
              text
            )
          }
        />

        <Text style={styles.label}>
          Status
        </Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={
              form.status
            }
            onValueChange={value =>
              update(
                'status',
                value
              )
            }
          >
            <Picker.Item
              label="Pending"
              value="Pending"
            />
            <Picker.Item
              label="In Progress"
              value="In Progress"
            />
            <Picker.Item
              label="Completed"
              value="Completed"
            />
          </Picker>
        </View>
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleUpdate}
      >
        <Text style={styles.saveText}>
          UPDATE MAINTENANCE
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
    marginBottom: 6,
    marginTop: 10,
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