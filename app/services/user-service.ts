import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { UserListResponse, UserQueryParams } from "../types/user"

export class UserService {
    async getUsers(params?: UserQueryParams): Promise<UserListResponse> {
        try {
            const response = await apiService.client.get<UserListResponse>('/user', {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch users')
        }
    }
}

export const userService = new UserService()
