import type { Gallery } from "../../../../types/gallery"
import { GalleryEditForm } from "../gallery-edit-form"

// ----------------------------------------------------------------------

type Props = {
  currentGallery?: Gallery | null
}

export function GalleryEditView({ currentGallery: currentGallery }: Props) {
  return <GalleryEditForm currentGallery={currentGallery} />
}
