import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Menu from './Menu';

/* ================= EQUIPMENT ================= */
import AllEquipment from '../modules/equipments/screens/AllEquipments';
import AddEquipment from '../modules/equipments/screens/AddEquipments';
import EditEquipment from '../modules/equipments/screens/EditEquipment';
import EquipmentDetails from '../modules/equipments/screens/EquipmentDetails';

/* ================= MAINTENANCE ================= */
import MaintenanceList from '../modules/equipments/screens/MaintenanceList';
import AddMaintenance from '../modules/equipments/screens/AddMaintenance';
import MaintenanceDetails from '../modules/equipments/screens/MaintenanceDetails';
import EditMaintenance from '../modules/equipments/screens/EditMaintenance';

/* ================= CALIBRATION ================= */
import CalibrationList from '../modules/equipments/screens/CalibrationList';
import AddCalibration from '../modules/equipments/screens/AddCalibration';
import EditCalibration from '../modules/equipments/screens/EditCalibration';
import CalibrationDetails from '../modules/equipments/screens/CalibrationDetails';

/* ================= BREAKDOWN ================= */
import BreakdownList from '../modules/equipments/screens/BreakdownList';
import AddBreakdown from '../modules/equipments/screens/AddBreakdown';
import BreakdownDetails from '../modules/equipments/screens/BreakdownDetails';
import EditBreakdown from '../modules/equipments/screens/EditBreakdown';

/* ================= PREVENTIVE ================= */
import PreventiveScheduleList from '../modules/equipments/screens/PreventiveScheduleList';
import AddSchedule from '../modules/equipments/screens/AddSchedule';
import EditPreventiveSchedule from '../modules/equipments/screens/EditPreventiveSchedule';
import PreventiveDetails from '../modules/equipments/screens/PreventiveDetails';

/* ================= TYPES ================= */
export type RootStackParamList = {
  DrawerMenu: undefined;

  // Equipment
  AllEquipment: undefined;
  AddEquipment: undefined;
  EditEquipment: { id: string };
  EquipmentDetails: { id: string };

  // Maintenance
  MaintenanceList: undefined;
  AddMaintenance: undefined;
  MaintenanceDetails: { id: string };
  EditMaintenance: { id: string };
  // Calibration
  CalibrationList: undefined;
  AddCalibration: undefined;
  EditCalibration: { id: string };
  CalibrationDetails: { id: string };

  // Breakdown
  BreakdownList: undefined;
  AddBreakdown: undefined;
  BreakdownDetails: { id: string };
  EditBreakdown: { id: string };

  // Preventive
  PreventiveScheduleList: undefined;
  AddSchedule: undefined;
  EditPreventiveSchedule: { id: string };
  PreventiveDetails: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        {/* MAIN DRAWER */}
        <Stack.Screen
          name="DrawerMenu"
          component={Menu}
          options={{ headerShown: false }}
        />

        {/* ================= EQUIPMENT ================= */}
        <Stack.Screen name="AllEquipment" component={AllEquipment} />
        <Stack.Screen name="AddEquipment" component={AddEquipment} />
        <Stack.Screen name="EditEquipment" component={EditEquipment} />
        <Stack.Screen name="EquipmentDetails" component={EquipmentDetails} />

        {/* ================= MAINTENANCE ================= */}
        <Stack.Screen name="MaintenanceList" component={MaintenanceList} />
        <Stack.Screen name="AddMaintenance" component={AddMaintenance} />
        <Stack.Screen name="MaintenanceDetails" component={MaintenanceDetails} />
        <Stack.Screen name="EditMaintenance" component={EditMaintenance} />

        {/* ================= CALIBRATION ================= */}
        <Stack.Screen name="CalibrationList" component={CalibrationList} />
        <Stack.Screen name="AddCalibration" component={AddCalibration} />
        <Stack.Screen name="EditCalibration" component={EditCalibration} />
        <Stack.Screen name="CalibrationDetails" component={CalibrationDetails} />

        {/* ================= BREAKDOWN ================= */}
        <Stack.Screen name="BreakdownList" component={BreakdownList} />
        <Stack.Screen name="AddBreakdown" component={AddBreakdown} />
        <Stack.Screen name="BreakdownDetails" component={BreakdownDetails} />
        <Stack.Screen name="EditBreakdown" component={EditBreakdown} />

        {/* ================= PREVENTIVE ================= */}
        <Stack.Screen name="PreventiveScheduleList" component={PreventiveScheduleList} />
        <Stack.Screen name="AddSchedule" component={AddSchedule} />
        <Stack.Screen name="EditPreventiveSchedule" component={EditPreventiveSchedule} />
        <Stack.Screen name="PreventiveDetails" component={PreventiveDetails} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}