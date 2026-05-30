import { weatherCodeToEmoji, weatherCodeToDescription } from './weatherObjects.js';

const currentWeatherElement = document.getElementById('current');
const hourlyWeatherElement = document.getElementById('hourly');
const dailyWeatherElement = document.getElementById('daily');
const tabButtons = document.querySelectorAll('.tab-button');
const weatherSections = document.querySelectorAll('.weather-section');
const weatherTabsContainer = document.getElementById('weather-tabs');

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

const showWeatherTabs = () => {
    weatherTabsContainer.style.display = 'block';
};


const currentWeather = (weather, units) => {
    currentWeatherElement.querySelector('#current-weather-emoji').textContent = weatherCodeToEmoji[weather.weather_code] || '❓';
    currentWeatherElement.querySelector('#current-temperature').textContent = `${weather.temperature_2m} ${units.temperature_2m}`;
    currentWeatherElement.querySelector('#current-feels-like').textContent = `Feels like ${weather.apparent_temperature} ${units.apparent_temperature}`;
    currentWeatherElement.querySelector('#current-weather-description').textContent = weatherCodeToDescription[weather.weather_code] || 'Unknown weather condition';
    currentWeatherElement.querySelector('#current-humidity').textContent = `Humidity: ${weather.relative_humidity_2m}${units.relative_humidity_2m}`;
    currentWeatherElement.querySelector('#current-cloud-cover').textContent = `Cloud Cover: ${weather.cloud_cover}${units.cloud_cover}`;
    currentWeatherElement.querySelector('#current-wind-speed').textContent = `Wind Speed: ${weather.wind_speed_10m} ${units.wind_speed_10m}`;
    currentWeatherElement.querySelector('#current-wind-direction').textContent = `Wind Direction: ${weather.wind_direction_10m}${units.wind_direction_10m}`;

    // Switch to current weather tab after loading data
    document.querySelector('[data-tab="current"]').click();
};

const hourlyWeather = (weather, units) => {
    hourlyWeatherElement.innerHTML = '';

    const currentHour = new Date().getHours();

    for (let i = currentHour; i < (currentHour + 24); i++) {
        if (i >= weather.time.length) break;
        const hourDate = new Date(weather.time[i]);

        let timeLabel = (i === currentHour) ? "Now" : 
                        hourDate.toLocaleTimeString([], { 
                            hour: 'numeric', 
                            hour12: true 
                        });

        const hourlyElement = document.createElement('div');
        hourlyElement.innerHTML = `
            <h3>${timeLabel}</h3>
            <div>${weatherCodeToEmoji[weather.weather_code[i]] || '❓'} ${weatherCodeToDescription[weather.weather_code[i]] || 'Unknown'}</div>
            <p>Temperature: ${weather.temperature_2m[i]}${units.temperature_2m}</p>
        `;
        hourlyWeatherElement.appendChild(hourlyElement);
    };
};

const dailyWeather = (weather, units) => {
    dailyWeatherElement.innerHTML = '';

    for (let i = 0; i < weather.temperature_2m_max.length; i++) {
        const today = new Date();
        const dailyDate = new Date(weather.time[i]);
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
            <div>${weatherCodeToEmoji[weather.weather_code[i]] || '❓'} ${weatherCodeToDescription[weather.weather_code[i]] || 'Unknown'}</div>
             ⬆️ ${weather.temperature_2m_max[i]}${units.temperature_2m_max} || ⬇️ ${weather.temperature_2m_min[i]}${units.temperature_2m_min}
        `;
        dailyWeatherElement.appendChild(dailyElement);
    }

};

export const displayWeather = (current, currentUnits, daily, dailyUnits, hourly, hourlyUnits) => {
    currentWeather(current, currentUnits);
    hourlyWeather(hourly, hourlyUnits);
    dailyWeather(daily, dailyUnits);
    showWeatherTabs();
};
