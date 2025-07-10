import { Helmet } from "react-helmet-async"

import { CONFIG } from "../../../global-config"
import { GalleryListView } from "../../../sections/dashboard/gallery/view"

// ----------------------------------------------------------------------

const metadata = { title: `Gallery list | Dashboard - ${CONFIG.appName}` }

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <GalleryListView />
    </>
  )
}
