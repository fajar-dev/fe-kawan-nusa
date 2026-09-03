// NOTE: Prospek Saya is currently a frontend-only prototype (dummy data, no backend yet).
// This shape is expected to change once the real API contract is defined.
export type ProspectStatus = 'Diproses' | 'Disetujui' | 'Ditolak'

export interface Prospect {
  id: number
  name: string
  phone: string
  address: string
  services: string[]
  estimatedPoints: number
  registDate: string
  approvedDate: string | null
  salesPic: string | null
  notes: string | null
  status: ProspectStatus
}
