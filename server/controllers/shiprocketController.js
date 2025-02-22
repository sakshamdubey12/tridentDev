const fetch = require("node-fetch");
const { getShiprocketToken } = require("../config/shiprocketConfig");
const Order = require("../models/orderModel");

// ✅ Create Shiprocket Order
exports.createShiprocketOrder = async (req, res) => {
    try {
        const token = await getShiprocketToken();
        const { orderId} = req.body;
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        const orderDetails = {
            order_id: order._id,
            order_date: new Date().toISOString(),
            pickup_location: "Primary",
            billing_customer_name: order.name,
            billing_address: order.address,
            billing_city: "Your City",
            billing_pincode: "123456",
            billing_state: "Your State",
            billing_country: "India",
            billing_phone: order.phone,
            shipping_is_billing: true,
            billing_last_name: order.name,
            order_items: order.items.map(item => ({
                name: item.name,
                selling_price: item.price,
                sku: "12345",           // SKU for the product
                units: 1   
            })),
            payment_method: "Prepaid",
            sub_total: order.totalAmount,
            length: "10",
            breadth: "10",
            height: "10",
            weight: "0.5"
        };

        const response = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(orderDetails)
        });

        const data = await response.json();
        // console.log('shipRocket data: ',data, data.status)
        if (data.status_code === 1) {
            order.shiprocketOrderId = data.order_id;
            order.trackingId = data.shipment_id;
            order.status = "Shipped";
            await order.save();
        }

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating Shiprocket order" });
    }
};

// ✅ Track Order
exports.trackOrder = async (req, res) => {
    try {
        const token = await getShiprocketToken();
        const { orderId } = req.params;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        const response = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track?order_id=${order.shiprocketOrderId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const rawData = await response.json();
        // rawData is usually an array, so let's grab the first item
        const shiprocketData = rawData[0];
        // Extract only the fields you care about
        const {
          shipment_id,
          awb_code,
          current_status,
          delivered_date,
          track_url,
        } = shiprocketData.tracking_data || {};
    
        // Construct a simplified response object
        const filteredResponse = {
          shipmentId: shipment_id || null,
          awbCode: awb_code || null,
          status: current_status || null,      // e.g., "Shipped", "Delivered", "In Transit"
          deliveredDate: delivered_date || null,
          trackingLink: track_url || "https://in.pinterest.com/pin/230387337179414949/",     // If you want to show a direct track URL
        };

        // console.log(rawData[0][order.shiprocketOrderId].tracking_data)
        // console.log(filteredResponse)

        // Send only the filtered data back
        res.json(filteredResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error tracking order" });
    }
};
