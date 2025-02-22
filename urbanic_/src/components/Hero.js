import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroImage from '../assets/hero3.jpg'

export default function Hero({scrollToProducts}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);

  return (
    <motion.div ref={ref} className="relative h-screen w-full overflow-hidden">
      {/* Hero Section */}
      <motion.div
        style={{
          y,
          backgroundImage: `url(${heroImage})`, // Change to your image path
          backgroundSize: "cover",
          backgroundPosition: "top",
        }}
        className="absolute top-0 left-0 w-full h-screen"
      >
        <div className="w-full h-full flex flex-col justify-center items-start bg-black/40 p-8">
  {/* Main Headline */}
  <h1 className="text-white text-6xl md:text-8xl font-bold mb-4">
    Elevate Your Workout
  </h1>

  {/* Subheadline/Description */}
  <p className="text-white text-xl md:text-2xl  max-w-xl mb-6">
    Premium gym apparel designed for peak performance and style.
  </p>

  {/* Call-to-Action Buttons */}
  <div className="flex space-x-4">
    {/* Primary Button with Gradient */}
    <button
  className="
    bg-white 
    text-black 
    border-2 
    border-black 
    font-bold 
    py-2 
    px-6 
    rounded 
    shadow-lg 
    transform 
    transition 
    duration-300 
    hover:bg-black 
    hover:text-white 
    hover:border-white 
    hover:scale-105
  "
  onClick={scrollToProducts}
>
  Shop Now
</button>


    {/* Secondary Button with Outline */}
    <button className="border-2 border-white text-white font-bold py-2 px-6 rounded hover:bg-white hover:text-black transition-colors duration-300">
      New Arrivals
    </button>
  </div>

  {/* Optional Tagline */}
  <p className="text-white text-sm mt-4 text-center max-w-xl">
    Engineered for Performance, Designed for Style
  </p>
</div>

      </motion.div>
    </motion.div>
  );
}
