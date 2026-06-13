// src/services/api.ts

// const BASE_URL = "http://192.168.224.22:8000/api";

/* ======================================================
    Helper Function
====================================================== */

// async function request(
//   endpoint: string,
//   method: string = "GET",
//   body?: any
// ) {
//   try {
//     const response = await fetch(`${BASE_URL}${endpoint}`, {
//       method,
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//       body: body ? JSON.stringify(body) : undefined,
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Something went wrong");
//     }

//     return data;
//   } catch (error: any) {
//     console.error("API Error:", error.message);
//     throw error;
//   }
// }

/* ======================================================
    PATIENT APIs
====================================================== */

// export const PatientAPI = {

//   // Get All Patients
//   getPatients: (search?: string) =>
//     request(`/patients${search ? `?search=${search}` : ""}`),

//   // Get Single Patient
//   getPatient: (id: string) =>
//     request(`/patients/${id}`),

//   // Create Patient
//   createPatient: (data: any) =>
//     request(`/patients`, "POST", data),

//   // Update Patient
//   updatePatient: (id: string, data: any) =>
//     request(`/patients/${id}`, "PUT", data),

//   // Soft Delete
//   deletePatient: (id: string) =>
//     request(`/patients/${id}`, "DELETE"),

//   // Get Deleted Patients
//   getDeletedPatients: () =>
//     request(`/patients/deleted/list`),

//   // Restore Patient
//   restorePatient: (id: string) =>
//     request(`/patients/restore/${id}`, "POST"),

//   // Permanent Delete
//   forceDeletePatient: (id: string) =>
//     request(`/patients/force/${id}`, "DELETE"),

//   // Toggle Status
//   toggleStatus: (id: string, status: boolean) =>
//   request(`/patients/${id}`, "PUT", { status }),

//   // Toggle VIP
//   toggleVip: (id: string, is_vip: boolean) =>
//   request(`/patients/${id}`, "PUT", { is_vip }),

//   // Get Duplicate Patients
//   getDuplicates: () =>
//     request(`/patients/duplicates/list`),

//   // Merge Patients
//   mergePatients: (master_id: string, duplicate_ids: string[]) =>
//     request(`/patients/merge`, "POST", {
//       master_id,
//       duplicate_ids,
//     }),

// };

// src/services/api.ts

const BASE_URL = 'http://192.168.187.22:8000/api';

/* ======================================================
   Helper Function
====================================================== */

async function request(
  endpoint: string,
  method: string = 'GET',
  body?: any
) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error: any) {
    console.error('API Error:', error.message);
    throw error;
  }
}

/* ======================================================
   EQUIPMENT APIs
====================================================== */

export const EquipmentAPI = {
  // Get All Equipment
  getEquipment: (search?: string) =>
    request(`/equipment${search ? `?search=${search}` : ''}`),

  // Get Single Equipment
  getEquipmentById: (id: string) =>
    request(`/equipment/${id}`),

  // Create Equipment
  createEquipment: (data: any) =>
    request('/equipment', 'POST', data),

  // Update Equipment
  updateEquipment: (id: string, data: any) =>
    request(`/equipment/${id}`, 'PUT', data),

  // Soft Delete
  deleteEquipment: (id: string) =>
    request(`/equipment/${id}`, 'DELETE'),

  // Get Deleted Equipment
  getDeletedEquipment: () =>
    request('/equipment/deleted/list'),

  // Restore Equipment
  restoreEquipment: (id: string) =>
    request(`/equipment/${id}/restore`, 'POST'),

  // Permanent Delete
  forceDeleteEquipment: (id: string) =>
    request(`/equipment/${id}/force-delete`, 'DELETE'),

  // Toggle Status
  toggleStatus: (id: string) =>
    request(`/equipment/${id}/toggle-status`, 'POST'),
};

export default EquipmentAPI;

/* ======================================================
   MAINTENANCE APIs
====================================================== */

export const MaintenanceAPI = {
  // Get All Maintenance
  getMaintenance: (search?: string) =>
    request(`/maintenance${search ? `?search=${search}` : ''}`),

  // Get Single Maintenance
  getMaintenanceById: (id: string) =>
    request(`/maintenance/${id}`),

  // Create Maintenance
  createMaintenance: (data: any) =>
    request('/maintenance', 'POST', data),

  // Update Maintenance
  updateMaintenance: (id: string, data: any) =>
    request(`/maintenance/${id}`, 'PUT', data),

  // Delete
  deleteMaintenance: (id: string) =>
    request(`/maintenance/${id}`, 'DELETE'),

  // Deleted List
  getDeletedMaintenance: () =>
    request('/maintenance/deleted/list'),

  // Restore
  restoreMaintenance: (id: string) =>
    request(`/maintenance/${id}/restore`, 'POST'),

  // Permanent Delete
  forceDeleteMaintenance: (id: string) =>
    request(`/maintenance/${id}/force-delete`, 'DELETE'),
};

export const CalibrationAPI = {
  getCalibration: (search?: string) =>
    request(`/calibration${search ? `?search=${search}` : ''}`),

  getCalibrationById: (id: string) =>
    request(`/calibration/${id}`),

  createCalibration: (data: any) =>
    request('/calibration', 'POST', data),

  updateCalibration: (id: string, data: any) =>
    request(`/calibration/${id}`, 'PUT', data),

  deleteCalibration: (id: string) =>
    request(`/calibration/${id}`, 'DELETE'),

  getDeletedCalibration: () =>
    request('/calibration/deleted/list'),

  restoreCalibration: (id: string) =>
    request(`/calibration/${id}/restore`, 'POST'),

  forceDeleteCalibration: (id: string) =>
    request(`/calibration/${id}/force-delete`, 'DELETE'),
};

export const BreakdownAPI = {
  getBreakdowns: (search?: string) =>
    request(`/breakdown${search ? `?search=${search}` : ''}`),

  getBreakdownById: (id: string) =>
    request(`/breakdown/${id}`),

  createBreakdown: (data: any) =>
    request('/breakdown', 'POST', data),

  updateBreakdown: (id: string, data: any) =>
    request(`/breakdown/${id}`, 'PUT', data),

  deleteBreakdown: (id: string) =>
    request(`/breakdown/${id}`, 'DELETE'),

  getDeletedBreakdown: () =>
    request('/breakdown/deleted/list'),

  restoreBreakdown: (id: string) =>
    request(`/breakdown/${id}/restore`, 'POST'),

  forceDeleteBreakdown: (id: string) =>
    request(`/breakdown/${id}/force-delete`, 'DELETE'),
};

export const PreventiveAPI = {
  getPreventiveSchedules: (search?: string) =>
    request(
      `/preventive${search ? `?search=${search}` : ''}`
    ),

  getPreventiveById: (id: string) =>
    request(`/preventive/${id}`),

  createPreventiveSchedule: (data: any) =>
    request('/preventive', 'POST', data),

  updatePreventiveSchedule: (
    id: string,
    data: any
  ) =>
    request(`/preventive/${id}`, 'PUT', data),

  deletePreventiveSchedule: (id: string) =>
    request(`/preventive/${id}`, 'DELETE'),

  getDeletedPreventiveSchedules: () =>
    request('/preventive/deleted/list'),

  restorePreventiveSchedule: (id: string) =>
    request(`/preventive/${id}/restore`, 'POST'),

  forceDeletePreventiveSchedule: (
    id: string
  ) =>
    request(
      `/preventive/${id}/force-delete`,
      'DELETE'
    ),
};