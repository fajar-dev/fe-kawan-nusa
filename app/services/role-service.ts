import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { ApiResponse } from "../types/auth"
import type { RoleItem, RoleListResponse, PermissionModule } from "../types/role"

export interface RoleQueryParams {
    page?: number
    limit?: number
    q?: string
}

export class RoleService {

    async getRoles(params?: RoleQueryParams): Promise<RoleListResponse> {
        try {
            const response = await apiService.client.get<RoleListResponse>('/role', {
                params,
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch roles')
        }
    }

    async getRoleById(id: number): Promise<ApiResponse<RoleItem>> {
        try {
            const response = await apiService.client.get<ApiResponse<RoleItem>>(`/role/${id}`, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch role detail')
        }
    }

    async createRole(data: { name: string; description?: string; color?: string; permissions?: Record<string, string[]>; employeeIds?: number[] }): Promise<ApiResponse<RoleItem>> {
        try {
            const response = await apiService.client.post<ApiResponse<RoleItem>>('/role', data, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to create role')
        }
    }

    async updateRole(id: number, data: { name?: string; description?: string; color?: string; permissions?: Record<string, string[]>; employeeIds?: number[] }): Promise<ApiResponse<RoleItem>> {
        try {
            const response = await apiService.client.put<ApiResponse<RoleItem>>(`/role/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to update role')
        }
    }

    async deleteRole(id: number): Promise<ApiResponse<null>> {
        try {
            const response = await apiService.client.delete<ApiResponse<null>>(`/role/${id}`, {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to delete role')
        }
    }

    async getPermissionMatrix(): Promise<ApiResponse<PermissionModule[]>> {
        try {
            const response = await apiService.client.get<ApiResponse<PermissionModule[]>>('/role/permission-matrix', {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch permission matrix')
        }
    }

    async getEmployees(): Promise<ApiResponse<RoleEmployee[]>> {
        try {
            const response = await apiService.client.get<ApiResponse<RoleEmployee[]>>('/role/employees', {
                headers: {
                    Authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            return handleServiceError(error || 'Failed to fetch employees')
        }
    }
}

export const roleService = new RoleService()

