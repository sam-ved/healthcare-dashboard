import type { Response } from "express";
import type { AuthRequest } from "../middlewares/verifyToken.js";
export declare function createPatientHandler(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getPatientByIdHandler(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function searchPatientHandler(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function listPatientsHandler(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function togglePatientStatusHandler(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deletePatientHandler(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=patientController.d.ts.map