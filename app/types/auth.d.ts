export interface User {
    id: number
    firstName: string
    lastName: string
    photo: string | null
    email: string
    phone: string
    company: string | null
    jobPosition: string | null
    bankDetails: BankDetails
    settings: UserSettings
    createdAt: string
    passwordUpdatedAt: string
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