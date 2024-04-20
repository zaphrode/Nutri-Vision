// CalorieNinjasAPI.js


//Function to make a request to Calorie Ninja API to retrive the ingredients nutritionnal values based on a query string, 
//i.e. the ingredients in the ingredients list 
//This returns a response in the form of a parsed response data  
export const fetchNutritionalInfo = async (query) => {
    const apiKey = 'ZU5mjAQ4XCSqCf5coiK7Tg==2xon0PnMDSJJAMX7';
    try {
        const apiUrl = `https://api.calorieninjas.com/v1/nutrition?query=${query}`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-Api-Key': apiKey
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch nutritional information');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};
