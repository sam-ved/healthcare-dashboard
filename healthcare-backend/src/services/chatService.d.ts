interface ChatRequest {
    message: string;
    role: 'RECEPTIONIST' | 'DOCTOR' | 'NURSE' | 'PATIENT';
}
export declare function getChatResponse(request: ChatRequest): Promise<string>;
export {};
//# sourceMappingURL=chatService.d.ts.map