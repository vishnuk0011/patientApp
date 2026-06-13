export type RootStackParamList = {
  DrawerMenu: undefined;  
  // // Patient
  // AllPatients: undefined;
  // AddPatient: undefined;
  // EditPatient: { id: string };

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