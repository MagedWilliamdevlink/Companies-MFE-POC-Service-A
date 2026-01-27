export interface RequestData {
    requestId: string;
    serviceId: string;
    serviceName: string;
    companyName: string;
    status: "تتطلب التوقيع" | "تتطلب الدفع" | "يتطلب التعديل" | "مكتمل" | "قيد المراجعة";
    creationDate: string;
    machineSnapshot: any;
    currentStep: number;
    completedSteps: number[];
    formData: Record<string, any>;
}
export declare function generateRequestId(): string;
export declare function getAllRequests(): RequestData[];
export declare function getSavedRequestById(): any;
export declare function getRequest(requestId: string): RequestData | null;
export declare function saveRequest(request: RequestData): void;
export declare function createRequest(serviceId: string, serviceName: string, companyName?: string): RequestData;
export declare function updateRequestStep(requestId: string, step: number, formData?: Record<string, any>): void;
export declare function getRequestsByService(serviceId: string): RequestData[];
