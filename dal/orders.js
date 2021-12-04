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

// get list of valid order statuses
const getListOfValidOrderStatuses = async () => {
    let orderStatusesResult = await axios.get(`${apiUrl}/orders/statuses`);
    let orderStatuses = orderStatusesResult.data.data;
    return orderStatuses;
}

// get list of shipment providers
const getListOfShipmentProviders = async () => {
    let shipmentProvidersResult = await axios.get(`${apiUrl}/orders/shipment-providers`);
    let shipmentProviders = shipmentProvidersResult.data.data;
    return shipmentProviders;
}

// Retrieve an order by its id
const getOrderById = async (orderId, refreshToken) => {
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

// Update an order
const updateOrder = async (orderId, orderData, refreshToken) => {
    try {
        const headers = await authServiceLayer.generateHttpAuthzHeader(refreshToken);
        if (headers !== null) {
            let updatedOrderInfo = {
                "status": orderData.status,
                "comment": orderData.comment,
                "shipment_provider": orderData.shipment_provider,
                "tracking_number": orderData.tracking_number
            }
            const response = await axios.put(`${apiUrl}/orders/${orderId}/update`, updatedOrderInfo, headers);
            return response.data;
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
    getListOfValidOrderStatuses,
    getListOfShipmentProviders,
    updateOrder
}