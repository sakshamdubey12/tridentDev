import React, { useState } from "react";
import LoginForm from "./Login";
import SignupForm from "./Signup";
import { useSelector } from "react-redux";

const Account = () => {
  const [isLogin, setIsLogin] = useState(useSelector(state => state.auth.isLogin)); // State to toggle between login and signup

  const toggleForm = () => {
    setIsLogin((prev) => !prev); // Toggle the state
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-full max-w-md p-6">
        <h2 className="text-center text-3xl font-bold mb-6">MY ACCOUNT</h2>
        <div className="flex justify-center border-b mb-4">
          <button
            className={`w-1/2 text-center py-2 font-semibold ${isLogin ? "text-black border-b-2 border-black" : "text-gray-500"}`}
            onClick={() => setIsLogin(true)}
          >
            LOGIN
          </button>
          <button
            className={`w-1/2 text-center py-2 font-semibold ${!isLogin ? "text-black border-b-2 border-black" : "text-gray-500"}`}
            onClick={() => setIsLogin(false)}
          >
            SIGNUP
          </button>
        </div>

        {isLogin ? <LoginForm /> : <SignupForm />} {/* Conditional rendering */}
      </div>
    </div>
  );
};

export default Account;
