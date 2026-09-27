// ========================================
// WEATHER APP - script.js
// ========================================

// Paste your OpenWeatherMap API key here
const API_KEY = "58df0758e8b142d3cd1b2abdddb26199";

// Current temperature unit
let currentUnit = "C";

// Store current weather
let currentWeather = null;

// Store forecast
let forecastData = [];

// ========================================
// GET HTML ELEMENTS
// ========================================

const searchForm = document.getElementById("searchForm");

const cityInput = document.getElementById("cityInput");

const locationBtn = document.getElementById("locationBtn");

const themeBtn = document.getElementById("themeBtn");

const celsiusBtn = document.getElementById("celsiusBtn");

const fahrenheitBtn =
    document.getElementById("fahrenheitBtn");

const status = document.getElementById("status");
// Weather suggestion elements

const suggestionIcon =
    document.getElementById("suggestionIcon");

const suggestionTitle =
    document.getElementById("suggestionTitle");

const suggestionMessage =
    document.getElementById("suggestionMessage");

const suggestionTip =
    document.getElementById("suggestionTip");

// ========================================
// SEARCH CITY
// ========================================

searchForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const city = cityInput.value.trim();

    if (city === "") {

        showStatus(
            "Please enter a city name.",
            "error"
        );

        return;
    }

    getWeatherByCity(city);

});


// ========================================
// GET WEATHER BY CITY
// ========================================

async function getWeatherByCity(city) {

    showStatus(
        "🌤️ Loading weather...",
        "loading"
    );

    try {

        const url =
            `https://api.openweathermap.org/data/2.5/weather?` +
            `q=${encodeURIComponent(city)}` +
            `&appid=${API_KEY}` +
            `&units=metric`;


        const response = await fetch(url);


        // Check API response
        if (!response.ok) {

            const errorData =
                await response.json();

            console.log(
                "OpenWeatherMap Error:",
                errorData
            );

            if (response.status === 401) {

                throw new Error(
                    "Invalid API key. Check your OpenWeatherMap API key."
                );
            }

            if (response.status === 404) {

                throw new Error(
                    "City not found. Check the city name."
                );
            }

            if (response.status === 429) {

                throw new Error(
                    "Too many API requests. Please try again later."
                );
            }

            throw new Error(
                errorData.message ||
                "Weather request failed."
            );
        }


        const data =
            await response.json();


        // Save weather data
        currentWeather = data;


        // Display weather
        displayWeather(data);


        // Get forecast
        await getForecast(
            data.coord.lat,
            data.coord.lon
        );


        showStatus("");

    }

    catch (error) {

        console.error(
            "Weather Error:",
            error
        );

        showStatus(
            "❌ " + error.message,
            "error"
        );

    }

}


// ========================================
// DISPLAY CURRENT WEATHER
// ========================================

function displayWeather(data) {

    // City
    document.getElementById("city")
        .textContent =
        `${data.name}, ${data.sys.country}`;


    // Weather description
    document.getElementById("description")
        .textContent =
        data.weather[0].description;


    // Humidity
    document.getElementById("humidity")
        .textContent =
        `${data.main.humidity}%`;


    // Pressure
    document.getElementById("pressure")
        .textContent =
        `${data.main.pressure} hPa`;


    // Wind speed
    // API gives meters/second
    // Convert to kilometers/hour

    const windSpeed =
        data.wind.speed * 3.6;

    document.getElementById("wind")
        .textContent =
        `${Math.round(windSpeed)} km/h`;


    // Weather icon
    document.getElementById("weatherIcon")
        .textContent =
        getWeatherIcon(
            data.weather[0].main
        );


    // Current date
    const today =
        new Date();

    document.getElementById("date")
        .textContent =
        today.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric"
            }
        );


    // Temperature
    // Temperature
updateTemperature();

// Update funny and motivational suggestion
updateWeatherSuggestion(data);

}


// ========================================
// UPDATE TEMPERATURE
// ========================================

function updateTemperature() {

    if (!currentWeather) {
        return;
    }


    const celsius =
        currentWeather.main.temp;


    const feelsCelsius =
        currentWeather.main.feels_like;


    let temperature;

    let feelsLike;


    // Celsius
    if (currentUnit === "C") {

        temperature =
            celsius;

        feelsLike =
            feelsCelsius;

    }

    // Fahrenheit
    else {

        temperature =
            (celsius * 9 / 5) + 32;

        feelsLike =
            (feelsCelsius * 9 / 5) + 32;

    }


    document.getElementById("temperature")
        .textContent =
        Math.round(temperature);


    document.getElementById("unit")
        .textContent =
        currentUnit;


    document.getElementById("feelsLike")
        .textContent =
        `${Math.round(feelsLike)}°${currentUnit}`;


    // Update forecast temperatures
    updateForecastTemperatures();

}


// ========================================
// CELSIUS BUTTON
// ========================================

celsiusBtn.addEventListener(
    "click",
    function () {

        currentUnit = "C";


        celsiusBtn.classList.add("active");

        fahrenheitBtn.classList.remove(
            "active"
        );


        updateTemperature();

    }
);


// ========================================
// FAHRENHEIT BUTTON
// ========================================

fahrenheitBtn.addEventListener(
    "click",
    function () {

        currentUnit = "F";


        fahrenheitBtn.classList.add(
            "active"
        );

        celsiusBtn.classList.remove(
            "active"
        );


        updateTemperature();

    }
);


// ========================================
// WEATHER ICON
// ========================================

function getWeatherIcon(condition) {

    const icons = {

        Clear: "☀️",

        Clouds: "☁️",

        Rain: "🌧️",

        Drizzle: "🌦️",

        Thunderstorm: "⛈️",

        Snow: "❄️",

        Mist: "🌫️",

        Smoke: "🌫️",

        Haze: "🌫️",

        Dust: "🌪️",

        Fog: "🌫️",

        Sand: "🌪️",

        Ash: "🌋",

        Squall: "💨",

        Tornado: "🌪️"

    };


    return icons[condition] || "🌤️";

}


// ========================================
// GET 5-DAY FORECAST
// ========================================

async function getForecast(lat, lon) {

    try {

        const url =
            `https://api.openweathermap.org/data/2.5/forecast?` +
            `lat=${lat}` +
            `&lon=${lon}` +
            `&appid=${API_KEY}` +
            `&units=metric`;


        const response =
            await fetch(url);


        if (!response.ok) {

            const errorData =
                await response.json();

            console.log(
                "Forecast Error:",
                errorData
            );

            throw new Error(
                errorData.message ||
                "Forecast unavailable"
            );

        }


        const data =
            await response.json();


        // Convert 3-hour data into daily data
        forecastData =
            getDailyForecast(data.list);


        displayForecast();

    }

    catch (error) {

        console.error(
            "Forecast Error:",
            error
        );


        document.getElementById(
            "forecast"
        ).innerHTML = `

            <div class="forecast-placeholder">
                ⚠️ Forecast unavailable.
            </div>

        `;

    }

}


// ========================================
// CREATE DAILY FORECAST
// ========================================

function getDailyForecast(list) {

    const days = {};


    list.forEach(function (item) {

        const date =
            item.dt_txt.split(" ")[0];


        // If this date isn't stored yet
        if (!days[date]) {

            days[date] = item;

            return;

        }


        // Find forecast closest to 12 PM

        const existingHour =
            parseInt(
                days[date]
                    .dt_txt
                    .split(" ")[1]
            );


        const newHour =
            parseInt(
                item.dt_txt
                    .split(" ")[1]
            );


        if (
            Math.abs(newHour - 12) <
            Math.abs(existingHour - 12)
        ) {

            days[date] = item;

        }

    });


    return Object.values(days)
        .slice(0, 5);

}


// ========================================
// DISPLAY FORECAST
// ========================================

function displayForecast() {

    const forecast =
        document.getElementById("forecast");


    forecast.innerHTML = "";


    forecastData.forEach(
        function (item) {

            const date =
                new Date(item.dt * 1000);


            const day =
                date.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "short"
                    }
                );


            const icon =
                getWeatherIcon(
                    item.weather[0].main
                );


            const temperature =
                formatTemperature(
                    item.main.temp
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "forecast-card";


            card.innerHTML = `

                <div class="forecast-day">
                    ${day}
                </div>

                <div class="forecast-icon">
                    ${icon}
                </div>

                <div
                    class="forecast-temp"
                    data-temp="${item.main.temp}"
                >
                    ${temperature}
                </div>

                <div class="forecast-description">
                    ${item.weather[0].description}
                </div>

            `;


            forecast.appendChild(card);

        }
    );

}


// ========================================
// UPDATE FORECAST TEMPERATURES
// ========================================

function updateForecastTemperatures() {

    if (forecastData.length === 0) {
        return;
    }


    const temperatures =
        document.querySelectorAll(
            ".forecast-temp"
        );


    temperatures.forEach(
        function (element, index) {

            const temperature =
                forecastData[index]
                    .main.temp;


            element.textContent =
                formatTemperature(
                    temperature
                );

        }
    );

}


// ========================================
// FORMAT TEMPERATURE
// ========================================

function formatTemperature(celsius) {

    let temperature;


    if (currentUnit === "C") {

        temperature =
            celsius;

    }

    else {

        temperature =
            (celsius * 9 / 5) + 32;

    }


    return `${Math.round(temperature)}°${currentUnit}`;

}


// ========================================
// USE MY LOCATION
// ========================================

locationBtn.addEventListener(
    "click",
    function () {

        if (!navigator.geolocation) {

            showStatus(
                "❌ Geolocation is not supported.",
                "error"
            );

            return;

        }


        showStatus(
            "📍 Getting your location...",
            "loading"
        );


        navigator.geolocation.getCurrentPosition(

            function (position) {

                const lat =
                    position.coords.latitude;


                const lon =
                    position.coords.longitude;


                getWeatherByCoordinates(
                    lat,
                    lon
                );

            },


            function (error) {

                console.error(
                    "Location Error:",
                    error
                );


                showStatus(
                    "❌ Please allow location access.",
                    "error"
                );

            }

        );

    }
);


// ========================================
// GET WEATHER BY LOCATION
// ========================================

async function getWeatherByCoordinates(
    lat,
    lon
) {

    try {

        const url =
            `https://api.openweathermap.org/data/2.5/weather?` +
            `lat=${lat}` +
            `&lon=${lon}` +
            `&appid=${API_KEY}` +
            `&units=metric`;


        const response =
            await fetch(url);


        if (!response.ok) {

            const errorData =
                await response.json();

            console.log(
                "Location Weather Error:",
                errorData
            );


            throw new Error(
                errorData.message ||
                "Unable to get weather."
            );

        }


        const data =
            await response.json();


        currentWeather = data;


        displayWeather(data);


        await getForecast(
            lat,
            lon
        );


        showStatus("");

    }

    catch (error) {

        console.error(error);


        showStatus(
            "❌ " + error.message,
            "error"
        );

    }

}


// ========================================
// DARK / LIGHT MODE
// ========================================

themeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        const darkMode =
            document.body.classList.contains(
                "dark"
            );


        if (darkMode) {

            themeBtn.textContent = "☀️";

        }

        else {

            themeBtn.textContent = "🌙";

        }


        // Save theme
        localStorage.setItem(
            "darkMode",
            darkMode
        );

    }
);


// ========================================
// LOAD SAVED THEME
// ========================================

const savedDarkMode =
    localStorage.getItem(
        "darkMode"
    );


if (savedDarkMode === "true") {

    document.body.classList.add(
        "dark"
    );

    themeBtn.textContent = "☀️";

}


// ========================================
// SHOW STATUS MESSAGE
// ========================================

function showStatus(
    message,
    type = ""
) {

    status.textContent =
        message;


    status.className =
        `status ${type}`;

}
// ========================================
// FUNNY & MOTIVATIONAL WEATHER SUGGESTIONS
// ========================================

function updateWeatherSuggestion(data) {

    const weatherCondition =
        data.weather[0].main;

    const temperature =
        data.main.temp;

    let icon = "🌤️";

    let title = "";

    let message = "";

    let tip = "";


    // ========================================
    // HOT WEATHER
    // ========================================

    if (
        weatherCondition === "Clear" &&
        temperature >= 35
    ) {

        icon = "🥵";

        title = "The Sun Is Doing Too Much! ☀️";

        message =
            "The sun is working overtime today! " +
            "Drink water, stay cool, and don't let " +
            "your motivation melt.";

        tip =
            "💡 Hydrate yourself. " +
            "Your dreams need you fully charged!";

    }


    // ========================================
    // NORMAL SUNNY WEATHER
    // ========================================

    else if (
        weatherCondition === "Clear"
    ) {

        icon = "☀️";

        title = "Sunshine Mode: ON! 😎";

        message =
            "The sky is clear and your future is bright. " +
            "Go outside, enjoy the sunshine, " +
            "and make something amazing happen!";

        tip =
            "💡 A little progress every day " +
            "creates a big success.";

    }


    // ========================================
    // RAINY WEATHER
    // ========================================

    else if (
        weatherCondition === "Rain" ||
        weatherCondition === "Drizzle"
    ) {

        icon = "🌧️";

        title = "Rain Outside, Dreams Inside! ☔";

        message =
            "The clouds are crying, but you don't have to! " +
            "Grab your umbrella, stay positive, " +
            "and keep moving toward your goals.";

        tip =
            "💡 Rainy days are perfect for " +
            "learning something new.";

    }


    // ========================================
    // THUNDERSTORM
    // ========================================

    else if (
        weatherCondition === "Thunderstorm"
    ) {

        icon = "⛈️";

        title = "Even The Sky Is Making Noise! ⚡";

        message =
            "The sky is having a dramatic moment! " +
            "Stay indoors, stay safe, and remember: " +
            "your goals are bigger than today's storm.";

        tip =
            "💡 Safety first! " +
            "Your success story can wait until the storm passes.";

    }


    // ========================================
    // CLOUDY WEATHER
    // ========================================

    else if (
        weatherCondition === "Clouds"
    ) {

        icon = "☁️";

        title = "The Sky Is Buffering... 😂";

        message =
            "The clouds are hiding the sunshine, " +
            "but your potential is still shining! " +
            "Keep working. Your success is loading...";

        tip =
            "💡 Don't wait for perfect weather " +
            "to make progress.";

    }


    // ========================================
    // MIST / FOG
    // ========================================

    else if (
        weatherCondition === "Mist" ||
        weatherCondition === "Fog" ||
        weatherCondition === "Haze"
    ) {

        icon = "🌫️";

        title = "Visibility: Low. Motivation: HIGH! 🚀";

        message =
            "The weather is a little blurry today, " +
            "but your dreams don't need a clear sky. " +
            "Take one small step forward.";

        tip =
            "💡 Focus on your next step, " +
            "not the whole staircase.";

    }


    // ========================================
    // SNOW
    // ========================================

    else if (
        weatherCondition === "Snow"
    ) {

        icon = "❄️";

        title = "Winter Is Here! 🥶";

        message =
            "It's cold outside, but your goals " +
            "don't need a blanket! Stay warm, " +
            "stay focused, and keep learning.";

        tip =
            "💡 Warm drink + good plan = " +
            "productive day.";

    }


    // ========================================
    // DEFAULT WEATHER
    // ========================================

    else {

        icon = "🌍";

        title = "Whatever The Weather, Keep Going! 💪";

        message =
            "The weather may change, but your goals " +
            "should stay strong. Keep learning, " +
            "keep growing, and keep smiling!";

        tip =
            "💡 Your future self will thank you " +
            "for today's effort.";

    }


    // ========================================
    // UPDATE THE WEBSITE
    // ========================================

    suggestionIcon.textContent = icon;

    suggestionTitle.textContent = title;

    suggestionMessage.textContent = message;

    suggestionTip.textContent = tip;

}