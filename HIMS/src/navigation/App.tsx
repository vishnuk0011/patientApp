import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Menu from './Menu';
import EditPatient from '../screens/EditPatient';

export type RootStackParamList = {
  DrawerMenu: undefined;
  EditPatient: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="DrawerMenu"
          component={Menu}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditPatient"
          component={EditPatient}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}