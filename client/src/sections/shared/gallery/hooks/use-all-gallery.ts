import { useGetGalleryQuery } from "../../../../store/gallery"
import type { Gallery } from "../../../../types/gallery"

export const useAllGallery = () => {
  const { data, error, isLoading } = useGetGalleryQuery()
  // console.log("data", data)
  const allGallery: Gallery[] = data || []

  return { allGallery, error, isLoading }
}
