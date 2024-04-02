"use client";
import { ChangeEvent, useState } from "react";
import {
  getCurrentWeather,
  getLocationCoordinates,
  getLocationFromText,
} from "./actions/weather";
import { convertKelvinToCelcius } from "./utils/weatherUtil";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [requestText, setRequestText] = useState<string>("");

  const getWeatherData = async () => {
    const locationResponse = await getLocationFromText(requestText);
    console.log(locationResponse);

    const { countryCode, city } = locationResponse;

    const coordinatesResponse = await getLocationCoordinates(countryCode, city);

    const weatherResponse = await getCurrentWeather(
      coordinatesResponse?.lat,
      coordinatesResponse?.lon
    );

    setData(weatherResponse);
  };

  const handleChangeRequestText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setRequestText(e.target.value);
  };

  return (
    <div className="flex flex-col h-screen ">
      <div className="text-center p-4">
        <p className="text-6xl text-slate-400">Weather Wisdom</p>
      </div>
      <div className="flex flex-col gap-4 items-center w-screen p-4">
        <textarea
          className="border border-gray-300 rounded-lg px-4 py-2 w-full h-12 focus:outline-none focus:border-blue-500 resize-none"
          id="requestText"
          placeholder="Type your request here.."
          onChange={handleChangeRequestText}
        ></textarea>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={getWeatherData}
        >
          Get weather details
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-center w-screen p-4">
        <div className="grid grid-cols-2 gap-4 w-screen rounded p-4 overflow-hidden shadow-lg">
          <div>
            <p className="text-2xl text-slate-400">Now</p>
            <p className="text-3xl text-slate-100">
              {data ? `${convertKelvinToCelcius(data?.main?.temp)} C` : ""}
            </p>
          </div>
          <div>
            {data && (
               <p className="text-slate-200">{`${data?.weather[0].main} (${data?.weather[0].description})`}</p>
            )}  
            <p className="text-slate-200">{`Humidity: ${data ? data?.main.humidity : ""} ${
              data ? "%" : ""
            }`}</p>
            <p className="text-slate-200">{`Wind: ${data ? data?.wind.speed : ""} ${
              data ? "km/h" : ""
            }`}</p>
          </div>
        </div>
        <div className="flex flex-col w-screen rounded overflow-hidden p-4 text-slate-400 shadow-lg">
          <p>AI suggestion: WIP</p>
        </div>
      </div>
    </div>
  );
}
