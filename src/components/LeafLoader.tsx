import React from "react";
import { motion } from "framer-motion";

const LeafSVG = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="#4CAF50"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.657 6.343a8 8 0 1 0 0 11.314L22 12l-4.343-5.657z" />
  </svg>
);

export const LeafLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      <motion.div
        className="text-green-500"
        initial={{ rotate: -20, y: 0 }}
        animate={{
          rotate: [-20, 20, -20],
          y: [0, -5, 0],
        }}
        transition={{
          duration: 2.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <LeafSVG />
      </motion.div>
      <motion.p
        className="mt-4 text-lg text-gray-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        Analyzing your skin...
      </motion.p>
    </div>
  );
};
