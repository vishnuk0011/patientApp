import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { PatientAPI } from '../services/api';

import { CompositeNavigationProp } from '@react-navigation/native';

import { DrawerNavigationProp } from '@react-navigation/drawer';


import { DrawerParamList } from '../navigation/Menu';

type NavigationProp = CompositeNavigationProp<
  DrawerNavigationProp<DrawerParamList, 'AllPatients'>,
  NativeStackNavigationProp<RootStackParamList>
>;





interface Patient {
  id: string;
  patient_code: string;
  first_name: string;
  last_name: string;
  email?: string;
  mobile: string;
  gender: string;
  is_vip: boolean;
  status: boolean;
}

export default function AllPatients() {
  const navigation = useNavigation<NavigationProp>();

  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedData, setExpandedData] = useState<any>(null);

  /* ================= LOAD PATIENTS ================= */

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response = await PatientAPI.getPatients(search);
      setPatients(response.data);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPatients();
    }, [search])
  );

  /* ================= EXPAND VIEW ================= */

  const toggleExpand = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      setExpandedData(null);
      return;
    }

    try {
      setLoading(true);
      const data = await PatientAPI.getPatient(id);
      setExpandedData(data);
      setExpandedId(id);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= TOGGLE VIP ================= */

  const toggleVip = async (id: string, currentVip: boolean) => {
  try {

    await PatientAPI.toggleVip(id, !currentVip);

    loadPatients();

  } catch (error: any) {
    Alert.alert("Error", error.message);
  }
};

  /* ================= TOGGLE STATUS ================= */

  const toggleStatus = async (id: string, currentStatus: boolean) => {
  try {

    await PatientAPI.toggleStatus(id, !currentStatus);

    loadPatients();

  } catch (error: any) {
    Alert.alert("Error", error.message);
  }
};

  /* ================= DELETE ================= */

  const deletePatient = (id: string) => {
    Alert.alert('Confirm', 'Move patient to trash?', [
      { text: 'Cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await PatientAPI.deletePatient(id);
            loadPatients();
          } catch (error: any) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  /* ================= RENDER ITEM ================= */

  const renderItem = ({ item, index }: any) => (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.index}>{index + 1}</Text>
        <Text style={styles.code}>{item.patient_code}</Text>
      </View>

      <Text style={styles.name}>
        {item.first_name} {item.last_name}
      </Text>

      <Text style={styles.email}>{item.email || '-'}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Mobile:</Text>
        <Text>{item.mobile}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Gender:</Text>
        <Text>{item.gender}</Text>
      </View>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[
            styles.badge,
            item.is_vip ? styles.green : styles.gray,
          ]}
          onPress={() => toggleVip(item.id, item.is_vip)}
        >
          <Text style={styles.badgeText}>
            VIP: {item.is_vip ? 'Yes' : 'No'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.badge,
            item.status ? styles.green : styles.red,
          ]}
          onPress={() => toggleStatus(item.id, item.status)}
        >
          <Text style={styles.badgeText}>
            {item.status ? 'Active' : 'Inactive'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => toggleExpand(item.id)}
        >
          <Feather
            name={expandedId === item.id ? 'chevron-up' : 'eye'}
            size={18}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() =>
            navigation.navigate('EditPatient', { id: item.id })
          }
        >
          <Feather name="edit-2" size={18} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => deletePatient(item.id)}
        >
          <Feather name="trash-2" size={18} color="red" />
        </TouchableOpacity>
      </View>

      {/* EXPANDED SECTION */}
      {expandedId === item.id && expandedData && (
        <View style={styles.expandedBox}>
          <Text style={styles.expandedLabel}>Date of Birth</Text>
          <Text style={styles.expandedValue}>
            {expandedData.date_of_birth || '-'}
          </Text>

          <Text style={styles.expandedLabel}>Blood Group</Text>
          <Text style={styles.expandedValue}>
            {expandedData.blood_group || '-'}
          </Text>

          <Text style={styles.expandedLabel}>Emergency Contact</Text>
          <Text style={styles.expandedValue}>
            {expandedData.emergency_contact || '-'}
          </Text>

          <Text style={styles.expandedLabel}>Address</Text>
          <Text style={styles.expandedValue}>
            {expandedData.address || '-'}
          </Text>
        </View>
      )}
    </View>
  );

  /* ================= RETURN ================= */

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Patients</Text>

        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search Patient..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          <TouchableOpacity onPress={loadPatients}>
            <Feather name="search" size={18} />
          </TouchableOpacity>
        </View>

        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() =>
              navigation.navigate('AddPatient')
            }
          >
            <Feather name="plus" size={16} color="#fff" />
            <Text style={styles.btnText}>New Patient</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dangerBtn}
            onPress={() => navigation.navigate('DeletedPatients' as never)}
          >
            <Text style={styles.btnText}>Deleted Patients</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2e59d9" />
      ) : (
        <FlatList
          data={patients}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
    padding: 15,
  },
  header: {
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  searchContainer: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e59d9',
    padding: 10,
    borderRadius: 6,
    gap: 6,
  },
  btnText: {
    color: '#fff',
    fontSize: 13,
  },
  dangerBtn: {
  backgroundColor: '#e74a3b',
  padding: 10,
  borderRadius: 6,
  alignItems: 'center',
},
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  index: {
    fontWeight: '600',
  },
  code: {
    color: '#6c757d',
  },
  name: {
    fontWeight: '600',
    marginTop: 5,
  },
  email: {
    color: '#6c757d',
    fontSize: 12,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    fontWeight: '500',
    marginRight: 5,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
  },
  green: {
    backgroundColor: '#1cc88a',
  },
  red: {
    backgroundColor: '#e74a3b',
  },
  gray: {
    backgroundColor: '#858796',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 15,
  },
  iconBtn: {
    padding: 6,
  },
  expandedBox: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  expandedLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 8,
  },
  expandedValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});