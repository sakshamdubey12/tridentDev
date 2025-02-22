// User Schema
// const mongoose = require('mongoose')

// const userSchema = new mongoose.Schema({
//   email: String,
//   otp: String,
//   otpExpiry: Date,
// });

// const User = mongoose.model("User", userSchema);

// module.exports = User;


// /server/models/User.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  houseNo: { type: String },
  building: { type: String },
  street: { type: String },
  locality: { type: String },
  pincode: { type: String },
  city: { type: String },
  state: { type: String },
});

const userSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
  gender: { type: String },
  dob: { type: Date },
  email: { type: String, required: true, unique: true },
  otp: { type: String },
  otpExpiry: { type: Date },
  addresses: { type: [addressSchema], default: [] },  // Embedding the address schema
});

const User = mongoose.model('User', userSchema);

module.exports = User;
