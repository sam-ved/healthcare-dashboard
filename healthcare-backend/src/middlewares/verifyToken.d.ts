import type { NextFunction, Request, Response } from "express";
export interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
    };
}
export declare function verifyToken(req: AuthRequest, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
//# sourceMappingURL=verifyToken.d.ts.map