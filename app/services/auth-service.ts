import axios from "axios"
import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { AuthResponse, AuthUser, ApiResponse } from "../types/auth"

export class AuthService {
    private readonly ACCESS_TOKEN_KEY = 'accessToken'
    private readonly REFRESH_TOKEN_KEY = 'refreshToken'
    private readonly USER_KEY = 'user'
    private readonly PERMISSIONS_KEY = 'auth_permissions'
    private readonly EMPLOYEE_ROLE_KEY = 'auth_employee_role'

    public user = ref<AuthUser | null>(null)
    public token = ref<string | null>(null)

    constructor() {
        this.restoreSession() // Sync restore
        this.validateSession() // Async validation in background
        apiService.setRefreshHandler(this.refreshToken.bind(this))
    }

    private restoreSession() {
        if (typeof window === 'undefined') return

            const accessToken = localStorage.getItem(this.ACCESS_TOKEN_KEY)
        if (accessToken) {
            this.token.value = accessToken
            const userJson = localStorage.getItem(this.USER_KEY)
            if (userJson) {
                try {
                    this.user.value = JSON.parse(userJson)
                } catch (e) {
                    console.error('Failed to parse user from local storage', e)
                }
            }
        }
    }

    private async validateSession() {
        if (typeof window === 'undefined') return
        const accessToken = this.token.value
        if (!accessToken) return

        try {
            const response = await apiService.client.get<{ success: boolean, data: AuthUser }>('/auth/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            this.user.value = response.data.data
            localStorage.setItem(this.USER_KEY, JSON.stringify(this.user.value))

            // Update permissions for admin users
            if (this.user.value?.permissions) {
                localStorage.setItem(this.PERMISSIONS_KEY, JSON.stringify(this.user.value.permissions))
            }
            if (this.user.value?.employeeRole) {
                localStorage.setItem(this.EMPLOYEE_ROLE_KEY, JSON.stringify(this.user.value.employeeRole))
            }
        } catch (error) {
            // Validation failed, let interceptor handle it
        }
    }

    async refreshUser() {
        if (typeof window === 'undefined') return
        const accessToken = this.token.value
        if (!accessToken) return

        try {
            const response = await apiService.client.get<{ success: boolean, data: AuthUser }>('/auth/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            this.user.value = response.data.data
            localStorage.setItem(this.USER_KEY, JSON.stringify(this.user.value))

            // Update permissions for admin users
            if (this.user.value?.permissions) {
                localStorage.setItem(this.PERMISSIONS_KEY, JSON.stringify(this.user.value.permissions))
            }
            if (this.user.value?.employeeRole) {
                localStorage.setItem(this.EMPLOYEE_ROLE_KEY, JSON.stringify(this.user.value.employeeRole))
            }
        } catch (error) {
            // silently fail
        }
    }

    async refreshToken(): Promise<string | null> {
        if (typeof window === 'undefined') return null

            const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY)
        if (!refreshToken) return null

        try {
            const config = useRuntimeConfig()
            const response = await axios.post<AuthResponse>(`${config.public.apiUrl}/auth/refresh`, {
            refreshToken
        })
        
            this.setSession(response.data)
            return response.data.data.accessToken
        } catch (error) {
            this.logout()
            return null
        }
    }

    async login(identifier: string, password: string): Promise<AuthResponse> {
        try {
            const response = await apiService.client.post<AuthResponse>('/auth/login', { identifier, password })
            this.setSession(response.data)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async register(data: FormData | { name?: string; firstName?: string; lastName?: string; email: string; password?: string }): Promise<ApiResponse<null>> {
        try {
            const isFormData = typeof FormData !== 'undefined' && data instanceof FormData
            const response = await apiService.client.post<ApiResponse<null>>('/auth/register', data, {
                headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async google(code: string): Promise<AuthResponse> {
        try {
            const response = await apiService.client.post<AuthResponse>('/auth/google', { code })
            this.setSession(response.data)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async adminGoogle(code: string): Promise<AuthResponse> {
        try {
            const response = await apiService.client.post<AuthResponse>('/auth/admin/google', { code })
            this.setSession(response.data)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async forgotPassword(email: string): Promise<ApiResponse<null>> {
        try {
            const response = await apiService.client.post<ApiResponse<null>>('/auth/forgot-password', { email })
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async validateResetPassword(token: string): Promise<ApiResponse<null>> {
        try {
            const response = await apiService.client.get<ApiResponse<null>>('/auth/validate-reset-token?token=' + token)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async resetPassword(token: string, newPassword: string): Promise<ApiResponse<null>> {
        try {
            const response = await apiService.client.post<ApiResponse<null>>('/auth/reset-password', { token, newPassword })
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async resendVerification(email: string): Promise<ApiResponse<null>> {
        try {
            const response = await apiService.client.post<ApiResponse<null>>('/auth/resend-verification', { email })
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async verifyEmail(token: string): Promise<AuthResponse> {
        try {
            const response = await apiService.client.get<AuthResponse>('/auth/verify-email?token=' + token)
            this.setSession(response.data)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async checkEmailStatus(email: string): Promise<ApiResponse<any>> {
        try {
            const response = await apiService.client.get<ApiResponse<any>>('/auth/check-email-status?email=' + encodeURIComponent(email))
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async sendOtp(identifier: string): Promise<ApiResponse<{ type: string }>> {
        try {
            const response = await apiService.client.post<ApiResponse<{ type: string }>>('/auth/otp/send', { identifier })
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async verifyOtp(identifier: string, code: string): Promise<AuthResponse> {
        try {
            const response = await apiService.client.post<AuthResponse>('/auth/otp/verify', { identifier, code })
            this.setSession(response.data)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async logout() {
        if (typeof window === 'undefined') return
            const accessToken = localStorage.getItem(this.ACCESS_TOKEN_KEY)

        try {
            if (this.token.value) {
                this.token.value = accessToken  
                await apiService.client.post('/auth/logout',{
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
            }
        } catch (error) {
            console.error('Logout failed:', error)
        } finally {
            localStorage.removeItem(this.ACCESS_TOKEN_KEY)
            localStorage.removeItem(this.REFRESH_TOKEN_KEY)
            localStorage.removeItem(this.USER_KEY)
            localStorage.removeItem(this.PERMISSIONS_KEY)
            localStorage.removeItem(this.EMPLOYEE_ROLE_KEY)

            this.token.value = null
            this.user.value = null
        
            // Ensure redirect happens
            if (window.location.pathname !== '/auth/sign-in') {
                navigateTo('/auth/sign-in')
            }
        }
    }

    private setSession(response: AuthResponse) {
        if (typeof window === 'undefined') return

        const { user, accessToken, refreshToken } = response.data

        localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
        localStorage.setItem(this.USER_KEY, JSON.stringify(user))

        // Store permissions and employee role for admin users
        if (user.permissions) {
            localStorage.setItem(this.PERMISSIONS_KEY, JSON.stringify(user.permissions))
        }
        if (user.employeeRole) {
            localStorage.setItem(this.EMPLOYEE_ROLE_KEY, JSON.stringify(user.employeeRole))
        }

        this.token.value = accessToken
        this.user.value = user
    }
}

export const authService = new AuthService()