import type { Request, Response } from 'express';
export declare function getTriageStats(req: Request, res: Response): Promise<void>;
export declare function getAnalytics(req: Request, res: Response): Promise<void>;
export declare function getReceptionDashboard(req: Request, res: Response): Promise<void>;
export declare function getDoctorStats(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=statsController.d.ts.map