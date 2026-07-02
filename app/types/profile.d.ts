export interface ProfileBankDetails {
  holderName: string | null;
  name: string | null;
  number: string | null;
  accountPath: string | null;
}

export interface ProfileSettings {
  isSubscribe: boolean;
  isAutoWithdraw: boolean;
}

export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  photo: string | null;
  email: string | null;
  phone: string | null;
  hasWhatsapp: boolean;
  company: string | null;
  jobPosition: string | null;
  taxNumber: string | null;
  identityNumber: number | null;
  birthDate: string | null;
  birthPlace: string | null;
  address: string | null;
  companyAddress: string | null;
  identityPath: string | null;
  bankDetails: ProfileBankDetails;
  settings: ProfileSettings;
  status: 'pending' | 'active' | 'inactive' | 'reject' | 'revision' | null;
  isVerified: boolean;
  isBoarding: boolean;
  createdAt: string;
  passwordUpdatedAt: string | null;
}

export interface ProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Profile;
}

export interface UpdateAccountRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  hasWhatsapp?: boolean;
  company?: string;
  jobPosition?: string;
  taxNumber?: string;
  identityNumber?: number | null;
  birthDate?: string;
  birthPlace?: string;
  address?: string;
  companyAddress?: string;
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
