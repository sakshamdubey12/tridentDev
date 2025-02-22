require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const connectDB = require('./config/db');
const cookieParser = require("cookie-parser");
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoute')
const paymentRoutes = require('./routes/paymentRoutes')
const geoRoutes = require('./routes/geoRoutes')
const shiprocketRoutes = require("./routes/shiprocketRoutes");

const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
  origin: "http://localhost:3000", // Replace with your frontend's URL
  credentials: true,
}
));

connectDB();

// Shiprocket API token
const apiToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjU4ODQ1NzksInNvdXJjZSI6InNyLWF1dGgtaW50IiwiZXhwIjoxNzQwNzI0NTM1LCJqdGkiOiJ0d3dSR1FkYWJJWktBVHN4IiwiaWF0IjoxNzM5ODYwNTM1LCJpc3MiOiJodHRwczovL3NyLWF1dGguc2hpcHJvY2tldC5pbi9hdXRob3JpemUvdXNlciIsIm5iZiI6MTczOTg2MDUzNSwiY2lkIjo1NjczNzMxLCJ0YyI6MzYwLCJ2ZXJib3NlIjpmYWxzZSwidmVuZG9yX2lkIjowLCJ2ZW5kb3JfY29kZSI6IiJ9.DMl5FTu4du0h5itI75xzozABK_1hGbTnptvz5X74mOA"
const baseURL = "https://apiv2.shiprocket.in/v1/external";

// Middleware to set Shiprocket API headers
const getShiprocketHeaders = () => {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiToken}`, // Using the API token for authorization
  };
};


const checkPincodeAvailability = async (req, res) => {
  const { pincode } = req.params;

  try {
    const response = await axios.get(`https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=110001&delivery_postcode=${pincode}&cod=0&weight=1`, {
      headers: { "Authorization": `Bearer ${apiToken}` }
    });

    console.log(response.data.status)

    if (response.data.status === 200 && response.data.data.available_courier_companies.length > 0) {
      res.status(200).json({ available: true, couriers: response.data.data.available_courier_companies });
    } else {
      res.status(200).json({ available: false, message: "Delivery not available for this PIN code." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error checking PIN code serviceability", details: error.response.data });
  }
};



app.get("/api/check-pincode/:pincode", checkPincodeAvailability)




app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/order', orderRoutes);
app.use('/api', paymentRoutes);
app.use('/api/geo', geoRoutes);
app.use("/api/shiprocket", shiprocketRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


