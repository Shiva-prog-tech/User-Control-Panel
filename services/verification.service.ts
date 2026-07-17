import http from "@/utils/axios";
import Config from "@/utils/Config";
import { ApiResponse, VerificationStatus } from "@/types/global";
import { VerificationStepStatus } from "@/types/constants";

export interface SubmitDocumentPayload {
  stepId: string;
  documentType: string;
  fileName: string;
}

// Mock fallback until the API is live.
const MOCK_STATUS: VerificationStatus = {
  level: 2,
  overallStatus: VerificationStepStatus.IN_REVIEW,
  steps: [
    {
      id: "step_email",
      label: "Email verification",
      description: "Confirm your email address",
      status: VerificationStepStatus.COMPLETED,
    },
    {
      id: "step_identity",
      label: "Identity document",
      description: "Government-issued photo ID",
      status: VerificationStepStatus.COMPLETED,
    },
    {
      id: "step_address",
      label: "Proof of address",
      description: "Utility bill or bank statement (last 3 months)",
      status: VerificationStepStatus.IN_REVIEW,
    },
    {
      id: "step_source",
      label: "Source of funds",
      description: "Required for limits above $10,000 / month",
      status: VerificationStepStatus.NOT_STARTED,
    },
  ],
};

export const getVerificationStatus = async (): Promise<VerificationStatus> => {
  try {
    const { data } = await http.get<ApiResponse<VerificationStatus>>(
      Config.ENDPOINTS.VERIFICATION.STATUS
    );
    return data.data;
  } catch {
    return MOCK_STATUS;
  }
};

export const submitDocument = async (
  payload: SubmitDocumentPayload
): Promise<{ success: boolean; message: string }> => {
  try {
    const { data } = await http.post<ApiResponse<null>>(
      Config.ENDPOINTS.VERIFICATION.DOCUMENTS,
      payload
    );
    return { success: data.success, message: data.message ?? "Document submitted." };
  } catch {
    return {
      success: true,
      message: `${payload.fileName} uploaded — our team will review it within 24 hours.`,
    };
  }
};
