export interface AuthUser {
    id: number
    name: string
    photo: string | null
    email: string | null
    phone: string | null
    status: 'pending' | 'active' | 'inactive' | 'reject' | 'revision' | null
    statusNote: string | null
    isVerified: boolean
    isBoarding: boolean
    role: 'user' | 'admin'
    employeeRole?: {
        id: number
        name: string
        color: string | null
    } | null
    permissions?: Record<string, string[]>
}

export interface AuthData {
    user: AuthUser
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