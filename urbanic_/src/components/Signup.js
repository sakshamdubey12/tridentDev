import React from "react";

const SignupForm = () => {
  return (
    <form>
      <label className="block mb-2 font-semibold">Sign up using Mobile Number</label>
      <div className="flex items-center border rounded-md mb-4">
        <select className="border-none outline-none py-2 px-3 bg-transparent">
          <option>IN+91</option>
        </select>
        <input
          type="text"
          placeholder="Mobile Number"
          className="w-full py-2 px-3 outline-none"
        />
      </div>

      <label className="block mb-2 font-semibold">Enter OTP</label>
      <div className="flex mb-4">
        <label className="flex items-center mr-4">
          <input type="radio" name="otp" checked className="mr-2" />
          SMS
        </label>
        <label className="flex items-center">
          <input type="radio" name="otp" className="mr-2" />
          WhatsApp
        </label>
      </div>

      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full py-2 px-3 border rounded-md outline-none"
        />
        <button className="ml-2 bg-gray-200 text-black py-2 px-4 rounded-md">
          Get OTP
        </button>
      </div>

      <label className="flex items-center mb-6">
        <input type="checkbox" className="mr-2" />
        Agree to receive communications related to order and promotional offers.
      </label>

      <button className="w-full bg-black text-white py-2 rounded-md font-semibold">
        SIGNUP
      </button>
    </form>
  );
};

export default SignupForm;
