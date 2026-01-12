import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { signToken } from "../utils/jwt.js";
export async function registerEmployee(data) {
    const { fullName, email, mobile, password, role, department, available } = data;
    const existing = await prisma.employee.findFirst({
        where: {
            OR: [{ email }, { mobile }]
        }
    });
    if (existing) {
        throw new Error("Employee with this email or mobile already exists");
    }
    const hashed = await bcrypt.hash(password, 10);
    // Generate Custom ID
    let prefix = '';
    if (role === 'DOCTOR')
        prefix = `DOC-${department?.toUpperCase().substring(0, 6) || 'GEN'}`;
    else if (role === 'NURSE')
        prefix = 'NURSE';
    else if (role === 'RECEPTIONIST')
        prefix = 'REC';
    else if (role === 'WARDBOY')
        prefix = 'WARDBOY';
    else if (role === 'ADMIN')
        prefix = 'ADMIN';
    const count = await prisma.employee.count({
        where: { role }
    });
    const employeeId = `${prefix}-${(count + 1).toString().padStart(3, '0')}`;
    const employee = await prisma.employee.create({
        data: {
            employeeId, // Use custom ID
            fullName,
            email,
            mobile,
            password: hashed,
            role,
            department: department ?? null,
            available: available ?? true
        }
    });
    const token = signToken({ id: employee.id, employeeId: employee.employeeId, role: employee.role, email: employee.email });
    return {
        token,
        employee: {
            id: employee.id,
            employeeId: employee.employeeId,
            fullName: employee.fullName,
            role: employee.role,
            email: employee.email
        }
    };
}
export async function loginEmployee(identifier, password) {
    // identifier can be employeeId, mobile, or email
    const employee = await prisma.employee.findFirst({
        where: {
            OR: [
                { employeeId: identifier },
                { email: identifier },
                { mobile: identifier }
            ]
        }
    });
    if (!employee) {
        throw new Error("Invalid credentials");
    }
    const isValid = await bcrypt.compare(password, employee.password);
    if (!isValid) {
        throw new Error("Invalid credentials");
    }
    const token = signToken({ id: employee.id, employeeId: employee.employeeId, role: employee.role, email: employee.email });
    return {
        token,
        employee: {
            id: employee.id,
            employeeId: employee.employeeId,
            fullName: employee.fullName,
            role: employee.role,
            email: employee.email
        }
    };
}
//# sourceMappingURL=authService.js.map