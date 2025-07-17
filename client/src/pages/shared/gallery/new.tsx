import { Helmet } from "react-helmet-async"

import { CONFIG } from "../../../global-config"
import { GalleryCreateView } from "../../../sections/shared/gallery/view"

const metadata = {
  title: `Create a new Gallery | Dashboard - ${CONFIG.appName}`,
}

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <GalleryCreateView />
    </>
  )
}
