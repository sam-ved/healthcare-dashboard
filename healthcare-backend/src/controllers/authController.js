import { loginEmployee, registerEmployee } from "../services/authService.js";
export async function register(req, res) {
    // role is required now
    const { fullName, email, mobile, password, role, department } = req.body;
    if (!fullName || !email || !mobile || !password || !role) {
        return res.status(400).json({ message: "Full Name, email, mobile, password, and role are required" });
    }
    try {
        const result = await registerEmployee({ fullName, email, mobile, password, role, department });
        return res.status(201).json(result);
    }
    catch (err) {
        return res.status(400).json({ message: err.message });
    }
}
export async function login(req, res) {
    // identifier can be email, mobile, or employeeId
    const { identifier, password } = req.body;
    if (!identifier || !password) {
        return res.status(400).json({ message: "Identifier (Email/Mobile/ID) and password are required" });
    }
    try {
        const result = await loginEmployee(identifier, password);
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(400).json({ message: err.message });
    }
}
//# sourceMappingURL=authController.js.map