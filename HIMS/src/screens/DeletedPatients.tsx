import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';

import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { PatientAPI } from '../services/api';

interface Patient {
  id: string;
  patient_code: string;
  first_name: string;
  last_name: string;
  deleted_at: string;
}

export default function DeletedPatients() {

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPatients = async () => {
    try {

      setLoading(true);

      const res = await PatientAPI.getDeletedPatients();

      setPatients(res.data);

    } catch (error:any) {

      Alert.alert('Error', error.message);

    } finally {

      setLoading(false);

    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPatients();
    }, [])
  );

  const restorePatient = async (id:string) => {

    try {

      await PatientAPI.restorePatient(id);

      loadPatients();

    } catch (error:any) {

      Alert.alert('Error', error.message);

    }

  };

  const deletePatient = async (id:string) => {

    Alert.alert(
      'Confirm',
      'Permanently delete this patient?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {

            try {

              await PatientAPI.forceDeletePatient(id);

              loadPatients();

            } catch (error:any) {

              Alert.alert('Error', error.message);

            }

          }
        }
      ]
    );

  };

  const renderItem = ({ item, index }:any) => (

    <View style={styles.card}>

      <Text style={styles.index}>{index + 1}</Text>

      <Text style={styles.code}>{item.patient_code}</Text>

      <Text style={styles.name}>
        {item.first_name} {item.last_name}
      </Text>

      <Text style={styles.deleted}>
        Deleted At: {item.deleted_at}
      </Text>

      <View style={styles.actions}>

        <TouchableOpacity
          style={styles.restore}
          onPress={() => restorePatient(item.id)}
        >
          <Feather name="rotate-ccw" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.delete}
          onPress={() => deletePatient(item.id)}
        >
          <Feather name="trash-2" size={18} color="#fff" />
        </TouchableOpacity>

      </View>

    </View>

  );

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#2e59d9"
        style={{ marginTop: 40 }}
      />
    );
  }

  return (

    <FlatList
      data={patients}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 15 }}
      ListEmptyComponent={
        <Text style={styles.empty}>
          No Deleted Patients Found
        </Text>
      }
    />

  );

}

const styles = StyleSheet.create({

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2
  },

  index: {
    fontWeight: '600'
  },

  code: {
    color: '#6c757d'
  },

  name: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 5
  },

  deleted: {
    color: '#e74a3b',
    marginTop: 5
  },

  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10
  },

  restore: {
    backgroundColor: '#1cc88a',
    padding: 8,
    borderRadius: 6
  },

  delete: {
    backgroundColor: '#e74a3b',
    padding: 8,
    borderRadius: 6
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#6c757d'
  }

});