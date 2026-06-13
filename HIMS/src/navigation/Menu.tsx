import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';

/* ================= EQUIPMENT SCREENS ================= */
import AllEquipment from '../modules/equipments/screens/AllEquipments';
import AddEquipment from '../modules/equipments/screens/AddEquipments';
import MaintenanceList from '../modules/equipments/screens/MaintenanceList';
import CalibrationList from '../modules/equipments/screens/CalibrationList';
import BreakdownList from '../modules/equipments/screens/BreakdownList';
import PreventiveScheduleList from '../modules/equipments/screens/PreventiveScheduleList';

/* ================= TYPES ================= */
export type DrawerParamList = {
  AllEquipment: undefined;
  AddEquipment: undefined;
  MaintenanceList: undefined;
  CalibrationList: undefined;
  BreakdownList: undefined;
  PreventiveScheduleList: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

/* ================= CUSTOM DRAWER ================= */

function CustomDrawerContent(props: any) {
  const [equipmentOpen, setEquipmentOpen] = useState(true);

  return (
    <DrawerContentScrollView {...props}>

      {/* ================= EQUIPMENT ================= */}
      <TouchableOpacity
        style={styles.parent}
        onPress={() => setEquipmentOpen(!equipmentOpen)}
      >
        <Feather name="tool" size={20} />
        <Text style={styles.parentText}>Equipment Management</Text>
        <Feather
          name={equipmentOpen ? 'chevron-down' : 'chevron-right'}
          size={18}
          style={{ marginLeft: 'auto' }}
        />
      </TouchableOpacity>

      {equipmentOpen && (
        <View style={styles.submenu}>

          <TouchableOpacity
            style={styles.child}
            onPress={() => props.navigation.navigate('AllEquipment')}
          >
            <Feather name="list" size={18} />
            <Text style={styles.childText}>All Equipment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.child}
            onPress={() => props.navigation.navigate('AddEquipment')}
          >
            <Feather name="plus-circle" size={18} />
            <Text style={styles.childText}>Add Equipment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.child}
            onPress={() => props.navigation.navigate('MaintenanceList')}
          >
            <Feather name="settings" size={18} />
            <Text style={styles.childText}>Maintenance</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.child}
            onPress={() => props.navigation.navigate('CalibrationList')}
          >
            <Feather name="activity" size={18} />
            <Text style={styles.childText}>Calibration</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.child}
            onPress={() => props.navigation.navigate('BreakdownList')}
          >
            <Feather name="alert-triangle" size={18} />
            <Text style={styles.childText}>Breakdown</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.child}
            onPress={() => props.navigation.navigate('PreventiveScheduleList')}
          >
            <Feather name="calendar" size={18} />
            <Text style={styles.childText}>Preventive</Text>
          </TouchableOpacity>

        </View>
      )}

    </DrawerContentScrollView>
  );
}

/* ================= MAIN DRAWER ================= */

export default function Menu() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="AllEquipment" component={AllEquipment} />
      <Drawer.Screen name="AddEquipment" component={AddEquipment} />
      <Drawer.Screen name="MaintenanceList" component={MaintenanceList} />
      <Drawer.Screen name="CalibrationList" component={CalibrationList} />
      <Drawer.Screen name="BreakdownList" component={BreakdownList} />
      <Drawer.Screen name="PreventiveScheduleList" component={PreventiveScheduleList} />
    </Drawer.Navigator>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  parent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  parentText: {
    marginLeft: 10,
    fontWeight: '600',
  },
  submenu: {
    paddingLeft: 30,
  },
  child: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  childText: {
    marginLeft: 10,
  },
});