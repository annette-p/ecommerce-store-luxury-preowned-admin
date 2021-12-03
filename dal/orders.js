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

module.exports = {
    getAllOrders,
    getListOfValidOrderStatuses
}