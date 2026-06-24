import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { ProfileResponse, UpdateAccountRequest, UpdateBankRequest, UpdatePasswordRequest, UpdatePreferenceRequest } from "../types/profile"
import type { ApiResponse } from "../types/auth"

export class ProfileService {
    async getProfile(): Promise<ProfileResponse> {
        try {
            const response = await apiService.client.get<ProfileResponse>('/profile', {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch profile')
        }
    }

    async updateAccount(data: UpdateAccountRequest): Promise<ProfileResponse> {
        try {
            const response = await apiService.client.put<ProfileResponse>('/profile/account', data, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to update account')
        }
    }

    async updateBank(data: UpdateBankRequest): Promise<ProfileResponse> {
        try {
            const response = await apiService.client.put<ProfileResponse>('/profile/bank', data, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to update bank info')
        }
    }

    async updatePassword(data: UpdatePasswordRequest): Promise<ApiResponse<null>> {
        try {
            const response = await apiService.client.put<ApiResponse<null>>('/profile/password', data, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to update password')
        }
    }

    async updatePreference(data: UpdatePreferenceRequest): Promise<ProfileResponse> {
        try {
            const response = await apiService.client.put<ProfileResponse>('/profile/preference', data, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to update preferences')
        }
    }

    async updatePhoto(file: File): Promise<ProfileResponse> {
        try {
            const formData = new FormData()
            formData.append('photo', file)
            const response = await apiService.client.post<ProfileResponse>('/profile/photo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to upload photo')
        }
    }

    async completeBoarding(): Promise<ProfileResponse> {
        try {
            const response = await apiService.client.post<ProfileResponse>('/profile/complete-boarding', {}, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to complete boarding')
        }
    }

    async updateDocuments(identityFile?: File, accountFile?: File): Promise<ProfileResponse> {
        try {
            const formData = new FormData()
            if (identityFile) formData.append('identity', identityFile)
            if (accountFile) formData.append('account', accountFile)
            const response = await apiService.client.post<ProfileResponse>('/profile/documents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to upload documents')
        }
    }
}

export const profileService = new ProfileService()
