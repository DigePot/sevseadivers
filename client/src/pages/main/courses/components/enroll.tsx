import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetCourseQuery } from "../../../../store/course";
import { useAuth } from "../../../../sections/auth/hooks/use-auth";

const PaymentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: course, isLoading } = useGetCourseQuery(id);
  const { user } = useAuth();
  const [form, setForm] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!user) {
    navigate(`/auth/sign-in?redirect=/courses/${id}/enroll`);
    return null;
  }
  if (isLoading) return <div>Loading...</div>;
  if (!course) return <div>Course not found.</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow mt-10 text-center">
        <h2 className="text-2xl font-bold text-cyan-700 mb-4">Payment Successful!</h2>
        <p className="mb-6">You are now enrolled in <span className="font-semibold">{course.title}</span>.</p>
        <button
          className="bg-cyan-600 text-white px-6 py-2 rounded-lg font-semibold"
          onClick={() => navigate("/courses")}
        >
          Go to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-cyan-700">Secure Payment</h1>
      <div className="bg-[#E4F6FD] rounded-xl p-6 mb-8">
        <h2 className="font-semibold mb-2">Course Summary</h2>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <div>
            <div className="text-gray-700 font-medium">{course.title}</div>
            <div className="text-gray-500 text-sm">{course.duration}</div>
          </div>
          <div className="text-cyan-700 font-bold text-lg">{course.price} €</div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={form.cardNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-cyan-300 focus:ring-2 focus:ring-cyan-200 focus:outline-none"
            placeholder="Enter card number"
            required
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Expiry Date</label>
            <input
              type="text"
              name="expiry"
              value={form.expiry}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-cyan-300 focus:ring-2 focus:ring-cyan-200 focus:outline-none"
              placeholder="MM/YY"
              required
            />
          </div>
          <div className="w-24">
            <label className="block text-sm font-medium mb-1">CVV</label>
            <input
              type="text"
              name="cvv"
              value={form.cvv}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-cyan-300 focus:ring-2 focus:ring-cyan-200 focus:outline-none"
              placeholder="123"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cardholder Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-cyan-300 focus:ring-2 focus:ring-cyan-200 focus:outline-none"
            placeholder="Enter cardholder name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Billing Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-cyan-300 focus:ring-2 focus:ring-cyan-200 focus:outline-none mb-2"
            placeholder="Enter address"
            required
          />
          <div className="flex gap-4">
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="flex-1 px-4 py-2 rounded-lg border border-cyan-300 focus:ring-2 focus:ring-cyan-200 focus:outline-none"
              placeholder="City"
              required
            />
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              className="w-24 px-4 py-2 rounded-lg border border-cyan-300 focus:ring-2 focus:ring-cyan-200 focus:outline-none"
              placeholder="State"
              required
            />
            <input
              type="text"
              name="zip"
              value={form.zip}
              onChange={handleChange}
              className="w-32 px-4 py-2 rounded-lg border border-cyan-300 focus:ring-2 focus:ring-cyan-200 focus:outline-none"
              placeholder="Zip Code"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition"
        >
          {isSubmitting ? "Processing..." : "Pay Now"}
        </button>
      </form>
      <p className="text-xs text-gray-400 text-center mt-4">Your payment is secure and encrypted</p>
    </div>
  );
};

export default PaymentForm;
