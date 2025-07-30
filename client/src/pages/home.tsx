import { Helmet } from "react-helmet-async"

import { HomeView } from "../sections/main/home/view"

// ----------------------------------------------------------------------

const metadata = {
  title: "Sevsea: Sevsea",
  description: "Sevsea",
}

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Helmet>

      <HomeView />
    </>
  )
}
