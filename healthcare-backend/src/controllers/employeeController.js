import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { signToken } from '../utils/jwt.js';
export async function employeeLogin(req, res) {
    try {
        const { employeeId, password } = req.body;
        if (!employeeId || !password) {
            return res.status(400).json({ message: 'Employee ID and password are required' });
        }
        const employee = await prisma.employee.findUnique({
            where: { employeeId }
        });
        if (!employee) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isValidPassword = await bcrypt.compare(password, employee.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = signToken({ userId: employee.id, email: employee.employeeId });
        // Remove password from response
        const { password: _, ...employeeData } = employee;
        res.json({
            token,
            employee: employeeData
        });
    }
    catch (error) {
        console.error('Employee login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
//# sourceMappingURL=employeeController.js.map