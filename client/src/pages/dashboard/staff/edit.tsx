import { Helmet } from "react-helmet-async"

// import { useParams } from '../../../routes/hooks';

import { CONFIG } from "../../../global-config"

// ----------------------------------------------------------------------

const metadata = { title: `Staff edit | Dashboard - ${CONFIG.appName}` }

export default function Page() {
  // const { id = '' } = useParams();

  // const currentStaff =

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      {/* <StaffEditView user={currentStaff} /> */}
      <div>Staff Edit</div>
    </>
  )
}
