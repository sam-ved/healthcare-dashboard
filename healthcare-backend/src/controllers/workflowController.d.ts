import type { Request, Response } from 'express';
/**
 * Receptionist: Register a new patient
 * POST /patients/register
 */
export declare function registerPatient(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Receptionist: Assign a doctor to a patient
 * PUT /patients/:id/assign-doctor
 */
export declare function assignDoctor(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Receptionist: Search for patients by name or ID
 * GET /patients/search?q=query
 */
export declare function searchPatient(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Doctor: Get list of patients assigned to this doctor
 * GET /doctor/:id/patients
 */
export declare function getDoctorPatients(req: Request, res: Response): Promise<void>;
/**
 * Doctor: Submit consultation for a patient
 * PUT /doctor/consultation/:patientId
 */
export declare function submitConsultation(req: Request, res: Response): Promise<void>;
/**
 * Nurse: Get dashboard view - all active patients with doctor details
 * GET /nurse/dashboard
 */
export declare function getNurseDashboard(req: Request, res: Response): Promise<void>;
/**
 * Nurse: Update patient admission status
 * PUT /nurse/admit/:patientId
 */
export declare function admitPatient(req: Request, res: Response): Promise<void>;
/**
 * Nurse: Discharge a patient
 * PUT /nurse/discharge/:patientId
 */
export declare function dischargePatient(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=workflowController.d.ts.map