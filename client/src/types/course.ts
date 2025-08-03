export interface Course {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  discountedPrice?: number;
  duration: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  level: string;
  instructorName: string;
  courseId: string;
  videoUrl: string;
  posterUrl?: string;
 instructorBio?: string;
  instructorRating?: number;
  instructorImage?: string;
  rating?: number;
  reviews?: number;
  highlights?: string[];
  whatYouWillLearn?: string[];
  learnPoints?: string[];
  includes: {
    icon: string;
    text: string;
  }[];
    bundle?: boolean;
  certificate?: string;
  prerequisites?: string[];
  minAge?: number; 
  orderIndex :number;
}
