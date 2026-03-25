import type { ApiResponse } from "./auth"

export interface AdditionalItem {
  code: string
  name: string
}

export type AdditionalResponse = ApiResponse<AdditionalItem[]>
