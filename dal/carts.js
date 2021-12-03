const axios = require("axios");
const authServiceLayer = require("../services/authentication");

// get all carts
const getAllCarts = async (refreshToken) => {

    const headers = await authServiceLayer.generateHttpAuthzHeader(refreshToken);

    if (headers !== null) {
        let cartsResult = await axios.get(`${apiUrl}/carts`, headers);
        let allCarts = cartsResult.data.data;
        return allCarts;
    } else {
        throw new Error("Unable to generate authorization header to perform the operation.")
    }
    
}

module.exports = {
    getAllCarts
}