import { Helmet } from "react-helmet-async"

import { useParams } from "../../../routes/hooks"

import { CONFIG } from "../../../global-config"
import { useOneGallery } from "../../../sections/shared/gallery/hooks"
import { GalleryEditView } from "../../../sections/shared/gallery/view"

// ----------------------------------------------------------------------

const metadata = { title: `Gallery edit | Dashboard - ${CONFIG.appName}` }

export default function Page() {
  const { id = "" } = useParams()
  if (!id) {
    return <div>No gallery ID provided!</div>
  }

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
