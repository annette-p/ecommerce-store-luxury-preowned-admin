const axios = require("axios");

async function getAllCategories() {
    try {
        const response = await axios.get(`${apiUrl}/categories`)
        let allCategories = response.data.data.map( category => [ category.id, category.name ])
        allCategories.sort( function(category1, category2) {
            let categoryName1 = category1[1].toLowerCase();
            let categoryName2 = category2[1].toLowerCase();

            return categoryName1.localeCompare(categoryName2);
        })
        return allCategories;
    } catch(err) {
        throw err;
    }
}

async function getAllDesigners() {
    try {
        const response = await axios.get(`${apiUrl}/designers`)
        let allDesigners = response.data.data.map( designer => [ designer.id, designer.name ])
        allDesigners.sort( function(designer1, designer2) {
            let designerName1 = designer1[1].toLowerCase();
            let designerName2 = designer2[1].toLowerCase();

            return designerName1.localeCompare(designerName2);
        })
        return allDesigners;
    } catch(err) {
        throw err;
    }
}

async function getAllInsurances() {
    try {
        const response = await axios.get(`${apiUrl}/insurances`)
        let allInsurances = response.data.data.map( insurance => [ insurance.id, `${insurance.company_name} | ${insurance.policy_name}` ])
        allInsurances.sort( function(insurance1, insurance2) {
            let insuranceName1 = insurance1[1].toLowerCase();
            let insuranceName2 = insurance2[1].toLowerCase();

            return insuranceName1.localeCompare(insuranceName2);
        })
        return allInsurances;
    } catch(err) {
        throw err;
    }
}

async function getAllTags() {
    try {
        const response = await axios.get(`${apiUrl}/tags`)
        let allTags = response.data.data.map( tag => [ tag.id, tag.name ])
        allTags.sort( function(tag1, tag2) {
            let tagName1 = tag1[1].toLowerCase();
            let tagName2 = tag2[1].toLowerCase();

            return tagName1.localeCompare(tagName2);
        })
        return allTags;
    } catch(err) {
        throw err;
    }
}

module.exports = {
    getAllCategories,
    getAllDesigners,
    getAllInsurances,
    getAllTags
}