import { Helmet } from "react-helmet-async"

import { CONFIG } from "../../../global-config"
import { RentalNewCreateForm } from "../../../sections/shared/rental/rental-new-create-form"

const metadata = {
  title: `Create a new Rental item | Dashboard - ${CONFIG.appName}`,
}

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RentalNewCreateForm />
    </>
  )
}
