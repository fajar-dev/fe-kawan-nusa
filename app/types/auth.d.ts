export interface User {
    id: number
    firstName: string
    lastName: string
    photo: string | null
    email: string | null
    phone: string | null
    company: string | null
    jobPosition: string | null
    taxNumber: string | null
    identityNumber: number | null
    bankDetails: BankDetails
    settings: UserSettings
    role: string
    isActive: boolean
    createdAt: string
    passwordUpdatedAt: string | null
}

export interface BankDetails {
    holderName: string | null
    name: string | null
    number: string | null
}

export interface UserSettings {
    isSubscribe: boolean
    isAutoWithdraw: boolean
}

export interface AuthData {
    user: User
    accessToken: string
    refreshToken: string
}

export interface ApiResponse<T = any> {
    success: boolean
    statusCode: number
    message: string
    data: T
}

export type AuthResponse = ApiResponse<AuthData>