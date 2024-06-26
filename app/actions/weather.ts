"use server";

import axios from "axios";

const appId = process.env.NEXT_PUBLIC_WEATHER_MAP_API_KEY;

export async function getLocationFromText(requestText: string) {
  try {
    const data = {
      model: "gpt-3.5-turbo-0613",
      messages: [{ role: "user", content: requestText }],
      functions: [
        {
          name: "locationFromText",
          description: "Get the location from text",
          parameters: {
            type: "object",
            properties: {
              country: {
                type: "string",
                description: "Country name.",
              },
              countryCode: {
                type: "string",
                description: "Country code. Use ISO-3166",
              },
              USstate: {
                type: "string",
                description: "Full state name.",
              },
              state: {
                type: "string",
                description: "Two-letter state code.",
              },
              city: {
                type: "string",
                description: "City name.",
              },
              unit: {
                type: "string",
                description: "location unit: metric or imperial.",
              },
            },
            required: [
              "countryCode",
              "country",
              "USstate",
              "state",
              "city",
              "unit",
            ],
          },
        },
      ],
      function_call: "auto",
    };
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.openai.com/v1/chat/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      data: data,
    };

    const openAIResponse = await axios.request(config);
    console.log(openAIResponse);
    return JSON.parse(
      openAIResponse.data.choices[0].message.function_call.arguments
    );
  } catch (error) {}
}

export async function getLocationCoordinates(
  cityName: string,
  countryCode: string
) {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.openweathermap.org/geo/1.0/direct?q=${countryCode},${cityName}&limit=1&appid=${process.env.NEXT_PUBLIC_WEATHER_MAP_API_KEY}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const openAIResponse = await axios.request(config);
    const coordinateRes = {
      lat: openAIResponse.data[0].lat,
      lon: openAIResponse.data[0].lon,
    };
    return coordinateRes;
  } catch (error) {}
}

export async function getCurrentWeather(lat: number, lon: number) {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_WEATHER_MAP_API_KEY}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const openAIResponse = await axios.request(config);
    const weatherRes = openAIResponse?.data?.list[0];
    return weatherRes;
  } catch (error) {}
}

export async function getRecommendation(prompt: string, weatherData: any) {
  try {
    const url = "https://api.openai.com/v1/chat/completions";

    const sysMsg = `In a conversational professional tone, answer the [Question] based on the [Weather Data]. 

- Provide an opinion about what the weather feels like. 
- Provide temperature in either Celsius or Fahrenheit, whichever is more appropriate. 
- Never display the temperature in Kelvin. 
- Provide a recommendation on how to prepare and what to wear (e.g. bring an umbrella, wear a wind breaker, a warm jacket, etc.)`;

    const newPrompt = `Question: ${prompt}. Weather Data: ${JSON.stringify(
      weatherData
    )}`;
    const data = {
      model: "gpt-4",
      messages: [
        { role: "system", content: sysMsg },
        { role: "user", content: newPrompt },
      ],
    };
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.openai.com/v1/chat/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      data: data,
    };

    const openAIResponse = await axios.request(config);
    console.log(openAIResponse);
    return openAIResponse.data.choices[0].message.content;
  } catch (error) {
    console.log("Error:", error);
    return error;
  }
}
