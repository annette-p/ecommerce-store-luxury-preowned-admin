const axios = require("axios");
const authServiceLayer = require("../services/authentication");

// get all consignments
const getAllConsignments = async (refreshToken, searchCriteria) => {

    const headers = await authServiceLayer.generateHttpAuthzHeader(refreshToken);

    if (headers !== null) {
        // perform a 'get' with authorization header and search criteria in 'params'
        // ref: https://stackoverflow.com/a/48261824
        let consignmentsResult = await axios.get(`${apiUrl}/consignments`, { ...headers, params: searchCriteria});
        let allConsignments = consignmentsResult.data.data;
        return allConsignments;
    } else {
        throw new Error("Unable to generate authorization header to perform the operation.")
    }
    
}

// get list of valid order statuses
const getListOfValidConsignmentStatuses = async () => {
    let consignmentStatusesResult = await axios.get(`${apiUrl}/consignments/statuses`);
    let consignmentStatuses = consignmentStatusesResult.data.data;
    return consignmentStatuses;
}

// Retrieve an consignment by its id
const getConsignmentById = async (consignmentId, refreshToken) => {
    try {
        const headers = await authServiceLayer.generateHttpAuthzHeader(refreshToken);
        if (headers !== null) {
            const response = await axios.get(`${apiUrl}/consignments/${consignmentId}`, headers);
            let consignment = response.data.data;
            return consignment;
        } else {
            throw new Error("Unable to generate authorization header to perform the operation.")
        }
        
    } catch(err) {
        console.log(err)
        throw err;
    }
}

// Update an consignment
const updateConsignment = async (consignmentId, consignmentData, refreshToken) => {
    try {
        const headers = await authServiceLayer.generateHttpAuthzHeader(refreshToken);
        if (headers !== null) {
            let updatedConsignmentInfo = {
                "status": consignmentData.status,
                "comment": consignmentData.comment
            }
            const response = await axios.put(`${apiUrl}/consignments/${consignmentId}/update`, updatedConsignmentInfo, headers);
            return response.data;
        } else {
            throw new Error("Unable to generate authorization header to perform the operation.")
        }
    } catch(err) {
        throw err;
    }
}

module.exports = {
    getAllConsignments,
    getConsignmentById,
    getListOfValidConsignmentStatuses,
    updateConsignment
}