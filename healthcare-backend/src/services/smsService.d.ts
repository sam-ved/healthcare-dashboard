/**
 * Mock SMS Service
 * Simulates sending SMS messages to patients.
 * In a real application, this would integrate with Twilio, Textlocal, etc.
 */
export declare const sendSMS: (to: string, message: string) => Promise<boolean>;
export declare const sendRegistrationSMS: (name: string, pid: string, phone: string) => Promise<boolean>;
//# sourceMappingURL=smsService.d.ts.map