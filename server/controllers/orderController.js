// const Order = require('../models/orderModel');
// const Product = require('../models/productModel'); // Import the Product model

// // Fetch all orders with filtering and populate product details
// exports.getOrders = async (req, res) => {
//   try {
//     const { status, searchQuery } = req.query;
//     const filter = {};

//     if (status) {
//       filter.status = status;
//     }
//     // Fetch orders and populate items (product details)
//     // const orders = await Order.find(filter)
//     //   .populate('items') // Populating the items field with product details

//     const orders = await Order.find(filter)
//   .populate({
//     path: 'items.product' // Populate the 'product' field inside each 'items' array element
//   });
//       const formattedOrders = orders.map(order => {
//         let totalAmount = 0;
//         // Calculate total amount based on item quantities and product prices
//         order.items.forEach(item => {
//           totalAmount += item.quantity * item.product.price;
//         });
//         return {
//           ...order.toObject(),
//           totalAmount: totalAmount
//         };
//       });

//     res.status(200).json(formattedOrders);
//     console.log(orders)
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching orders', error });
//   }
// };

// exports.createOrder = async (req, res) => {
//   try {
//     const { user, totalAmount, items, payment } = req.body;

//     const order = new Order({
//       user,
//       totalAmount,
//       items,
//       payment,
//       status: "Processing"
//     });

//     await order.save();
//     res.status(201).json({ message: "Order created successfully", order });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to create order" });
//   }
// };

// exports.updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;

//     const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

//     if (!updatedOrder) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     res.status(200).json(updatedOrder);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating order status', error });
//   }
// };


const Order = require('../models/orderModel');
const Product = require('../models/productModel'); // Import the Product model

// Fetch all orders with filtering and populate product details
// exports.getOrders = async (req, res) => {
//   try {
//     const { status, searchQuery } = req.query;
//     const filter = {};

//     if (status) {
//       filter.status = status;
//     }

//     const orders = await Order.find(filter).populate({
//       path: 'items.product' // Populate the 'product' field inside each 'items' array element
//     });

//     const formattedOrders = orders.map(order => {
//       let totalAmount = 0;
//       // Calculate total amount based on item quantities and product prices
//       order.items.forEach(item => {
//         totalAmount += item.quantity * item.product.price;
//       });

//       return {
//         ...order.toObject(),
//         totalAmount: totalAmount
//       };
//     });

//     res.status(200).json(formattedOrders);
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     res.status(500).json({ message: 'Error fetching orders', error: error.message });
//   }
// };



exports.getOrders = async (req, res) => {
  try {
    const { userId, status } = req.query;
    const filter = {};

    if (userId) {
      filter.user = userId; // Filter orders by user ID
    }
    
    if (status) {
      filter.status = status; // Filter by order status
    }

    // Fetch orders and populate product details
    const orders = await Order.find(filter)
    .populate('items') 
    
      .sort({ createdAt: -1 }); // Sort orders by latest first
      // console.log(orders)

    // Format response to include total amount calculation
    const formattedOrders = orders.map(order => {
      let totalAmount = 0;
      order.items.forEach(item => {
        totalAmount += item.quantity * (item.price);
      });
      return {
        ...order.toObject(),
        totalAmount
      };
    });

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};



exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};
