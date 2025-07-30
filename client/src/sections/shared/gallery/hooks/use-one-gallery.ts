import { useGetOneGalleryQuery } from "../../../../store/gallery"
import type { Gallery } from "../../../../types/gallery"

export const useOneGallery = (id: string) => {
  const { data, error, isLoading } = useGetOneGalleryQuery(id)
  const gallery: Gallery | null = data || null

  return { gallery, error, isLoading }
}
