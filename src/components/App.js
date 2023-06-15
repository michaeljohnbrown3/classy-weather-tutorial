import { useEffect, useState } from "react";
import Input from "./Input";
import Weather from "./Weather";
import { convertToFlag } from "../utilities";

export default function App() {
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [displayLocation, setDisplayLocation] = useState("");
  const [weather, setWeather] = useState({});

  useEffect(
    function () {
      async function getLocation() {
        if (location.length < 2) return setWeather({});

        setIsLoading(true);

        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${location}`
        );
        const geoData = await geoRes.json();

        if (!geoData) throw new Error("Location not found");

        const { latitude, longitude, timezone, name, country_code } =
          geoData.results[0];

        setDisplayLocation(`${name} ${convertToFlag(country_code)}`);

        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&temperature_unit=fahrenheit&daily=weathercode,temperature_2m_max,temperature_2m_min`
        );
        const weatherData = await weatherRes.json();
        setWeather(weatherData.daily);
        setIsLoading(false);
      }
      getLocation();
    },
    [location]
  );

  useEffect(
    function () {
      if (!displayLocation) return;
      document.title = `Classy Weather | ${displayLocation}`;

      return function () {
        document.title = "Classy Weather";
      };
    },
    [displayLocation]
  );

  return (
    <div className="app">
      <h1>Classy Weather</h1>
      <Input location={location} onChangeLocation={setLocation} />

      {isLoading && <p className="loader">Loading...</p>}

      {weather.weathercode && (
        <Weather location={displayLocation} weather={weather} />
      )}
    </div>
  );
}
