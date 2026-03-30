// src/services/api.ts

const BASE_URL = "http://192.168.224.22:8000/api";

/* ======================================================
    Helper Function
====================================================== */

async function request(
  endpoint: string,
  method: string = "GET",
  body?: any
) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error: any) {
    console.error("API Error:", error.message);
    throw error;
  }
}

/* ======================================================
    PATIENT APIs
====================================================== */

export const PatientAPI = {

  // Get All Patients
  getPatients: (search?: string) =>
    request(`/patients${search ? `?search=${search}` : ""}`),

  // Get Single Patient
  getPatient: (id: string) =>
    request(`/patients/${id}`),

  // Create Patient
  createPatient: (data: any) =>
    request(`/patients`, "POST", data),

  // Update Patient
  updatePatient: (id: string, data: any) =>
    request(`/patients/${id}`, "PUT", data),

  // Soft Delete
  deletePatient: (id: string) =>
    request(`/patients/${id}`, "DELETE"),

  // Get Deleted Patients
  getDeletedPatients: () =>
    request(`/patients/deleted/list`),

  // Restore Patient
  restorePatient: (id: string) =>
    request(`/patients/restore/${id}`, "POST"),

  // Permanent Delete
  forceDeletePatient: (id: string) =>
    request(`/patients/force/${id}`, "DELETE"),

  // Toggle Status
  toggleStatus: (id: string, status: boolean) =>
  request(`/patients/${id}`, "PUT", { status }),

  // Toggle VIP
  toggleVip: (id: string, is_vip: boolean) =>
  request(`/patients/${id}`, "PUT", { is_vip }),

  // Get Duplicate Patients
  getDuplicates: () =>
    request(`/patients/duplicates/list`),

  // Merge Patients
  mergePatients: (master_id: string, duplicate_ids: string[]) =>
    request(`/patients/merge`, "POST", {
      master_id,
      duplicate_ids,
    }),

};