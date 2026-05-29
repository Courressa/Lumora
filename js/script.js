import { weatherCodeToDescription, weatherCodeToEmoji } from './weatherObjects.js';

const locationInput = document.getElementById('location-input');
const suggestionsContainer = document.getElementById('suggestions');
const locationNameElement = document.getElementById('location-name');
const weatherTabs= document.querySelectorAll('.weather-tabs');
const locationSelected = document.getElementById('location-selected');
const locationCountryElement = document.getElementById('location-country');
const currentLocationButton = document.getElementById('current-location');
const searchLocationButton = document.getElementById('search-location');

/* === Current Location === */
currentLocationButton.addEventListener('click', () => {
    getCurrentLocation();
});

const getCurrentLocation = () => {
    // Loading state for current location button
    currentLocationButton.textContent = 'Getting location...';
    locationCountryElement.textContent = '';
    currentLocationButton.disabled = true;
    resetSearchInputVisibility();

    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser. Please use the search function to find your location.');
        resetCurrentLocationButton();
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            await getWeatherData(latitude, longitude);

            locationNameElement.textContent = 'Current Location';
            resetCurrentLocationButton();
        },
        (error) => {
            console.error('Error getting geolocation:', error);

            let message = "Failed to get your location.";
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    message = "Location access denied. Please allow location permission.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    message = "Location information unavailable.";
                    break;
                case error.TIMEOUT:
                    message = "Location request timed out.";
                    break;
            }
            
            alert(message);
            resetCurrentLocationButton();
        }
    );
};

// Reset current location button to default state
const resetCurrentLocationButton = () => {
    currentLocationButton.textContent = 'Current Location';
    currentLocationButton.disabled = false;
    locationInput.value = '';
};


/* === Search Location === */
searchLocationButton.addEventListener('click', () => {
    searchLocationButton.disabled = true;
    document.getElementById('search-form').style.display = 'block';
});

const resetSearchInputVisibility = () => {
    document.getElementById('search-form').style.display = 'none';
    searchLocationButton.disabled = false;
};

locationInput.addEventListener('input', async (event) => {
    event.preventDefault();
    const urlToFetch = `https://geocoding-api.open-meteo.com/v1/search?name=`;
    const location = locationInput.value.trim();

    if (location.length < 3) {
        suggestionsContainer.innerHTML = '';
        return;
    }
    
    //Search for location using geocoding API
    try {
        const response = await fetch (`${urlToFetch}${location}`);

        if (response.ok) {
            const jsonResponse = await response.json();
            if (jsonResponse.results && jsonResponse.results.length > 0) {
                const locationData = jsonResponse.results;

                showSuggestions(locationData);
            }
        }

    } catch (error) {
        console.error('Error fetching geocoding data:', error);
        alert('An error occurred while searching for the location. Please try again later.');
    }
});

// Hide suggestions when clicking outside the input or suggestions container
document.addEventListener('click', (event) => {
    if (!locationInput.contains(event.target)) {
        suggestionsContainer.style.display = 'none';
    }
});

// Hide Current, Hourly and Daily if location (current or selected) has not been selected
const hideWeatherTabs = () => {
    weatherTabs.forEach(section => {
        console.log(section);
        section.style.display = 'none';
    });
};

if (!locationNameElement.textContent) {
    hideWeatherTabs();
};

const showSuggestions = (suggestions) => {
    suggestionsContainer.innerHTML = '';
    const checkedLocations = new Set();

    suggestions.forEach((suggestion) => {
        const location = `${suggestion.name}, ${suggestion.admin1}, ${suggestion.country}`;
        
        // Skip duplicate locations
        if (checkedLocations.has(location)) return;
        checkedLocations.add(location);

        const div = document.createElement('div');
        div.classList.add('suggestion-item');
        div.textContent = location;

        div.addEventListener('click', () => {
            selectLocation(suggestion);
        });

        suggestionsContainer.appendChild(div);
    });

    if (suggestions.length > 0) {
        suggestionsContainer.style.display = 'block';
    }
};

const selectLocation = (location) => {
    locationInput.value = `${location.name}, ${location.admin1}, ${location.country}`;
    suggestionsContainer.style.display = 'none';

    // Fetch weather data for the selected location
    getWeatherData(location.latitude, location.longitude);
    // Update location name and country display
    locationNameElement.textContent = `${location.name}, ${location.admin1}`;
    locationCountryElement.textContent = `(${location.country})`;
};


/* === API Calls === */
const baseUrl = 'https://api.open-meteo.com/v1/';

const getWeatherData = async (latitude, longitude) => {
    const forcastEndpoint = `forecast?latitude=${latitude}&longitude=${longitude}&timezone=auto`;
    const currentWeatherEndpoint = '&current=temperature_2m,is_day,apparent_temperature,weather_code,relative_humidity_2m,wind_speed_10m,wind_direction_10m,cloud_cover';
    const dailyEndpoint = '&daily=temperature_2m_max,temperature_2m_min,weather_code';
    const urlToFetch = `${baseUrl}${forcastEndpoint}${currentWeatherEndpoint}${dailyEndpoint}`;

    try {
        const response = await fetch(urlToFetch);

        if (response.ok) {
            const jsonResponse = await response.json();
            console.log('Weather data:', jsonResponse);
            displayWeather(jsonResponse.current, jsonResponse.current_units, jsonResponse.daily, jsonResponse.daily_units);
        }

    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('An error occurred while fetching weather data. Please try again later.');
    }
};


/* === Display Weather Data === */
const weatherContainer = document.getElementById('weather-info');
const currentWeatherElement = document.getElementById('current');
const hourlyWeatherElement = document.getElementById('hourly');
const dailyWeatherElement = document.getElementById('daily');
const tabButtons = document.querySelectorAll('.tab-button');
const weatherSections = document.querySelectorAll('.weather-section');


// Tab navigation
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;

        // Remove active from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));

        // Add active to clicked button
        button.classList.add('active');

        // Hide all sections
        weatherSections.forEach(section => section.classList.remove('active'));

        // Show target section
        document.getElementById(targetTab).classList.add('active');
    });
});


const displayWeather = (currentWeather, weatherUnits, dailyWeather, dailyUnits) => {
    //Current Weather
    currentWeatherElement.querySelector('#current-weather-emoji').textContent = weatherCodeToEmoji[currentWeather.weather_code] || '❓';
    currentWeatherElement.querySelector('#current-temperature').textContent = `${currentWeather.temperature_2m} ${weatherUnits.temperature_2m}`;
    currentWeatherElement.querySelector('#current-feels-like').textContent = `Feels like ${currentWeather.apparent_temperature} ${weatherUnits.apparent_temperature}`;
    currentWeatherElement.querySelector('#current-weather-description').textContent = weatherCodeToDescription[currentWeather.weather_code] || 'Unknown weather condition';
    currentWeatherElement.querySelector('#current-humidity').textContent = `Humidity: ${currentWeather.relative_humidity_2m}${weatherUnits.relative_humidity_2m}`;
    currentWeatherElement.querySelector('#current-cloud-cover').textContent = `Cloud Cover: ${currentWeather.cloud_cover}${weatherUnits.cloud_cover}`;
    currentWeatherElement.querySelector('#current-wind-speed').textContent = `Wind Speed: ${currentWeather.wind_speed_10m} ${weatherUnits.wind_speed_10m}`;
    currentWeatherElement.querySelector('#current-wind-direction').textContent = `Wind Direction: ${currentWeather.wind_direction_10m}${weatherUnits.wind_direction_10m}`;
    
    // Switch to current weather tab after loading data
    document.querySelector('[data-tab="current"]').click();

    //Hourly Weather

    //Daily Weather
    for (let i = 0; i < dailyWeather.temperature_2m_max.length; i++) {
        const today = new Date();
        const dailyDate = new Date(dailyWeather.time[i]);
        let day;

        const isSameDay = (
            today.getFullYear() === dailyDate.getFullYear() &&
            today.getMonth() === dailyDate.getMonth() && // zero-based month
            today.getDate() === dailyDate.getDate()
        );

        if (isSameDay) {
            day = 'Today';
        } else if (dailyDate.getTime() < today.getTime()) {
            day = 'Yesterday';
        } else {
            const options = { weekday: 'long' };
            day = dailyDate.toLocaleDateString(undefined, options);
        }

        const dailyElement = document.createElement('div');
        dailyElement.innerHTML = `
            <h3>${day}</h3>
            <div>${weatherCodeToEmoji[dailyWeather.weather_code[i]] || '❓'} ${weatherCodeToDescription[dailyWeather.weather_code[i]] || 'Unknown'}</div>
             ⬆️ ${dailyWeather.temperature_2m_max[i]}${dailyUnits.temperature_2m_max} || ⬇️ ${dailyWeather.temperature_2m_min[i]}${dailyUnits.temperature_2m_min}
        `;
        dailyWeatherElement.appendChild(dailyElement);
    }

};