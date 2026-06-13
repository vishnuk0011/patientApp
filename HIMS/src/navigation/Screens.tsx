import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Articles, Components, Home, Profile, Register, Pro } from '../modules/patients/screens';

// ✅ PATIENT SCREENS
// import AllPatients from '../modules/patients/screens/AllPatients';
// import AddPatient from '../modules/patients/screens/AddPatient';
// import EditPatient from '../modules/patients/screens/EditPatient';

//  EQUIPMENT SCREENS
import AllEquipment from '../modules/equipments/screens/AllEquipments';
import AddEquipment from '../modules/equipments/screens/AddEquipments';
import EditEquipment from '../modules/equipments/screens/EditEquipment';
import EquipmentDetails from '../modules/equipments/screens/EquipmentDetails';

//  MAINTENANCE
import MaintenanceList from '../modules/equipments/screens/MaintenanceList';
import AddMaintenance from '../modules/equipments/screens/AddMaintenance';
import MaintenanceDetails from '../modules/equipments/screens/MaintenanceDetails';
import EditMaintenance from '../modules/equipments/screens/EditMaintenance';

//  CALIBRATION
import CalibrationList from '../modules/equipments/screens/CalibrationList';
import AddCalibration from '../modules/equipments/screens/AddCalibration';
import EditCalibration from '../modules/equipments/screens/EditCalibration';
import CalibrationDetails from '../modules/equipments/screens/CalibrationDetails';

//  BREAKDOWN
import BreakdownList from '../modules/equipments/screens/BreakdownList';
import AddBreakdown from '../modules/equipments/screens/AddBreakdown';
import BreakdownDetails from '../modules/equipments/screens/BreakdownDetails';
import EditBreakdown from '../modules/equipments/screens/EditBreakdown';

//  PREVENTIVE
import PreventiveScheduleList from '../modules/equipments/screens/PreventiveScheduleList';
import AddSchedule from '../modules/equipments/screens/AddSchedule';
import EditPreventiveSchedule from '../modules/equipments/screens/EditPreventiveSchedule';
import PreventiveDetails from '../modules/equipments/screens/PreventiveDetails';

import { useScreenOptions, useTranslation } from '../hooks';



const Stack = createStackNavigator();

export default () => {
  const { t } = useTranslation();
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions.stack}>

      {/* ================= DEFAULT SCREENS ================= */}
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ title: t('navigation.home') }}
      />

      <Stack.Screen
        name="Components"
        component={Components}
        options={screenOptions.components}
      />

      <Stack.Screen
        name="Articles"
        component={Articles}
        options={{ title: t('navigation.articles') }}
      />

      <Stack.Screen name="Pro" component={Pro} options={screenOptions.pro} />

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />

      {/* ================= PATIENT MODULE ================= */}
      {/* <Stack.Screen name="AllPatients" component={AllPatients} />
      // <Stack.Screen name="AddPatient" component={AddPatient} />
      // <Stack.Screen name="EditPatient" component={EditPatient} /> */}

      {/* ================= EQUIPMENT MODULE ================= */}
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
  );
};