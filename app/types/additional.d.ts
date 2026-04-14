import type { ApiResponse } from "./auth"

export interface AdditionalItem {
  code: string
  name: string
}

export type AdditionalResponse = ApiResponse<AdditionalItem[]>

export interface SearchResult {
  title: string
  module: string
  route: string
}

export type SearchResponse = ApiResponse<SearchResult[]>
