// Request storage utility using localStorage
export interface RequestData {
  requestId: string;
  serviceId: string;
  serviceName: string;
  companyName: string;
  status:
    | "تتطلب التوقيع"
    | "تتطلب الدفع"
    | "يتطلب التعديل"
    | "مكتمل"
    | "قيد المراجعة";
  creationDate: string;
  currentStep: number;
  completedSteps: number[];
  machineSnapshot: any;
  formData: Record<string, any>;
}

const STORAGE_KEY = "service_requests";

// Generate a unique request ID
export function generateRequestId(): string {
  return `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Get all requests
export function getAllRequests(): RequestData[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading requests from storage:", error);
    return [];
  }
}

export function getSavedRequestById() {
  let request = null;
  const pattern = new URLPattern({
    pathname: "/services/:serviceID/:generatedID",
  });
  if (pattern.test(window.location)) {
    const groups = pattern.exec(location).pathname.groups;
    request = getRequest(groups.generatedID);
  }
  return request;
}

// Get a specific request by ID
export function getRequest(requestId: string): RequestData | null {
  const requests = getAllRequests();
  return requests.find((r) => r.requestId === requestId) || null;
}

// Save a request
export function saveRequest(request: RequestData): void {
  if (typeof window === "undefined") return;

  try {
    const requests = getAllRequests();
    const existingIndex = requests.findIndex(
      (r) => r.requestId === request.requestId
    );

    if (existingIndex >= 0) {
      requests[existingIndex] = request;
    } else {
      requests.push(request);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));

    // console.log(JSON.stringify(requests));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("requestUpdated"));
  } catch (error) {
    console.error("Error saving request to storage:", error);
  }
}

// Create a new request
export function createRequest(
  serviceId: string,
  serviceName: string,
  companyName: string = "الهلال للأستثمار والتنمية العمرانية"
): RequestData {
  const requestId = generateRequestId();
  const request: RequestData = {
    requestId,
    serviceId,
    serviceName,
    companyName,
    status: "تتطلب التوقيع",
    creationDate: new Date().toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }),
    machineSnapshot: null,
    currentStep: 1,
    completedSteps: [],
    formData: {},
  };

  saveRequest(request);
  return request;
}

// Update request step and form data
export function updateRequestStep(
  requestId: string,
  step: number,
  formData?: Record<string, any>,
  machineSnapshot?: any
): void {
  const request = getRequest(requestId);
  if (!request) return;

  request.currentStep = step;
  if (formData) {
    request.formData = { ...request.formData, ...formData };
  }

  if (machineSnapshot) {
    request.machineSnapshot = machineSnapshot;
  }

  saveRequest(request);
}

// Get requests for a specific service
export function getRequestsByService(serviceId: string): RequestData[] {
  const requests = getAllRequests();
  return requests.filter((r) => r.serviceId === serviceId);
}

export function getRequestID() {
  const pattern = new URLPattern({
    pathname: "/services/:serviceID/:requestID",
  });
  if (pattern.test(location)) {
    const groups = pattern.exec(location).pathname.groups;
    return groups?.requestID;
  }
  return null;
}
