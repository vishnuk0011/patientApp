import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { PatientAPI } from '../services/api';

export default function AddPatient() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: new Date(),
    mobile: '',
    email: '',
    emergency_contact: '',
    blood_group: '',
    address: '',
    status: '1',
    is_vip: false,
  });

  const [showDate, setShowDate] = useState(false);

  const update = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const handleSave = async () => {
    try {
      if (!form.first_name || !form.last_name || !form.gender || !form.mobile) {
        Alert.alert('Error', 'Please fill required fields');
        return;
      }

      setLoading(true);

      await PatientAPI.createPatient({
        ...form,
        date_of_birth: form.date_of_birth.toISOString().split('T')[0],
        is_vip: form.is_vip ? 1 : 0,
      });

      Alert.alert('Success', 'Patient Created Successfully');

      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>

      {/* BASIC DETAILS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Patient Basic Details</Text>

        <Text style={styles.label}>First Name *</Text>
        <TextInput
          style={styles.input}
          value={form.first_name}
          onChangeText={(text) => update('first_name', text)}
        />

        <Text style={styles.label}>Last Name *</Text>
        <TextInput
          style={styles.input}
          value={form.last_name}
          onChangeText={(text) => update('last_name', text)}
        />

        <Text style={styles.label}>Gender *</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.gender}
            onValueChange={(value) => update('gender', value)}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        <Text style={styles.label}>Date of Birth *</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDate(true)}
        >
          <Text>
            {form.date_of_birth.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {showDate && (
          <DateTimePicker
            value={form.date_of_birth}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDate(false);
              if (date) update('date_of_birth', date);
            }}
          />
        )}
      </View>

      {/* CONTACT INFORMATION */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Contact Information</Text>

        <Text style={styles.label}>Mobile *</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={form.mobile}
          onChangeText={(text) => update('mobile', text)}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          value={form.email}
          onChangeText={(text) => update('email', text)}
        />

        <Text style={styles.label}>Emergency Contact</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={form.emergency_contact}
          onChangeText={(text) => update('emergency_contact', text)}
        />

        <Text style={styles.label}>Blood Group</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.blood_group}
            onValueChange={(value) => update('blood_group', value)}
          >
            <Picker.Item label="Select" value="" />
            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((group) => (
              <Picker.Item key={group} label={group} value={group} />
            ))}
          </Picker>
        </View>
      </View>

      {/* ADDRESS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Address Details</Text>

        <Text style={styles.label}>Address *</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          multiline
          value={form.address}
          onChangeText={(text) => update('address', text)}
        />
      </View>

      {/* ADDITIONAL SETTINGS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Additional Settings</Text>

        <Text style={styles.label}>Status *</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.status}
            onValueChange={(value) => update('status', value)}
          >
            <Picker.Item label="Active" value="1" />
            <Picker.Item label="Inactive" value="0" />
          </Picker>
        </View>

        <View style={styles.vipRow}>
          <Text style={styles.label}>Mark as VIP</Text>
          <Switch
            value={form.is_vip}
            onValueChange={(value) => update('is_vip', value)}
          />
        </View>
      </View>

      {/* SAVE BUTTON */}
      <TouchableOpacity
        style={[styles.saveButton, loading && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveText}>
          {loading ? 'Saving...' : 'SAVE PATIENT'}
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
  vipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
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