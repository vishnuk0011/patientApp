import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
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

import EquipmentAPI from '../../../services/api';

import { CompositeNavigationProp } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../../../navigation/Menu';

type NavigationProp = CompositeNavigationProp<
  DrawerNavigationProp<DrawerParamList, 'AllEquipment'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface Equipment {
  id: string;
  equipment_code: string;
  name: string;
  type: string;
  location: string;
  installation_date?: string;
  condition_status: string;
}

export default function AllEquipment() {
  const navigation = useNavigation<NavigationProp>();

  const [search, setSearch] = useState('');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);

  const loadEquipment = async () => {
  try {
    setLoading(true);

    const res = await EquipmentAPI.getEquipment(search);

    setEquipment(res.data || []);

    console.log('API DATA:', res.data);
  } catch (error: any) {
    console.log('Equipment Load Error:', error);

    Alert.alert(
      'Error',
      error?.message || 'Failed to load equipment'
    );
  } finally {
    setLoading(false);
  }
};

  useFocusEffect(
    useCallback(() => {
      loadEquipment();
    }, [search])
  );

  const handleDelete = (id: string) => {
    Alert.alert('Confirm', 'Delete this equipment?', [
      { text: 'Cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await EquipmentAPI.deleteEquipment(id);
            loadEquipment();
          } catch (error: any) {
            Alert.alert('Error', error?.message);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item, index }: any) => (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.index}>{index + 1}</Text>
        <Text style={styles.code}>{item.equipment_code}</Text>
      </View>

      <Text style={styles.name}>{item.name}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Type:</Text>
        <Text>{item.type}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Location:</Text>
        <Text>{item.location}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Installed:</Text>
        <Text>{item.installation_date || '-'}</Text>
      </View>

      <View style={styles.toggleRow}>
        <View
          style={[
            styles.badge,
            item.condition_status === 'Active'
              ? styles.green
              : item.condition_status === 'Under Maintenance'
              ? styles.gray
              : styles.red,
          ]}
        >
          <Text style={styles.badgeText}>{item.condition_status}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() =>
            navigation.navigate('EquipmentDetails', { id: item.id })
          }
        >
          <Feather name="eye" size={18} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() =>
            navigation.navigate('EditEquipment', { id: item.id })
          }
        >
          <Feather name="edit-2" size={18} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => handleDelete(item.id)}
        >
          <Feather name="trash-2" size={18} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Equipment</Text>

        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search Equipment..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          <TouchableOpacity onPress={loadEquipment}>
            <Feather name="search" size={18} />
          </TouchableOpacity>
        </View>

        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('AddEquipment')}
          >
            <Feather name="plus" size={16} color="#fff" />
            <Text style={styles.btnText}>New Equipment</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2e59d9" />
      ) : (
        <FlatList
          data={equipment}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

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
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    fontWeight: '500',
    marginRight: 5,
  },
  toggleRow: {
    marginTop: 10,
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
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
});