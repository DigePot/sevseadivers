import { useGetGalleryQuery } from "../../../../store/gallery"
import type { Gallery } from "../../../../types/gallery"

export const useAllGallery = () => {
  const { data, error, isLoading, refetch } = useGetGalleryQuery()
  const allGallery: Gallery[] = data || []

  return { allGallery, refetch, error, isLoading }
}
