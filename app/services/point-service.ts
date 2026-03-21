import { apiService } from "./api-service"
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
            throw new Error(error.response?.data?.message || 'Failed to fetch points')
        }
    }
}

export const pointService = new PointService()
