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

import AllPatients from '../screens/AllPatients';
import AddPatient from '../screens/AddPatient';
import DuplicatePatients from '../screens/DuplicatePatients';
import DeletedPatients from '../screens/DeletedPatients';

export type DrawerParamList = {
  AllPatients: undefined;
  AddPatient: undefined;
  DuplicatePatients: undefined;
  DeletedPatients: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

function CustomDrawerContent(props: any) {
  const [open, setOpen] = useState(false);

  return (
    <DrawerContentScrollView {...props}>
      <TouchableOpacity
        style={styles.parent}
        onPress={() => setOpen(!open)}
      >
        <Feather name="users" size={20} />
        <Text style={styles.parentText}>Patient Management</Text>
        <Feather
          name={open ? 'chevron-down' : 'chevron-right'}
          size={18}
          style={{ marginLeft: 'auto' }}
        />
      </TouchableOpacity>

      {open && (
        <View style={styles.submenu}>
          <TouchableOpacity
            style={styles.child}
            onPress={() => props.navigation.navigate('AllPatients')}
          >
            <Feather name="list" size={18} />
            <Text style={styles.childText}>All Patients</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.child}
            onPress={() => props.navigation.navigate('AddPatient')}
          >
            <Feather name="user-plus" size={18} />
            <Text style={styles.childText}>Add Patient</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.child}
            onPress={() =>
              props.navigation.navigate('DuplicatePatients')
            }
          >
            <Feather name="copy" size={18} />
            <Text style={styles.childText}>Duplicate Patients</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.child}
            onPress={() =>
              props.navigation.navigate('DeletedPatients')
            }
          >
            <Feather name="trash-2" size={18} />
            <Text style={styles.childText}>Deleted Patients</Text>
          </TouchableOpacity>
        </View>
      )}
    </DrawerContentScrollView>
  );
}

export default function Menu() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: true }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="AllPatients" component={AllPatients} />
      <Drawer.Screen name="AddPatient" component={AddPatient} />
      <Drawer.Screen name="DeletedPatients" component={DeletedPatients} />
      <Drawer.Screen
        name="DuplicatePatients"
        component={DuplicatePatients}
      />
    </Drawer.Navigator>
  );
}

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