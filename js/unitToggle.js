let currentUnits = {
    temperature: 'celsius',
    windSpeed: 'kmh',
    precipitation: 'mm'
};

let refreshWeatherCallback = null;
let celsiusBtn, fahrenheitBtn, kmhBtn, mphBtn, metricBtn, imperialBtn;

// Load from localStorage
const loadSavedUnits = () => {
    const saved = localStorage.getItem('lumoraUnits');
    if (saved) {
        currentUnits = { ...currentUnits, ...JSON.parse(saved) };
    }
};

// Save to localStorage
const saveUnits = () => {
    localStorage.setItem('lumoraUnits', JSON.stringify(currentUnits));
};

export const getUnitParams = () => {
    return {
        temperature_unit: currentUnits.temperature,
        wind_speed_unit: currentUnits.windSpeed,
        precipitation_unit: currentUnits.precipitation
    };
};

export const getCurrentUnits = () => ({ ...currentUnits });

const updateButtonStates = () => {
    celsiusBtn.classList.toggle('active', currentUnits.temperature === 'celsius');
    fahrenheitBtn.classList.toggle('active', currentUnits.temperature === 'fahrenheit');
    
    kmhBtn.classList.toggle('active', currentUnits.windSpeed === 'kmh');
    mphBtn.classList.toggle('active', currentUnits.windSpeed === 'mph');
    
    metricBtn.classList.toggle('active', currentUnits.precipitation === 'mm');
    imperialBtn.classList.toggle('active', currentUnits.precipitation === 'inch');
};

const refreshWeather = () => {
    if (refreshWeatherCallback) refreshWeatherCallback();
};

export const initUnitToggles = () => {
    // Get DOM elements
    celsiusBtn = document.getElementById('celsius');
    fahrenheitBtn = document.getElementById('fahrenheit');
    kmhBtn = document.getElementById('kmh');
    mphBtn = document.getElementById('mph');
    metricBtn = document.getElementById('metric');
    imperialBtn = document.getElementById('imperial');

    if (!celsiusBtn) return; // Safety check to ensure elements exist before proceeding

    loadSavedUnits();

    // Set active states
    updateButtonStates();

    // Temperature event listeners
    celsiusBtn.addEventListener('click', () => {
        currentUnits.temperature = 'celsius';
        updateButtonStates();
        saveUnits();
        refreshWeather();
    });

    fahrenheitBtn.addEventListener('click', () => {
        currentUnits.temperature = 'fahrenheit';
        updateButtonStates();
        saveUnits();
        refreshWeather();
    });

    // Wind speed event listeners
    kmhBtn.addEventListener('click', () => {
        currentUnits.windSpeed = 'kmh';
        updateButtonStates();
        saveUnits();
        refreshWeather();
    });

    mphBtn.addEventListener('click', () => {
        currentUnits.windSpeed = 'mph';
        updateButtonStates();
        saveUnits();
        refreshWeather();
    });

    // Precipitation event listeners
    metricBtn.addEventListener('click', () => {
        currentUnits.precipitation = 'mm';
        updateButtonStates();
        saveUnits();
        refreshWeather();
    });

    imperialBtn.addEventListener('click', () => {
        currentUnits.precipitation = 'inch';
        updateButtonStates();
        saveUnits();
        refreshWeather();
    });
};

export const onUnitChange = (callback) => {
    refreshWeatherCallback = callback;
};

