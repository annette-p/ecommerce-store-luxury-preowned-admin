const axios = require("axios");

// use refresh token to obtain a new access token
const getAccessToken = async (refreshToken) => {
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
    );
    if (!accessTokenResult) {
        return null;
    }

    let accessToken = accessTokenResult.data.accessToken;
    return accessToken;
}

const generateHttpAuthzHeader = async (refreshToken) => {
    const accessToken = await getAccessToken(refreshToken);
    if (accessToken !== null) {
        const headers = { 
            'headers': {
                'Authorization': `Bearer ${accessToken}`
            }
        };
        return headers;
    } else {
        return null;
    }
}

const generateHttpAuthzJsonHeader = async (refreshToken) => {
    const accessToken = await getAccessToken(refreshToken);
    if (accessToken !== null) {
        const headers = { 
            'headers': {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        return headers;
    } else {
        return null;
    }
}

module.exports = {
    getAccessToken,
    generateHttpAuthzHeader,
    generateHttpAuthzJsonHeader
}