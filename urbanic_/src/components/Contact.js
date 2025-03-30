import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("https://tridentdev-1.onrender.com/api/auth/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert(data.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
        <p className="mt-4 text-gray-600 text-lg">
          Have a question? We'd love to hear from you! Fill out the form or reach out to us directly.
        </p>
      </div>

      {/* Contact Form */}
      <div className="mt-12 bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Send Us a Message</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md focus:ring focus:ring-red-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md focus:ring focus:ring-red-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="w-full p-3 border rounded-md focus:ring focus:ring-red-300"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white border-2 border-black font-semibold py-3 rounded-md hover:bg-white hover:text-black transition"
          >
            Send Message
          </button>
          {submitted && <p className="mt-4 text-green-600 font-medium">Message sent successfully!</p>}
        </form>
      </div>

      {/* Store & Contact Details */}
      <div className="mt-12 w-full max-w-4xl flex flex-wrap justify-around">
        <div className="bg-white shadow-md p-6 rounded-lg w-full md:w-1/3 flex items-center mt-4 md:mt-0">
          <FaPhoneAlt className="text-black text-2xl mr-4" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Call Us</h3>
            <p className="text-gray-600">+1 234 567 8900</p>
          </div>
        </div>

        {/* Email */}
        <div className="bg-white shadow-md p-6 rounded-lg w-full md:w-1/3 flex items-center mt-4 md:mt-0">
          <FaEnvelope className="text-black text-3xl mr-4" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Email Us</h3>
            <p className="text-gray-600">support@gymapparel.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
