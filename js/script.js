import { getWeatherData, getLocationSuggestions } from './api.js';
import { initUnitToggles, onUnitChange } from './unitToggle.js';

const locationInput = document.getElementById('location-input');
const suggestionsContainer = document.getElementById('suggestions');
const locationNameElement = document.getElementById('location-name');
const weatherTabsContainer = document.getElementById('weather-tabs');
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
            updateWeatherTabsVisibility();
            resetCurrentLocationButton();

            //Save last location so unit change can refresh weather for the same location
            localStorage.setItem('lastLatitude', latitude);
            localStorage.setItem('lastLongitude', longitude);
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
    getLocationSuggestions(locationInput.value);
});

// Hide suggestions when clicking outside the input or suggestions container
document.addEventListener('click', (event) => {
    if (!locationInput.contains(event.target)) {
        suggestionsContainer.style.display = 'none';
    }
});

// Hide/Show Current, Hourly and Daily if location (current or selected) has not been selected
export const updateWeatherTabsVisibility = () => {
    const hasLocation = locationNameElement.textContent.trim() !== '';
    weatherTabsContainer.style.display = hasLocation ? 'flex' : 'none';
    console.log('Updating weather tabs visibility. Has location:', hasLocation);
};

updateWeatherTabsVisibility();

export const showSuggestions = (suggestions) => {
    suggestionsContainer.innerHTML = '';
    const checkedLocations = new Set();

    // Sort locations alphabetically by name (then by country if names are the same)
    suggestions.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        
        if (nameA === nameB) {
            return a.country.localeCompare(b.country); // secondary sort by country
        }
        return nameA.localeCompare(nameB);
    });

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

    updateWeatherTabsVisibility();

    //Save last location so unit change can refresh weather for the same location
    localStorage.setItem('lastLatitude', location.latitude);
    localStorage.setItem('lastLongitude', location.longitude);
};

// Initialize unit toggles and set up callback to refresh weather on unit change
initUnitToggles();
onUnitChange(() => {
    //Re-fetch current weather with new units when user changes unit preferences
    const currentLatitude = localStorage.getItem('lastLatitude');
    const currentLongitude = localStorage.getItem('lastLongitude');

    if (currentLatitude && currentLongitude) {
        getWeatherData(parseFloat(currentLatitude), parseFloat(currentLongitude));
    }
});
