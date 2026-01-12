import type { Request, Response } from 'express';
export declare function getQueueByDoctor(req: Request, res: Response): Promise<void>;
export declare function getVisitById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getVisitsByDoctor(req: Request, res: Response): Promise<void>;
export declare function createVisit(req: Request, res: Response): Promise<void>;
export declare function updateVisit(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=visitController.d.ts.map