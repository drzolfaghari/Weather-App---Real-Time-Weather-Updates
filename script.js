const API_KEY = 'YOUR_API_KEY'; // جایگزین کنید با API Key خود از OpenWeatherMap

async function getWeather() {
    const city = document.getElementById('cityInput').value;
    if (!city) {
        alert('Please enter a city name!');
        return;
    }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        if (data.cod === '404') {
            alert('City not found!');
            return;
        }

        // Update UI
        document.getElementById('cityName').textContent = data.name;
        document.getElementById('temp').textContent = `${Math.round(data.main.temp)} °C`;
        document.getElementById('desc').textContent = data.weather[0].description;
        document.getElementById('humidity').textContent = data.main.humidity;
        document.getElementById('wind').textContent = Math.round(data.wind.speed * 3.6); // Convert m/s to km/h

        // Set weather icon
        const iconCode = data.weather[0].icon;
        document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    }
}

// Optional: Load weather for default city on page load
window.onload = function() {
    getWeatherByLocation();
};

async function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
                );
                const data = await response.json();
                document.getElementById('cityInput').value = data.name;
                getWeather();
            },
            (error) => {
                console.error('Geolocation error:', error);
                // Default to a popular city
                document.getElementById('cityInput').value = 'Tehran';
                getWeather();
            }
        );
    } else {
        document.getElementById('cityInput').value = 'Tehran';
        getWeather();
    }
}