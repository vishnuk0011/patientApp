import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import { MaintenanceAPI } from '../../../services/api';

export default function MaintenanceList() {
  const navigation = useNavigation<any>();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const res = await MaintenanceAPI.getMaintenance();

      setData(res.data || []);

      console.log('MAINTENANCE DATA:', res.data);
    } catch (error: any) {
      console.log('Maintenance Load Error:', error);

      Alert.alert(
        'Error',
        error?.message || 'Failed to load maintenance'
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleDelete = (id: string) => {
    Alert.alert('Confirm', 'Delete this maintenance record?', [
      {
        text: 'Cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await MaintenanceAPI.deleteMaintenance(id);
            loadData();
          } catch (error: any) {
            Alert.alert(
              'Error',
              error?.message || 'Delete failed'
            );
          }
        },
      },
    ]);
  };

  const renderItem = ({ item, index }: any) => (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.index}>{index + 1}</Text>

        <Text style={styles.code}>
          {item.equipment?.equipment_code || '-'}
        </Text>
      </View>

      <Text style={styles.name}>
        {item.equipment?.name || 'Unknown Equipment'}
      </Text>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Type:</Text>
        <Text>{item.maintenance_type}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Date:</Text>
        <Text>{item.maintenance_date}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Technician:</Text>
        <Text>{item.technician || '-'}</Text>
      </View>

      <View style={styles.toggleRow}>
        <View
          style={[
            styles.badge,
            item.status === 'Completed'
              ? styles.green
              : styles.gray,
          ]}
        >
          <Text style={styles.badgeText}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() =>
            navigation.navigate('MaintenanceDetails', {
              id: item.id,
            })
          }
        >
          <Feather name="eye" size={18} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() =>
            navigation.navigate('EditMaintenance', {
              id: item.id,
            })
          }
        >
          <Feather name="edit-2" size={18} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => handleDelete(item.id)}
        >
          <Feather
            name="trash-2"
            size={18}
            color="red"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Maintenance Logs
        </Text>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() =>
            navigation.navigate('AddMaintenance')
          }
        >
          <Feather
            name="plus"
            size={16}
            color="#fff"
          />
          <Text style={styles.btnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2e59d9"
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e59d9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 5,
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
    marginBottom: 5,
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