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

import { Feather } from '@expo/vector-icons';
import {
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

import { BreakdownAPI } from '../../../services/api';

export default function BreakdownList() {
  const navigation = useNavigation<any>();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const res = await BreakdownAPI.getBreakdowns();

      setData(res.data || []);

      console.log('BREAKDOWN DATA:', res.data);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.message || 'Failed to load'
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
      'Delete this breakdown?',
      [
        { text: 'Cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await BreakdownAPI.deleteBreakdown(id);
              loadData();
            } catch (error: any) {
              Alert.alert(
                'Error',
                error?.message
              );
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item, index }: any) => (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.index}>
          {index + 1}
        </Text>

        <Text style={styles.code}>
          {item.equipment?.equipment_code}
        </Text>
      </View>

      <Text style={styles.name}>
        {item.equipment?.name}
      </Text>

      <View style={styles.infoRow}>
        <Text style={styles.label}>
          Severity:
        </Text>
        <Text>{item.severity}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>
          Reported:
        </Text>
        <Text>{item.breakdown_date}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>
          By:
        </Text>
        <Text>{item.reported_by}</Text>
      </View>

      <Text style={{ marginTop: 8 }}>
        {item.description}
      </Text>

      <View style={styles.badgeRow}>
        <View
          style={[
            styles.badge,
            item.status === 'Resolved'
              ? styles.green
              : item.status === 'Under Repair'
              ? styles.orange
              : styles.red,
          ]}
        >
          <Text style={styles.badgeText}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              'BreakdownDetails',
              { id: item.id }
            )
          }
        >
          <Feather
            name="eye"
            size={18}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              'EditBreakdown',
              { id: item.id }
            )
          }
        >
          <Feather
            name="edit-2"
            size={18}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            handleDelete(item.id)
          }
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
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Breakdown Reports
        </Text>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() =>
            navigation.navigate(
              'AddBreakdown'
            )
          }
        >
          <Feather
            name="plus"
            size={16}
            color="#fff"
          />
          <Text style={styles.btnText}>
            Add
          </Text>
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
          keyExtractor={(item) =>
            item.id
          }
          renderItem={renderItem}
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
    justifyContent:
      'space-between',
    alignItems: 'center',
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
  },

  btnText: {
    color: '#fff',
    marginLeft: 5,
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
    justifyContent:
      'space-between',
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
    fontSize: 16,
  },

  infoRow: {
    flexDirection: 'row',
    marginTop: 4,
  },

  label: {
    fontWeight: '500',
    marginRight: 5,
  },

  badgeRow: {
    marginTop: 12,
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

  orange: {
    backgroundColor: '#f6c23e',
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
});