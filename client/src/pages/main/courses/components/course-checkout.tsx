import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useParams } from "react-router-dom";
import { useCourses } from "../../../../sections/main/course/hook/use-course";
import StripePaymentForm from "../../../../payment/stripe-payment-form";
import Spinner from "../../../../components/Spinner"; 

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

const CheckoutPage = () => {
  const { id } = useParams<{ id: string }>(); 
  const { courses, loading, error } = useCourses();
  
  // Find the specific course by ID
  const course = courses.find(c => c.id.toString() === id);

  if (loading) return <Spinner />;
  
  if (error) return (
    <div className="text-red-600 text-center p-8">
      Error loading course: {error}
    </div>
  );
  
  if (!course) return (
    <div className="text-center p-8">
      <h2 className="text-xl font-semibold mb-4">Course Not Found</h2>
      <p>The course you're looking for does not exist.</p>
    </div>
  );

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-semibold text-center mb-6">Checkout</h1>
      <Elements stripe={stripePromise}>
        <StripePaymentForm courseId={course.id} />
      </Elements>
    </div>
  );
};

export default CheckoutPage;