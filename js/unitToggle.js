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
        if (currentUnits.temperature === 'celsius') return; // No change and prevent unnecessary refresh
        currentUnits.temperature = 'celsius';
        updateButtonStates();
        saveUnits();
        refreshWeather();
    });

    fahrenheitBtn.addEventListener('click', () => {
        if (currentUnits.temperature === 'fahrenheit') return;
        currentUnits.temperature = 'fahrenheit';
        updateButtonStates();
        saveUnits();
        refreshWeather();
    });

    // Wind speed event listeners
    kmhBtn.addEventListener('click', () => {
        if (currentUnits.windSpeed === 'kmh') return;
        currentUnits.windSpeed = 'kmh';
        updateButtonStates();
        saveUnits();
        refreshWeather();
    });

    mphBtn.addEventListener('click', () => {
        if (currentUnits.windSpeed === 'mph') return;
        currentUnits.windSpeed = 'mph';
        updateButtonStates();
        saveUnits();
        refreshWeather();
    });

    // Precipitation event listeners
    metricBtn.addEventListener('click', () => {
        if (currentUnits.precipitation === 'mm') return;
        currentUnits.precipitation = 'mm';
        updateButtonStates();
        saveUnits();
        refreshWeather();
    });

    imperialBtn.addEventListener('click', () => {
        if (currentUnits.precipitation === 'inch') return;
        currentUnits.precipitation = 'inch';
        updateButtonStates();
        saveUnits();
        refreshWeather();
    });
};

export const onUnitChange = (callback) => {
    refreshWeatherCallback = callback;
};

