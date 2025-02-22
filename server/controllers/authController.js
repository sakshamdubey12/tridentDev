const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailer');

// Send OTP
exports.sendOtp = async (req, res) => {
    const { email } = req.body;

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
    
   // Check if the user already exists in the database
   let user = await User.findOne({ email });
   // If the user doesn't exist, create a new one
   if (!user) {
     user = new User({
       email,
       otp,
       otpExpiry,
     });
     await user.save();
   } else {
     // If the user exists, update the OTP and expiry time
     user.otp = otp;
     user.otpExpiry = otpExpiry;
     await user.save();
   }
  
    // Send OTP via email
    const mailOptions = {
      from: "saksham12dubey@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    };
  
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
      //   return res.status(500).json({ error: "error send OTP" });
      console.error("Full error:", err);
      }
      res.status(200).json({ message: "OTP sent successfully" });
    });
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user || user.otp !== otp) {
        return res.status(400).json({ error: "Invalid OTP" });
      }
  
      // Check if OTP is expired
      if (Date.now() > user.otpExpiry) {
        return res.status(400).json({ error: "OTP expired" });
      }
  
      // Generate JWT
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "6h",
      });
  
      // console.log('token',token)
  
      // Clear OTP after successful verification
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
  
      // Store token in an HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true, // Prevents client-side access to the cookie
        secure: process.env.NODE_ENV === "production", // Enables secure cookies in production
        sameSite: "Lax", // Prevents CSRF
        maxAge: 3600000, // 1 hour in milliseconds
      });
  
      // console.log(user)

      res.status(200).json({ message: "Login successful", userId: user._id.toString(), userData:user });
    } catch (error) {
      console.error("Error during OTP verification:", error);
      res.status(500).json({ error: "Server error" });
    }
};

// Logout
exports.logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    res.status(200).json({ message: "Logged out successfully" });
};

exports.updateDetails = async (req, res) =>{
  const {name,phone,gender,dob,userId} = req.body
  try{
    const updatedUser = await User.findByIdAndUpdate(userId,{name,phone,gender,dob},{new:true});
    if(!updatedUser){
      res.status(400).json({message:"User Not Found"})
    }

res.status(200).json(updatedUser)

  }catch(err){
    res.status(500).json({error:"Internal server Error"})
  }
}


// Contact Form Submission
exports.contactUs = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Mail options
    const mailOptions = {
      from: email, // Sender's email (user input)
      to: "saksham12dubey@gmail.com", // Your support email
      subject: `New Contact Us Inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage: ${message}`,
    };

    // Send email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending contact email:", err);
        return res.status(500).json({ error: "Failed to send message" });
      }
      res.status(200).json({ message: "Message sent successfully" });
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

