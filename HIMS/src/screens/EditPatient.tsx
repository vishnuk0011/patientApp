import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { PatientAPI } from '../services/api';

export default function EditPatient() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { id } = route.params;

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<any>({
    first_name: '',
    last_name: '',
    gender: '',
    mobile: '',
    email: '',
    blood_group: '',
    emergency_contact: '',
    address: '',
  });

  const update = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  /* ================= LOAD PATIENT ================= */

  const loadPatient = async () => {
    try {
      setLoading(true);
      const data = await PatientAPI.getPatient(id);
      setForm(data);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatient();
  }, []);

  /* ================= UPDATE ================= */

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await PatientAPI.updatePatient(id, form);
      Alert.alert('Success', 'Patient updated successfully');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2e59d9" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Patient</Text>

      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        value={form.first_name}
        onChangeText={(text) => update('first_name', text)}
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        value={form.last_name}
        onChangeText={(text) => update('last_name', text)}
      />

      <Text style={styles.label}>Gender</Text>
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

      <Text style={styles.label}>Mobile</Text>
      <TextInput
        style={styles.input}
        value={form.mobile}
        onChangeText={(text) => update('mobile', text)}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={form.email}
        onChangeText={(text) => update('email', text)}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Blood Group</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={form.blood_group}
          onValueChange={(value) => update('blood_group', value)}
        >
          <Picker.Item label="Select" value="" />
          {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map((group) => (
            <Picker.Item key={group} label={group} value={group} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Emergency Contact</Text>
      <TextInput
        style={styles.input}
        value={form.emergency_contact}
        onChangeText={(text) => update('emergency_contact', text)}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={form.address}
        onChangeText={(text) => update('address', text)}
        multiline
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleUpdate}
      >
        <Text style={styles.saveText}>UPDATE PATIENT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 6,
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  saveButton: {
    backgroundColor: '#2e59d9',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});