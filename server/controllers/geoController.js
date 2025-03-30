// /server/controllers/geoController.js
const axios = require('axios');
const User = require('../models/userModel');
// const { LOCATIONIQ_API_KEY } = require('../config/config'); // Add your API key here

// LocationIQ API request to get address from latitude and longitude
const getAddressFromCoordinates = async (lat, lng) => {
  try {
    const response = await axios.get('https://us1.locationiq.com/v1/reverse.php', {
      params: {
        key: "pk.a873f6af9d4344153af7ba1a5f5b6752",
        lat: lat,
        lon: lng,
        format: 'json',
      },
    });

    if (response.data.address) {
      const address = response.data.address;
      return {
        address: address.road || 'Unknown address',
        pincode: address.postcode || '',
        latitude: lat,
        longitude: lng,
      };
    } else {
      throw new Error('No address found for the given coordinates');
    }
  } catch (error) {
    throw new Error('Error fetching address from LocationIQ');
  }
};

// Controller function to save address for a user
const saveAddress = async (req, res) => {
  try {
    const { userId, houseNo, building, street, locality, pincode, city, state } = req.body;

    console.log("Received Data:", req.body); // Debugging log

    if (!userId || !houseNo || !street || !pincode || !city || !state) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure user.addresses is an array before pushing
    if (!Array.isArray(user.addresses)) {
      user.addresses = []; // Initialize as an empty array if undefined
    }

    // Create new address object
    const newAddress = {
      houseNo,
      building,
      street,
      locality,
      pincode,
      city,
      state,
    };

    // Add new address to user's addresses array
    user.addresses.push(newAddress);
    await user.save();
    console.log(user.addresses,'user data')
    res.status(201).json({ message: "Address added successfully", user });
  } catch (error) {
    console.error("Error saving address:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
module.exports = { saveAddress };
