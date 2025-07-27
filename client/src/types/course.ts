export interface Course {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
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
  includes: {
    icon: string;
    text: string;
  }[];
}
