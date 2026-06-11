const celsiusBtn = document.getElementById('celsius');
const fahrenheitBtn = document.getElementById('fahrenheit');
const kmhBtn = document.getElementById('kmh');
const mphBtn = document.getElementById('mph');
const metricBtn = document.getElementById('metric');
const imperialBtn = document.getElementById('imperial');

const defaultUnits = {
    temperature: 'celsius',
    windSpeed: 'kmh',
    precipitation: 'metric'
};

let currentUnits = { ...defaultUnits };

const handleTemperatureToggle = (unit) => {
    if (unit === 'celsius') {
        celsiusBtn.classList.add('active');
        fahrenheitBtn.classList.remove('active');
        currentUnits.temperature = 'celsius';
    } else if (unit === 'fahrenheit') {
        fahrenheitBtn.classList.add('active');
        celsiusBtn.classList.remove('active');
        currentUnits.temperature = 'fahrenheit';
    }
};

const handleWindSpeedToggle = (unit) => {
    if (unit === 'kmh') {
        kmhBtn.classList.add('active');
        mphBtn.classList.remove('active');
        currentUnits.windSpeed = 'kmh';
    } else if (unit === 'mph') {
        mphBtn.classList.add('active');
        kmhBtn.classList.remove('active');
        currentUnits.windSpeed = 'mph';
    }
};

const handlePrecipitationToggle = (unit) => {
    if (unit === 'metric') {
        metricBtn.classList.add('active');
        imperialBtn.classList.remove('active');
        currentUnits.precipitation = 'mm';
    } else if (unit === 'imperial') {
        imperialBtn.classList.add('active');
        metricBtn.classList.remove('active');
        currentUnits.precipitation = 'inch';
    }
};

celsiusBtn.addEventListener('click', () => handleTemperatureToggle('celsius'));
fahrenheitBtn.addEventListener('click', () => handleTemperatureToggle('fahrenheit'));
kmhBtn.addEventListener('click', () => handleWindSpeedToggle('kmh'));
mphBtn.addEventListener('click', () => handleWindSpeedToggle('mph'));
metricBtn.addEventListener('click', () => handlePrecipitationToggle('metric'));
imperialBtn.addEventListener('click', () => handlePrecipitationToggle('imperial'));

export const getUnitParams = () => {
    return {
        temperature_unit: currentUnits.temperature,
        wind_speed_unit: currentUnits.windSpeed,
        precipitation_unit: currentUnits.precipitation
    };
};
