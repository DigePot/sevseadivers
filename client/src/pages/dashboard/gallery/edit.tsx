import { Helmet } from "react-helmet-async"

import { useParams } from "../../../routes/hooks"

import { CONFIG } from "../../../global-config"
import { useOneGallery } from "../../../sections/dashboard/gallery/hooks"
import { GalleryEditView } from "../../../sections/dashboard/gallery/view"

// ----------------------------------------------------------------------

const metadata = { title: `Gallery edit | Dashboard - ${CONFIG.appName}` }

export default function Page() {
  const { id = "" } = useParams()
  const { gallery } = useOneGallery(id)

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <GalleryEditView currentGallery={gallery} />
    </>
  )
}
