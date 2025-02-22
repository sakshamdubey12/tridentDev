// const mongoose = require('mongoose');

// // Define schema for an individual item in an order
// const orderItemSchema = new mongoose.Schema({
//   product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to the Product model
//   quantity: { type: Number, required: true, min: 1 }, // Quantity of the product
//   color: { type: String, required: true }, // Color of the product in this order
//   size: { type: String, required: true } // Size of the product in this order
// });

// // Define the order schema
// const orderSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
//   status: { 
//     type: String, 
//     enum: ['Unpaid', 'Processing', 'Shipped', 'Delivered'], 
//     default: 'Unpaid' 
//   },
//   date: { type: Date, required: true, default: Date.now },
//   totalAmount: { type: Number, required: true },
//   items: [orderItemSchema], // Array of items in the order
//   payment: {
//     orderId: { type: String }, // Razorpay Order ID
//     paymentId: { type: String }, // Razorpay Payment ID
//     signature: { type: String }, // Razorpay Signature
//     status: { 
//       type: String, 
//       enum: ['Pending', 'Paid', 'Failed'], 
//       default: 'Pending' 
//     } 
//   }
// });

// const Order = mongoose.model('Order', orderSchema);

// module.exports = Order;



const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, required: true, default: Date.now },
  totalAmount: { type: Number, required: true },
  items: [
     {
      name:{
      type: String 
      },
      size: {
        type: String
      },
      price: {
        type: Number
      },
      discount: {
        type: Number
      },
      imageUrl: {
        type: String
      },
      selectedColor: {
        type: String
      },
      quantity:{
        type: Number
      },
      createdAt: {
        type: Date
      }
    },
 ],
  payment: {
    orderId: { type: String, required: true },
    paymentId: { type: String, required: true },
    signature: { type: String, required: true },
    status: { type: String, default: 'Pending' },
  },
  name:{ type: String },
  phone: { type: String},
  address:{ type: String},
  shiprocketOrderId: { type: String},  // Store Shiprocket order ID
  trackingId: { type: String},      // Store tracking ID
  status: { type: String, default: 'Processing' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

