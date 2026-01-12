import type { Role } from "@prisma/client";
export interface EmployeeData {
    fullName: string;
    email: string;
    mobile: string;
    password: string;
    role: Role;
    department?: string;
    available?: boolean;
}
export interface AuthResult {
    token: string;
    employee: {
        id: number;
        employeeId: string;
        fullName: string;
        role: Role;
        email: string;
    };
}
export declare function registerEmployee(data: EmployeeData): Promise<AuthResult>;
export declare function loginEmployee(identifier: string, password: string): Promise<AuthResult>;
//# sourceMappingURL=authService.d.ts.map