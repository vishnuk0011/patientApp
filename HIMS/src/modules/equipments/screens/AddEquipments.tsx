import React, { useState } from 'react';
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

import EquipmentAPI from '../../../services/api';

export default function AddEquipment() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const initialForm = {
    name: '',
    type: '',
    manufacturer: '',
    model_number: '',
    serial_number: '',
    installation_date: new Date(),
    location: '',
    condition_status: 'Active',
  };

  const [form, setForm] = useState(initialForm);

  const [showDate, setShowDate] = useState(false);

  const update = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    try {
      if (!form.name || !form.type || !form.location) {
        Alert.alert('Error', 'Please fill required fields');
        return;
      }

      setLoading(true);

      await EquipmentAPI.createEquipment({
        name: form.name,
        type: form.type,
        manufacturer: form.manufacturer,
        model_number: form.model_number,
        serial_number: form.serial_number,
        installation_date: form.installation_date
          .toISOString()
          .split('T')[0],
        location: form.location,
        condition_status: form.condition_status,
      });

      Alert.alert('Success', 'Equipment Created Successfully');

      setForm({
        ...initialForm,
        installation_date: new Date(),
      });

      navigation.goBack();
    } catch (error: any) {
      console.log('Create Equipment Error:', error);

      Alert.alert(
        'Error',
        error?.message || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* BASIC DETAILS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Equipment Details</Text>

        <Text style={styles.label}>Equipment Name *</Text>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={(text) => update('name', text)}
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

        <Text style={styles.label}>Manufacturer</Text>
        <TextInput
          style={styles.input}
          value={form.manufacturer}
          onChangeText={(text) => update('manufacturer', text)}
        />

        <Text style={styles.label}>Model Number</Text>
        <TextInput
          style={styles.input}
          value={form.model_number}
          onChangeText={(text) => update('model_number', text)}
        />

        <Text style={styles.label}>Serial Number</Text>
        <TextInput
          style={styles.input}
          value={form.serial_number}
          onChangeText={(text) => update('serial_number', text)}
        />
      </View>

      {/* INSTALLATION */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Installation Details</Text>

        <Text style={styles.label}>Installation Date</Text>

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
            display="default"
            onChange={(event, selectedDate) => {
              setShowDate(false);

              if (event.type === 'set' && selectedDate) {
                update('installation_date', selectedDate);
              }
            }}
          />
        )}

        <Text style={styles.label}>Location *</Text>
        <TextInput
          style={styles.input}
          value={form.location}
          onChangeText={(text) => update('location', text)}
        />
      </View>

      {/* STATUS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status</Text>

        <Text style={styles.label}>Condition Status</Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.condition_status}
            onValueChange={(value) =>
              update('condition_status', value)
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
      </View>

      {/* SAVE BUTTON */}
      <TouchableOpacity
        style={[
          styles.saveButton,
          loading && { opacity: 0.6 },
        ]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveText}>
          {loading ? 'Saving...' : 'SAVE EQUIPMENT'}
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
    backgroundColor: '#ffffff',
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