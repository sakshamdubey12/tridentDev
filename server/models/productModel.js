const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Product Schema
const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    // required: true
  },
  colorChoices: {
    type: [String],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  discount: {
    type: Number,
    required: true,
    default: 0
  },
  available: {
    type: Number,
    required: true,
    default: 0
  },
  description: {
    type: String,
    // required: true,
    default: "none"
  },
},{ timestamps: true });

// Create Product Model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
