import { apiService } from "./api-service"
import type { AdditionalResponse } from "../types/additional"
import { handleServiceError } from "../composables/error-helper"

export class AdditionalService {
    async getServices(): Promise<AdditionalResponse> {
        try {
            const response = await apiService.client.get<AdditionalResponse>('/additional/service', {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Gagal mengambil daftar layanan tambahan')
        }
    }

    async getCustomerTypes(): Promise<AdditionalResponse> {
        try {
            const response = await apiService.client.get<AdditionalResponse>('/additional/customer-type', {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Gagal mengambil daftar tipe pelanggan tambahan')
        }
    }
}

export const additionalService = new AdditionalService()
