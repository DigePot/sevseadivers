import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z as zod } from "zod"

import { useRouter } from "../../../routes/hooks"

// ----------------------------------------------------------------------

export type NewTripSchemaType = zod.infer<typeof NewTripSchema>

export const NewTripSchema = zod.object({
  name: zod.string().min(1, { message: "Name is required!" }),
})

// ----------------------------------------------------------------------

type Props = {
  currentTrip?: any
}

export function TripEditForm({ currentTrip }: Props) {
  const router = useRouter()

  const defaultValues: NewTripSchemaType = {
    name: "",
  }

  const methods = useForm<NewTripSchemaType>({
    mode: "onSubmit",
    resolver: zodResolver(NewTripSchema),
    defaultValues,
    values: currentTrip,
  })

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const values = watch()

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      reset()
      // router.push(paths.dashboard.user.list);
      console.info("DATA", data)
    } catch (error) {
      console.error(error)
    }
  })

  return <div>edit form</div>
}
