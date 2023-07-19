import React, { useState } from 'react';
import axios from 'axios';
import './WeatherPage.css';
import { Link } from 'react-router-dom';

const WeatherPage = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const fetchWeatherData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f926831d320fcd0fb12393dff1881e90&units=metric`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="weather-page">
      {/* Navigation */}
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">Currency Converter</Link>
          </li>
          <li>
            <Link to="/weather">Weather</Link>
          </li>
        </ul>
      </nav>

      {/* Weather page content */}
      <h2>Weather Page</h2>
      <div className="search-container">
        <input type="text" value={city} onChange={handleCityChange} />
        <button onClick={fetchWeatherData}>Get Weather</button>
      </div>
      {isLoading && <p>Loading weather data...</p>}
      {weatherData && (
        <div className="weather-content">
          <h4>Weather in {weatherData.name}</h4>
          <p>Temperature: {Math.round(weatherData.main.temp)}°C</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Condition: {weatherData.weather[0].description}</p>
          <p>Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
          <p>Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
          <p>Clouds: {weatherData.clouds.all}%</p>
          <p>Pressure: {weatherData.main.pressure} hPa</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          <img
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
            alt="Weather Icon"
          />
        </div>
      )}
    </div>
  );
};

export default WeatherPage;
