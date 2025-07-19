// src/components/StripePaymentForm.tsx
import React, { useEffect, useState } from "react";
import { 
  CardNumberElement, 
  CardExpiryElement, 
  CardCvcElement,
  useStripe, 
  useElements 
} from "@stripe/react-stripe-js";

import { useParams, useNavigate } from "react-router-dom";
import { useGetCourseQuery } from "../store/course";
import usePayment from "./hook/use-payment";
import { useCreateEnrollmentMutation } from "../store/enrollment";
import { useAuth } from "../sections/auth/hooks/use-auth";




const StripePaymentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: course, isLoading: courseLoading } = useGetCourseQuery(id);
  const stripe = useStripe();
  const elements = useElements();
  const [createEnrollment] = useCreateEnrollmentMutation();
   const { userId } = useAuth();
  // payment hook
  const amount = course ? Number(course.price) : 0;
  const { 
    clientSecret, 
    error: paymentIntentError, 
    isLoading: paymentIntentLoading 
  } = usePayment(amount);
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("US");
  const [postalCode, setPostalCode] = useState("");
  

  

  // Handle payment intent errors
  useEffect(() => {
    if (paymentIntentError) {
      setError(paymentIntentError);
    }
  }, [paymentIntentError]);

  const stripeElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#0e7490',
        '::placeholder': {
          color: '#a5b4fc',
        },
      },
      invalid: {
        color: '#f56565',
      },
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    if (!stripe || !elements || !clientSecret) {
      setError("Payment system is not ready. Please try again.");
      setIsSubmitting(false);
      return;
    }

    // Basic validation
    if (!email || !name || !postalCode) {
      setError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) {
        throw new Error("Card information is incomplete");
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name,
              email,
              address: {
                country,
                postal_code: postalCode
              }
            }
          }
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message || "Payment failed");
      }

     if (paymentIntent && paymentIntent.status === "succeeded") {
       try {
     await createEnrollment({
         userId: userId!,
         courseId: course?.id,
         paymentMethod: "stripe",
         amount: course?.price,
         currency: "USD"
    }).unwrap();

    setSuccess(true);
  } catch (err: any) {
    // Enhanced error logging
    console.error('Enrollment error:', {
      status: err.status,
      data: err.data,
      originalStatus: err.originalStatus
    });
    
    setError(
      err.data?.error?.message || 
      "Enrollment failed. Please contact support with your payment ID: " + 
      paymentIntent.id
    );
  }
 }
    } catch (err: any) {
      // Convert error to readable string
      let errorMessage = "Payment failed";
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.message) {
        errorMessage = typeof err.response.data.message === 'string'
          ? err.response.data.message
          : JSON.stringify(err.response.data.message);
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  // Combine loading states
  const isLoading = courseLoading || paymentIntentLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600 mb-4"></div>
          <p className="text-cyan-700 text-lg">Preparing payment...</p>
        </div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Course Not Found</h2>
          <p className="mb-6 text-gray-600">
            The course you're trying to enroll in could not be found.
          </p>
          <button
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-medium transition"
            onClick={() => navigate("/courses")}
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
          <p className="mb-6 text-gray-600">
            You are now enrolled in <span className="font-semibold">{course.title}</span>.
          </p>
          <button
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition"
            onClick={() => navigate("/mycourses")}
          >
            Go to My Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-cyan-800 mb-2">Secure Payment</h1>
          <p className="text-cyan-600">Complete your purchase for {course.title}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
            <h2 className="text-xl font-bold">Course Summary</h2>
            <p className="opacity-90">{course.title}</p>
          </div>
          
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-800">Course Fee</h3>
                <p className="text-gray-500 text-sm">One-time payment</p>
              </div>
              <div className="text-2xl font-bold text-cyan-700">{course.price} $</div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Information</label>
              <div className="bg-gray-50 rounded-lg border border-gray-300 px-4 py-3 mb-3">
                <CardNumberElement 
                  options={stripeElementOptions} 
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg border border-gray-300 px-4 py-3">
                  <CardExpiryElement options={stripeElementOptions} />
                </div>
                <div className="bg-gray-50 rounded-lg border border-gray-300 px-4 py-3">
                  <CardCvcElement options={stripeElementOptions} />
                </div>
              </div>
        
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Name on card</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Zhang San"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country or region</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="SO">Somalia</option>
                  <option value="KE">Kenya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP / Postal code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="12345"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  required
                />
              </div>
            </div>
            
            {error && (
              <div className="mb-6 text-red-500 text-sm p-3 bg-red-50 rounded-lg border border-red-100">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting || !stripe || !clientSecret}
              className={`w-full text-white font-medium py-4 rounded-lg transition ${
                isSubmitting || !stripe || !clientSecret
                  ? "bg-cyan-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Payment...
                </div>
              ) : (
                `Pay ${course.price} $`
              )}
            </button>
            
            <div className="flex items-center justify-center mt-6">
              <div className="flex items-center">
                <div className="mr-2 text-gray-400 text-sm">Secured by</div>
                <div className="bg-gray-100 rounded px-2 py-1">
                  <svg className="h-6 w-12" viewBox="0 0 28 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 0H6C2.686 0 0 2.686 0 6v8c0 3.314 2.686 6 6 6h16c3.314 0 6-2.686 6-6V6c0-3.314-2.686-6-6-6z" fill="#6772e5"/>
                    <path d="M14 12a2 2 0 100-4 2 2 0 000 4z" fill="#fff"/>
                    <path d="M22 5h-2a1 1 0 000 2h2a1 1 0 000-2z" fill="#fff" opacity=".8"/>
                  </svg>
                </div>
              </div>
            </div>
          </form>
        </div>
        
        <div className="mt-8 text-center text-cyan-700 text-sm">
          <p>All transactions are encrypted and securely processed</p>
          <p className="mt-1">© {new Date().getFullYear()} Learning Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default StripePaymentForm;