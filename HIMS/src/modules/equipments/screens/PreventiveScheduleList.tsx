import React, {
  useState,
  useCallback,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import {
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';

import { Feather } from '@expo/vector-icons';

import { PreventiveAPI } from '../../../services/api';

export default function PreventiveScheduleList() {
  const navigation = useNavigation<any>();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] =
    useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const res =
        await PreventiveAPI.getPreventiveSchedules();

      setData(res.data || []);

      console.log(
        'PREVENTIVE DATA:',
        res.data
      );

    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.message
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

  const handleDelete = (
    id: string
  ) => {
    Alert.alert(
      'Confirm',
      'Delete this schedule?',
      [
        { text: 'Cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            await PreventiveAPI.deletePreventiveSchedule(
              id
            );

            loadData();
          },
        },
      ]
    );
  };

  const getStatus = (
    date: string
  ) => {
    const today = new Date();

    const nextDate =
      new Date(date);

    return nextDate < today
      ? 'OVERDUE'
      : 'UPCOMING';
  };

  const renderItem = ({
    item,
    index,
  }: any) => {
    const status =
      getStatus(
        item.next_maintenance_date
      );

    return (
      <View style={styles.card}>

        <View style={styles.rowBetween}>
          <Text style={styles.index}>
            {index + 1}
          </Text>

          <Text style={styles.code}>
            {
              item.equipment
                ?.equipment_code
            }
          </Text>
        </View>

        <Text style={styles.name}>
          {item.equipment?.name}
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>
            Frequency:
          </Text>
          <Text>
            {item.frequency}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>
            Next Due:
          </Text>
          <Text>
            {
              item.next_maintenance_date
            }
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>
            Technician:
          </Text>
          <Text>
            {item.technician}
          </Text>
        </View>

        <View style={styles.badgeRow}>
          <View
            style={[
              styles.badge,
              status ===
                'UPCOMING'
                ? styles.green
                : styles.red,
            ]}
          >
            <Text
              style={
                styles.badgeText
              }
            >
              {status}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                'PreventiveDetails',
                {
                  id: item.id,
                }
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
                'EditPreventiveSchedule',
                {
                  id: item.id,
                }
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
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text
          style={
            styles.headerTitle
          }
        >
          Preventive Maintenance
        </Text>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() =>
            navigation.navigate(
              'AddSchedule'
            )
          }
        >
          <Feather
            name="plus"
            size={16}
            color="#fff"
          />
          <Text
            style={
              styles.btnText
            }
          >
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
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  addBtn: {
    flexDirection: 'row',
    backgroundColor:
      '#2e59d9',
    padding: 8,
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
    fontSize: 16,
    marginTop: 5,
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
    marginTop: 10,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fff',
  },
  green: {
    backgroundColor: '#1cc88a',
  },
  red: {
    backgroundColor: '#e74a3b',
  },
  actions: {
    flexDirection: 'row',
    justifyContent:
      'flex-end',
    gap: 15,
    marginTop: 12,
  },
});