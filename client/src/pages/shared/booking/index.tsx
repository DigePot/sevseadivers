import { Helmet } from "react-helmet-async"

import { CONFIG } from "../../../global-config"
import { BookingListView } from "../../../sections/shared/booking/view"

// ----------------------------------------------------------------------

const metadata = { title: `Booking - ${CONFIG.appName}` }

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BookingListView />
    </>
  )
}
