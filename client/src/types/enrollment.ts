// src/types/enrollment.ts
export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  enrollmentDate: string;
  status: 'active' | 'completed' | 'cancelled';
  paymentMethod: string;
  amount: number;
  currency: string;
}

export interface CreateEnrollmentRequest {
  courseId: number;
  paymentMethod: string;
  amount: number;
  currency: string;
}