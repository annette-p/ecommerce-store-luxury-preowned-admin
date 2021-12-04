const axios = require("axios");
const authServiceLayer = require("../services/authentication");

// get all orders
const getAllOrders = async (refreshToken) => {

    const headers = await authServiceLayer.generateHttpAuthzHeader(refreshToken);

    if (headers !== null) {
        let ordersResult = await axios.get(`${apiUrl}/orders`, headers);
        let allOrders = ordersResult.data.data;
        return allOrders;
    } else {
        throw new Error("Unable to generate authorization header to perform the operation.")
    }
    
}

const getListOfValidOrderStatuses = async () => {
    let orderStatusesResult = await axios.get(`${apiUrl}/orders/status-list`);
    let orderStatuses = orderStatusesResult.data.data;
    return orderStatuses;
}

async function getOrderById(orderId, refreshToken) {
    try {
        const headers = await authServiceLayer.generateHttpAuthzHeader(refreshToken);
        if (headers !== null) {
            const response = await axios.get(`${apiUrl}/orders/${orderId}`, headers);
            let order = response.data.data;
            return order;
        } else {
            throw new Error("Unable to generate authorization header to perform the operation.")
        }
        
    } catch(err) {
        throw err;
    }
}

module.exports = {
    getAllOrders,
    getOrderById,
    getListOfValidOrderStatuses
}