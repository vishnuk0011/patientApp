import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { PatientAPI } from '../services/api';

interface Patient {
  id: string;
  patient_code: string;
  first_name: string;
  last_name: string;
  email?: string;
  mobile: string;
}

export default function DuplicatePatients() {
  const [groups, setGroups] = useState<Patient[][]>([]);
  const [selectedMasters, setSelectedMasters] = useState<{
    [groupIndex: number]: string;
  }>({});
  const [loading, setLoading] = useState(false);

  /* ================= LOAD DUPLICATES ================= */

  const loadDuplicates = async () => {
    try {
      setLoading(true);
      const data = await PatientAPI.getDuplicates();
      setGroups(data);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDuplicates();
  }, []);

  /* ================= SELECT MASTER ================= */

  const selectMaster = (groupIndex: number, id: string) => {
    setSelectedMasters({
      ...selectedMasters,
      [groupIndex]: id,
    });
  };

  /* ================= MERGE ================= */

  const mergeGroup = async (groupIndex: number) => {
    const group = groups[groupIndex];
    const masterId = selectedMasters[groupIndex];

    if (!masterId) {
      Alert.alert('Error', 'Please select a master patient');
      return;
    }

    try {
      setLoading(true);

      await PatientAPI.mergePatients(
        masterId,
        group.map(p => p.id)
      );

      Alert.alert('Success', 'Patients merged successfully');

      loadDuplicates();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Duplicate Patients</Text>

      {loading && <ActivityIndicator size="large" color="#2e59d9" />}

      {!loading && groups.length === 0 && (
        <Text style={styles.noData}>
          No duplicate patients found.
        </Text>
      )}

      {!loading &&
        groups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.groupCard}>
            <Text style={styles.groupTitle}>
              {group[0].first_name} {group[0].last_name} ({group[0].mobile})
            </Text>

            {group.map((patient) => (
              <TouchableOpacity
                key={patient.id}
                style={styles.patientCard}
                onPress={() => selectMaster(groupIndex, patient.id)}
              >
                <View style={styles.radioCircle}>
                  {selectedMasters[groupIndex] === patient.id && (
                    <View style={styles.radioSelected} />
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.code}>
                    {patient.patient_code}
                  </Text>

                  <Text style={styles.name}>
                    {patient.first_name} {patient.last_name}
                  </Text>

                  <Text style={styles.email}>
                    {patient.email || '-'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.mergeButton}
              onPress={() => mergeGroup(groupIndex)}
            >
              <Text style={styles.mergeText}>Merge Selected</Text>
            </TouchableOpacity>
          </View>
        ))}
    </ScrollView>
  );
}

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
  groupCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  groupTitle: {
    fontWeight: '600',
    marginBottom: 10,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2e59d9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2e59d9',
  },
  code: {
    fontWeight: '600',
  },
  name: {
    fontSize: 13,
  },
  email: {
    fontSize: 12,
    color: '#6c757d',
  },
  mergeButton: {
    backgroundColor: '#e74a3b',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  mergeText: {
    color: '#fff',
    fontWeight: '600',
  },
  noData: {
    textAlign: 'center',
    marginTop: 40,
    color: '#6c757d',
  },
});