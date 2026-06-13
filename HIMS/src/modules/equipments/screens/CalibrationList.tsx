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

import { CalibrationAPI } from '../../../services/api';

export default function CalibrationList() {
  const navigation = useNavigation<any>();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const res = await CalibrationAPI.getCalibration();

      setData(res.data || []);

      console.log('CALIBRATION DATA:', res.data);
    } catch (error: any) {
      console.log(error);

      Alert.alert(
        'Error',
        error?.message || 'Failed to load calibration records'
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
    Alert.alert(
      'Confirm',
      'Delete this calibration record?',
      [
        { text: 'Cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await CalibrationAPI.deleteCalibration(id);
              loadData();
            } catch (error: any) {
              Alert.alert('Error', error?.message);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item, index }: any) => (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.index}>{index + 1}</Text>

        <Text style={styles.code}>
          {item.equipment?.equipment_code}
        </Text>
      </View>

      <Text style={styles.name}>
        {item.equipment?.name}
      </Text>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Type:</Text>
        <Text>{item.calibration_type}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Calibration Date:</Text>
        <Text>{item.calibration_date}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Next Due:</Text>
        <Text>{item.next_due_date || '-'}</Text>
      </View>

      <View style={styles.statusRow}>
        <View
          style={[
            styles.badge,
            item.result === 'Pass'
              ? styles.green
              : styles.red,
          ]}
        >
          <Text style={styles.badgeText}>
            {item.result}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() =>
            navigation.navigate('CalibrationDetails', {
              id: item.id,
            })
          }
        >
          <Feather name="eye" size={18} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() =>
            navigation.navigate('EditCalibration', {
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
        <Text style={styles.title}>
          Calibration Records
        </Text>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() =>
            navigation.navigate('AddCalibration')
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
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e59d9',
    padding: 10,
    borderRadius: 6,
    gap: 5,
  },
  btnText: {
    color: '#fff',
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
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    fontWeight: '500',
    marginRight: 5,
  },
  statusRow: {
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