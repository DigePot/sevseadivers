import type { Variants } from "framer-motion";

export const cardVariants: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: { delay: i * 0.1, ease: "easeOut" },
  }),
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  hover: {
    scale: 1.02,
    boxShadow:
      "0 8px 16px rgba(32, 194, 248, 0.15), 0 0 6px rgba(32, 194, 248, 0.2)",
    transition: { duration: 0.2, ease: "easeOut" },
  },
  tap: {
    scale: 0.98,
  },
};
