export interface AuthUser {
    id: number
    name: string
    photo: string | null
    email: string | null
    phone: string | null
    status: 'pending' | 'active' | 'inactive' | 'reject' | 'revision' | null
    isBoarding: boolean
    role: 'user' | 'admin'
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