const axios = require("axios");

// get all carts
const getAllCarts = async (refreshToken) => {

    let accessTokenResult = await axios.post(
        `${apiUrl}/users/refresh`, 
        {
            "refresh_token": refreshToken
        }, 
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
    let accessToken = accessTokenResult.data.accessToken

    let cartsResult = await axios.get(
        `${apiUrl}/carts`, 
        { 'headers': {
                'Authorization': `Bearer ${accessToken}`
            }
        });
    let allCarts = cartsResult.data.data;
    return allCarts;
    
}

module.exports = {
    getAllCarts
}