"use client";
import { ChangeEvent, useState } from "react";
import { getCurrentWeather, getLocationCoordinates, getLocationFromText} from "./actions/weather";
import { convertKelvinToCelcius } from "./utils/weatherUtil";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [requestText, setRequestText] = useState<string>("");

  const getWeatherData = async () => {
    const locationResponse = await getLocationFromText(requestText);
    console.log(locationResponse);
    
    const {countryCode, city} = locationResponse;

    const coordinatesResponse = await getLocationCoordinates(countryCode, city)
    
    const weatherResponse = await getCurrentWeather(coordinatesResponse?.lat, coordinatesResponse?.lon)

    setData(weatherResponse);
  };

  const handleChangeRequestText = (e: ChangeEvent<HTMLInputElement>)  =>{
    setRequestText(e.target.value);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="requestText"
        type="text"
        placeholder="Type your request here.."
        onChange={handleChangeRequestText}
      ></input>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={getWeatherData}
      >
        Get weather details
      </button>
      <p>{data?.dt_txt}</p>
      <p>{data? convertKelvinToCelcius(data?.main?.temp): ""}</p>
    </div>
  );
}
