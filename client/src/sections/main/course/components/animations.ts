import type { Variants } from "framer-motion";

export const cardVariants: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    y: 20,
    scale: 0.98,
    rotateX: -5,
    transition: { 
      delay: i * 0.08, 
      ease: [0.16, 1, 0.3, 1] 
    },
  }),
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.16, 1, 0.3, 1],
      scale: { duration: 0.8 },
      rotateX: { duration: 0.5 }
    },
  },
  hover: {
    y: -4,
    scale: 1.02,
    rotateX: 2,
    boxShadow: [
      "0 4px 8px rgba(32, 194, 248, 0.1)",
      "0 8px 24px rgba(32, 194, 248, 0.15)",
      "0 12px 32px rgba(32, 194, 248, 0.2)"
    ],
    transition: {
      duration: 0.3,
      ease: "easeOut",
      boxShadow: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  },
  tap: {
    scale: 0.98,
    rotateX: -1,
    boxShadow: "0 4px 8px rgba(32, 194, 248, 0.1)",
    transition: { 
      duration: 0.15,
      ease: "easeOut" 
    }
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.98,
    transition: { 
      duration: 0.3,
      ease: "easeIn" 
    }
  }
};