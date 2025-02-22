import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginAdmin, sendOtp, verifyOtp } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleEmailSubmit = () => {
    if (email === "admin@example.com") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      dispatch(sendOtp(email))
        .then(() => setOtpSent(true))
        .catch((error) => alert(error));
    }
  };

  const handleAdminLogin = () => {
    dispatch(loginAdmin({ email, password }))
      .then(() => navigate("/admin/dashboard"))
      .catch((error) => alert(error));
  };

  const handleVerifyOtp = () => {
    dispatch(verifyOtp({ email, otp }))
      .then(() => {
        navigate("/")
      })
      .catch((error) => alert(error));
  };


  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <label className="block mb-2 font-semibold">Sign in using Email Address</label>
      <div className="flex items-center border rounded-md mb-4">
        <input
          type="email"
          placeholder="Email Address"
          className="w-full py-2 px-3 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Check if admin email */}
      <button
        className="w-full bg-black text-white py-2 rounded-md font-semibold"
        type="button"
        onClick={handleEmailSubmit}
        disabled={otpSent || isAdmin}
      >
        Continue
      </button>

      {/* Admin password section */}
      {isAdmin && (
        <>
          <label className="block mb-2 font-semibold">Enter Password</label>
          <div className="flex items-center mb-4">
            <input
              type="password"
              placeholder="Password"
              className="w-full py-2 px-3 border rounded-md outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="ml-2 bg-black text-white py-2 px-4 rounded-md"
              onClick={handleAdminLogin}
            >
              Login
            </button>
          </div>
        </>
      )}

      {/* OTP section for regular login */}
      {otpSent && !isAdmin && (
        <>
          <label className="block mb-2 font-semibold">Enter OTP</label>
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full py-2 px-3 border rounded-md outline-none"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              type="button"
              className="ml-2 bg-gray-200 text-black py-2 px-4 rounded-md"
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default LoginForm;
