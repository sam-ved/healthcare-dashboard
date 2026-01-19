/**
 * Mock SMS Service
 * Simulates sending SMS messages to patients.
 * In a real application, this would integrate with Twilio, Textlocal, etc.
 */
export const sendSMS = async (to, message) => {
    console.log(`\n========= SMS SENT =========`);
    console.log(`To: ${to}`);
    console.log(`Message: ${message}`);
    console.log(`============================\n`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
};
export const sendRegistrationSMS = async (name, pid, phone) => {
    const message = `Welcome to Growth Catalysts Hospital. Dear ${name}, your Patient ID is ${pid}. Thank you and take care.`;
    return await sendSMS(phone, message);
};
//# sourceMappingURL=smsService.js.map