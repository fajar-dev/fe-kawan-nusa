export interface FeedbackRequest {
  url: string
  type: 'keluhan' | 'saran' | 'pujian'
  message: string
  images: File[]
}

export interface FeedbackEntry {
  timestamp: string
  userId: string
  name: string
  images: string[]
  url: string
  category: string
  message: string
  type: string
  reply: string
}