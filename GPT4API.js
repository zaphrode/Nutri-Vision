// OpenAI API 

export async function sendImageToAPI(base64Image) {
  const api_key = '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' // Assuming you've stored this securely
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${api_key}`
  };

  const payload = {
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Identify Foods in this image, and estimate the amount of food. Frame your answer in the following way: 500g Pork chop , 300g Rice , 100g Coleslaw. You do not have to warn the user about it being an approximation or estimation, and using such words are not necessary."
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`
            }
          }
        ]
      }
    ],
    max_tokens: 300
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });
    const jsonResponse = await response.json();
    return JSON.stringify(jsonResponse);
    // Handle the response data as needed
  } catch (error) {
    console.error("Error sending image to API:", error);
  }
};