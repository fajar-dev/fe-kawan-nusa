import type { ApiResponse } from "./auth"

export interface Point {
  value: number
}

export interface PointResponse extends ApiResponse<Point> {}
