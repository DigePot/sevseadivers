export interface Gallery {
  id: number
  title: string
  description: string
  mediaUrl: string
  mediaType: string
  isActive: boolean
  uploadedBy: number
  createdAt: string
  updatedAt: string
  uploader: {
    id: number
    username: string
    fullName: string
  }
}
