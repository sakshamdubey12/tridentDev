// controllers/productController.js

const Product = require('../models/productModel');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({createdAt: -1});
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findOne({ _id:id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  const { name, price,description, imageUrl, colorChoices, category, discount, available } = req.body;
  // console.log(req.body);

  try {
    // Check if the product already exists by name (or you can use another field for uniqueness)
    const existingProduct = await Product.findOne({ name });

    if (existingProduct) {
      return res.status(400).json({ message: 'Product already exists' });
    }

    // Create a new product if it doesn't already exist
    const newProduct = new Product({
      name,
      price,
      description,
      imageUrl,
      colorChoices,
      category,
      discount,
      available,
    });

    // Save the product to the database
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to create product' });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, imageUrl, colorChoices, category, discount, available } = req.body;
//  console.log(req.body)
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id:id },
      { name, price,description, imageUrl, colorChoices, category, discount, available },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update product' });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findOneAndDelete({ _id:id });

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
