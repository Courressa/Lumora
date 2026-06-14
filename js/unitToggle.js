let currentUnits = {
    temperature: 'celsius',
    windSpeed: 'kmh',
    precipitation: 'mm'
};

let refreshWeatherCallback = null;
let unitSection, unitArrow;
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
    unitSection = document.getElementById('unit-section');
    unitArrow = document.getElementById('unit-arrow');
    celsiusBtn = document.getElementById('celsius');
    fahrenheitBtn = document.getElementById('fahrenheit');
    kmhBtn = document.getElementById('kmh');
    mphBtn = document.getElementById('mph');
    metricBtn = document.getElementById('metric');
    imperialBtn = document.getElementById('imperial');

    if (!unitSection) return; // Safety check to ensure elements exist before proceeding

    loadSavedUnits();

    // Set active states
    updateButtonStates();

    // === Slide Toggle ===
    unitArrow.addEventListener('click', () => {
        unitSection.classList.toggle('closed');
    });

    // === Unit Change Handlers (with no-refresh if already active) ===
    celsiusBtn.addEventListener('click', () => {
        if (currentUnits.temperature === 'celsius') return;
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

