import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';

import EquipmentAPI from '../../../services/api';

export default function EditEquipment() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { id } = route.params;

  const [loading, setLoading] = useState(true);
  const [showDate, setShowDate] = useState(false);

  const [form, setForm] = useState({
    name: '',
    type: '',
    manufacturer: '',
    model_number: '',
    serial_number: '',
    installation_date: new Date(),
    location: '',
    condition_status: 'Active',
  });

  const updateField = (key: string, value: any) => {
    setForm(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const loadEquipment = async () => {
    try {
      const res = await EquipmentAPI.getEquipmentById(id);

      const data = res.data;

      setForm({
        name: data.name || '',
        type: data.type || '',
        manufacturer: data.manufacturer || '',
        model_number: data.model_number || '',
        serial_number: data.serial_number || '',
        installation_date: data.installation_date
          ? new Date(data.installation_date)
          : new Date(),
        location: data.location || '',
        condition_status: data.condition_status || 'Active',
      });
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.message || 'Failed to load equipment'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipment();
  }, []);

  const handleUpdate = async () => {
    try {
      if (!form.name || !form.type) {
        Alert.alert('Error', 'Please fill required fields');
        return;
      }

      setLoading(true);

      await EquipmentAPI.updateEquipment(id, {
        name: form.name,
        type: form.type,
        manufacturer: form.manufacturer,
        model_number: form.model_number,
        serial_number: form.serial_number,
        installation_date:
          form.installation_date
            .toISOString()
            .split('T')[0],
        location: form.location,
        condition_status: form.condition_status,
      });

      Alert.alert(
        'Success',
        'Equipment Updated Successfully'
      );

      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.message || 'Update failed'
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
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Edit Equipment
        </Text>

        <Text style={styles.label}>
          Equipment Name
        </Text>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={text =>
            updateField('name', text)
          }
        />

        <Text style={styles.label}>Equipment Type *</Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.type}
            onValueChange={(value) => update('type', value)}
          >
            <Picker.Item label="Select Type" value="" />
            <Picker.Item label="Analyzer" value="Analyzer" />
            <Picker.Item label="Microscope" value="Microscope" />
            <Picker.Item label="X-Ray Machine" value="X-Ray Machine" />
            <Picker.Item label="ECG Machine" value="ECG Machine" />
            <Picker.Item label="Ultrasound" value="Ultrasound" />
            <Picker.Item label="Centrifuge" value="Centrifuge" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        <Text style={styles.label}>
          Manufacturer
        </Text>
        <TextInput
          style={styles.input}
          value={form.manufacturer}
          onChangeText={text =>
            updateField('manufacturer', text)
          }
        />

        <Text style={styles.label}>
          Model Number
        </Text>
        <TextInput
          style={styles.input}
          value={form.model_number}
          onChangeText={text =>
            updateField('model_number', text)
          }
        />

        <Text style={styles.label}>
          Serial Number
        </Text>
        <TextInput
          style={styles.input}
          value={form.serial_number}
          onChangeText={text =>
            updateField('serial_number', text)
          }
        />

        <Text style={styles.label}>
          Installation Date
        </Text>

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDate(true)}
        >
          <Text>
            {form.installation_date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {showDate && (
          <DateTimePicker
            value={form.installation_date}
            mode="date"
            onChange={(event, date) => {
              setShowDate(false);

              if (date) {
                updateField(
                  'installation_date',
                  date
                );
              }
            }}
          />
        )}

        <Text style={styles.label}>
          Location
        </Text>
        <TextInput
          style={styles.input}
          value={form.location}
          onChangeText={text =>
            updateField('location', text)
          }
        />

        <Text style={styles.label}>
          Condition Status
        </Text>

        <Picker
          selectedValue={form.condition_status}
          onValueChange={value =>
            updateField(
              'condition_status',
              value
            )
          }
        >
          <Picker.Item
            label="Active"
            value="Active"
          />
          <Picker.Item
            label="Under Maintenance"
            value="Under Maintenance"
          />
          <Picker.Item
            label="Out of Service"
            value="Out of Service"
          />
        </Picker>
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleUpdate}
      >
        <Text style={styles.saveText}>
          UPDATE EQUIPMENT
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
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
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
  saveButton: {
    backgroundColor: '#2e59d9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  pickerWrapper: {
  backgroundColor: '#f8f9fa',
  borderRadius: 6,
},
  saveText: {
    color: '#fff',
    fontWeight: '600',
  },
});