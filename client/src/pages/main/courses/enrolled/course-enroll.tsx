import React, { useEffect, useState } from "react"
import { useParams } from "react-router"
import { useCreatePaymentIntentMutation } from "../../../../store/payment"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import StripePaymentForm from "../../../../payment/stripe-payment-form"
import Spinner from "../../../../components/Spinner"
import { useCourses } from "../../../../sections/main/course/hook/use-course"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!)

const EnrollPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { courses, loading, error } = useCourses()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const course = courses.find((c) => c.id.toString() === id)
  const [createPaymentIntent, { isLoading: isCreating }] =
    useCreatePaymentIntentMutation()

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      if (course) {
        try {
          const response = await createPaymentIntent({
            amount: course.price * 100, // Stripe expects amount in cents
            currency: "USD",
          }).unwrap()
          setClientSecret(response.clientSecret)
        } catch (err) {
          console.error("Failed to create payment intent:", err)
        }
      }
    }

    fetchPaymentIntent()
  }, [course, createPaymentIntent])

  if (loading || isCreating || !stripePromise) return <Spinner />
  if (error || !course) return <p className="text-red-600">Course not found</p>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Enroll in: {course.title}</h1>
      <p className="mb-4 text-gray-700">{course.description}</p>
      <p className="font-semibold mb-6">Price: ${course.price}</p>

      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <StripePaymentForm courseId={course.id} />
        </Elements>
      )}
    </div>
  )
}

export default EnrollPage
