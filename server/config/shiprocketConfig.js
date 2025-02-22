const fetch = require("node-fetch");

const SHIPROCKET_EMAIL = "astharai572@gmail.com";
const SHIPROCKET_PASSWORD = "Password123@";

async function getShiprocketToken() {
    const response = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: SHIPROCKET_EMAIL,
            password: SHIPROCKET_PASSWORD
        })
    });

    const data = await response.json();
    return data.token;
}

module.exports = { getShiprocketToken };
