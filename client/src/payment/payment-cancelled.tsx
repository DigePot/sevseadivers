// src/pages/PaymentCancelled.tsx
import React from "react"
import { useNavigate } from "react-router"

const PaymentCancelled: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="text-center mt-20">
      <h2 className="text-xl text-red-600 font-bold mb-4">Payment Cancelled</h2>
      <p className="mb-6">You can try enrolling again later.</p>
      <button
        onClick={() => navigate("/courses")}
        className="bg-cyan-600 text-white px-6 py-2 rounded"
      >
        Back to Courses
      </button>
    </div>
  )
}

export default PaymentCancelled
