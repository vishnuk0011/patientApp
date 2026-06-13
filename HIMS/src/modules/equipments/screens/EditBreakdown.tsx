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
import { useNavigation, useRoute } from '@react-navigation/native';

import { BreakdownAPI } from '../../../services/api';

export default function EditBreakdown() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { id } = route.params;

  const [form, setForm] = useState({
    description: '',
    reported_by: '',
    breakdown_date: '',
    severity: 'Low',
    status: 'Reported',
  });

  const update = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  useEffect(() => {
    loadBreakdown();
  }, []);

  const loadBreakdown = async () => {
    try {
      const res = await BreakdownAPI.getBreakdownById(id);

      const data = res.data;

      setForm({
        description: data.description || '',
        reported_by: data.reported_by || '',
        breakdown_date: data.breakdown_date || '',
        severity: data.severity || 'Low',
        status: data.status || 'Reported',
      });
    } catch (error: any) {
      Alert.alert('Error', error?.message);
    }
  };

  const handleUpdate = async () => {
    try {
      await BreakdownAPI.updateBreakdown(id, {
        description: form.description,
        reported_by: form.reported_by,
        breakdown_date: form.breakdown_date,
        severity: form.severity,
        status: form.status,
      });

      Alert.alert('Success', 'Breakdown Updated');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error?.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Edit Breakdown</Text>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          multiline
          value={form.description}
          onChangeText={(t) =>
            update('description', t)
          }
        />

        <Text style={styles.label}>Reported By</Text>
        <TextInput
          style={styles.input}
          value={form.reported_by}
          onChangeText={(t) =>
            update('reported_by', t)
          }
        />

        <Text style={styles.label}>Severity</Text>
        <Picker
          selectedValue={form.severity}
          onValueChange={(v) =>
            update('severity', v)
          }
        >
          <Picker.Item label="Low" value="Low" />
          <Picker.Item label="Medium" value="Medium" />
          <Picker.Item label="High" value="High" />
        </Picker>

        <Text style={styles.label}>Status</Text>
        <Picker
          selectedValue={form.status}
          onValueChange={(v) =>
            update('status', v)
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

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleUpdate}
      >
        <Text style={{ color: '#fff' }}>
          UPDATE BREAKDOWN
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