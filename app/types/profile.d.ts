import type { User, ApiResponse } from "./auth"

export interface ProfileResponse extends ApiResponse<User> {}

export interface UpdateAccountRequest {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone: string;
  company: string;
  jobPosition: string;
}
export interface UpdateBankRequest {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
}
export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
