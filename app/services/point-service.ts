import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { PointResponse } from "../types/point"

export class PointService {
    async getPoint(): Promise<PointResponse> {
        try {
            const response = await apiService.client.get<PointResponse>('/point', {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch points')
        }
    }
}

export const pointService = new PointService()
