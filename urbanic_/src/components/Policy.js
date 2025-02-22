import React from "react";
import { useNavigate } from "react-router-dom";
const Policy = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900">Our Policies</h1>
        <p className="mt-4 text-gray-600 text-lg">
          Your trust is our priority. Learn more about our shipping, returns, privacy, and terms of service.
        </p>
      </div>

      {/* Policies Section */}
      <div className="mt-12 max-w-5xl">
        {/* Shipping Policy */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Shipping Policy</h2>
          <p className="mt-2 text-gray-600">
            We offer fast and reliable shipping across the country. Orders are processed within **1-2 business days** 
            and typically arrive within **5-7 business days**. Expedited shipping is available for an additional charge.
          </p>
        </div>

        {/* Return & Exchange Policy */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Return & Exchange Policy</h2>
          <p className="mt-2 text-gray-600">
            If you're not satisfied with your purchase, you can return or exchange the item within **30 days** of 
            receiving it. Items must be in **unused condition with tags attached**.  
            <br />
            **Note:** Clearance and final sale items are non-returnable.
          </p>
        </div>

        {/* Privacy Policy */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Privacy Policy</h2>
          <p className="mt-2 text-gray-600">
            We respect your privacy and are committed to protecting your personal data. Your information is securely
            stored and never shared with third parties without your consent. For more details, review our full
            privacy policy.
          </p>
        </div>

        {/* Terms of Service */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800">Terms of Service</h2>
          <p className="mt-2 text-gray-600">
            By using our website, you agree to our terms and conditions. We reserve the right to update our policies 
            at any time. Please review them regularly to stay informed.
          </p>
        </div>
      </div>

      {/* Contact for Support */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Need Assistance?</h2>
        <p className="mt-2 text-gray-600">If you have any questions, feel free to reach out to our support team.</p>
        <button onClick={navigate('/contact')} className="mt-4 px-4 py-2 text-sm bg-white text-black border-2 border-black font-semibold rounded-md hover:bg-black hover:text-white transition">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default Policy;
