import { displayWeather } from './weatherDisplay.js';
import { showSuggestions } from './script.js';
import { getUnitParams } from './unitToggle.js';

const baseUrl = 'https://api.open-meteo.com/v1/';
const urlToFetch = `https://geocoding-api.open-meteo.com/v1/search?name=`;

export const getLocationSuggestions = async (input) => {
    const location = input.trim();

    if (location.length < 3) {
        document.getElementById('suggestions').innerHTML = '';
        return;
    }
    
    //Search for location using geocoding API
    try {
        const response = await fetch (`${urlToFetch}${encodeURIComponent(location)}&count=100`);

        if (response.ok) {
            const jsonResponse = await response.json();
            if (jsonResponse.results?.length > 0) {
                showSuggestions(jsonResponse.results);
            } else {
                const suggestionsContainer = document.getElementById('suggestions');
                suggestionsContainer.innerHTML = '<div class="no-results">No results found</div>';
                suggestionsContainer.style.display = 'block';
            }
        }

    } catch (error) {
        console.error('Error fetching geocoding data:', error);
        alert('An error occurred while searching for the location. Please try again later.');
    }
};

export const getWeatherData = async (latitude, longitude) => {
    const unitParams = new URLSearchParams(getUnitParams());

    const forcastEndpoint = `forecast?latitude=${latitude}&longitude=${longitude}&timezone=auto`;
    const currentWeatherEndpoint = '&current=temperature_2m,is_day,apparent_temperature,weather_code,relative_humidity_2m,wind_speed_10m,wind_direction_10m,cloud_cover';
    const hourlyEndpoint = '&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code';
    const dailyEndpoint = '&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,precipitation_probability_max,sunrise,sunset,wind_speed_10m_max';
    
    const urlToFetch = `${baseUrl}${forcastEndpoint}${currentWeatherEndpoint}${hourlyEndpoint}${dailyEndpoint}&${unitParams}`;

    try {
        const response = await fetch(urlToFetch);

        if (response.ok) {
            const jsonResponse = await response.json();
            displayWeather(
                jsonResponse.current,
                jsonResponse.current_units,
                jsonResponse.daily,
                jsonResponse.daily_units,
                jsonResponse.hourly,
                jsonResponse.hourly_units
            );
        } else {
            throw new Error(`API error: ${response.status}`);
        }

    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert(`Failed to fetch weather: ${error.message || 'Check your connection and try again.'}`);
        throw error;
    }
};