import type { User, ApiResponse } from "./auth"

export interface ProfileResponse extends ApiResponse<User> {}

export interface UpdateAccountRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  jobPosition?: string;
  taxNumber?: string;
  identityNumber?: number | null;
}
export interface UpdateBankRequest {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
}
export interface UpdatePasswordRequest {
  oldPassword?: string;
  newPassword: string;
}

export interface UpdatePreferenceRequest {
  isSubscribe?: boolean;
  isAutoWithdraw?: boolean;
}
