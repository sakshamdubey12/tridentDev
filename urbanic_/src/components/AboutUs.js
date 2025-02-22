import React from "react";
import { Link } from "react-router-dom";
import pic from "../assets/t5.jpeg"
const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6 py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900">
          Elevate Your Performance with <span className="text-red-600">Elite Gym Apparel</span>
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          Our mission is to empower athletes and fitness enthusiasts with premium, high-performance gym wear that enhances mobility, endurance, and style.
        </p>
      </div>

      {/* Brand Story Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl">
        {/* Left Side - Image */}
        <div className="flex justify-center">
          <img
            src={pic}
            alt="Gym Apparel"
            className="rounded-lg shadow-lg scale-[70%]"
          />
        </div>

        {/* Right Side - Text */}
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-semibold text-gray-800">Our Story</h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Founded by passionate athletes, our brand was born out of the need for gym wear that blends functionality with modern aesthetics.
            We believe in pushing limits and providing apparel that keeps up with your toughest workouts.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="mt-16 max-w-6xl">
        <h2 className="text-3xl font-semibold text-center text-gray-800">Why Choose Us?</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-red-600">Performance-Driven Fabric</h3>
            <p className="mt-2 text-gray-600">Breathable, moisture-wicking, and stretchable materials designed for athletes.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-red-600">Sleek & Modern Design</h3>
            <p className="mt-2 text-gray-600">Minimalistic yet bold designs that make a statement in and out of the gym.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-red-600">Sustainability Focused</h3>
            <p className="mt-2 text-gray-600">We prioritize eco-friendly production and ethical sourcing.</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Ready to Elevate Your Workout?</h2>
        <p className="mt-2 text-gray-600">Explore our latest collection and feel the difference.</p>
        <Link to="/">
          <button className="mt-4 px-6 py-3 bg-black border-2 border-black text-white font-semibold rounded-md hover:bg-white hover:text-black   transition">
            Shop Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AboutUs;
