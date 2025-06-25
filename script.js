const temperatureField = document.querySelector(".temp p");
const locationField = document.querySelector(".city");
const dataandTimeField = document.querySelector(".datetime");
const conditionField = document.querySelector(".condition p");
const searchField = document.querySelector(".search_area");
const form = document.querySelector("form");
const errorField = document.querySelector(".error");

let target = 'Mumbai';
const API_KEY = 'd6c2fe35c264e6c0458332533be50981'; // Replace with your valid key

// Fetch weather data from OpenWeatherMap
const fetchResults = async (targetLocation) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${targetLocation}&appid=${API_KEY}&units=metric`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod !== 200) {
      showError(`Error: ${data.message}`);
      return;
    }

    hideError();

    const locationName = data.name;
    const temp = data.main.temp;
    const condition = data.weather[0].description;
    const time = getLocalTime(data.timezone);

    updateDetails(temp, locationName, time, condition);
  } catch (error) {
    showError("Failed to fetch data. Please try again.");
  }
};

// Update UI with fetched weather data
function updateDetails(temp, locationName, time, condition) {
  const [date, timePart] = time.split(" ");
  const currentDay = getDayName(new Date(date).getDay());

  temperatureField.innerText = `${Math.round(temp)}°C`;
  locationField.innerText = locationName;
  dataandTimeField.innerText = `${timePart} - ${currentDay} ${date}`;
  conditionField.innerText = `${getWeatherEmoji(condition)} ${capitalize(condition)}`;
}

// Handle user search
function searchForLocation(e) {
  e.preventDefault();
  target = searchField.value.trim();
  if (target) {
    fetchResults(target);
    searchField.value = "";
  }
}

// Listen for form submission
form.addEventListener("submit", searchForLocation);
fetchResults(target); // Initial call

// Utility functions

function getDayName(number) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[number];
}

function getLocalTime(offsetInSeconds) {
  const nowUTC = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60000);
  const targetTime = new Date(nowUTC.getTime() + offsetInSeconds * 1000);

  const year = targetTime.getFullYear();
  const month = String(targetTime.getMonth() + 1).padStart(2, '0');
  const day = String(targetTime.getDate()).padStart(2, '0');
  const hours = String(targetTime.getHours()).padStart(2, '0');
  const minutes = String(targetTime.getMinutes()).padStart(2, '0');
  const seconds = String(targetTime.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function showError(message) {
  errorField.innerText = message;
  errorField.style.display = "block";
}

function hideError() {
  errorField.style.display = "none";
  errorField.innerText = "";
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Add emojis based on weather condition
function getWeatherEmoji(condition) {
  condition = condition.toLowerCase();

  if (condition.includes("clear")) return "☀️";
  if (condition.includes("cloud")) return "☁️";
  if (condition.includes("rain")) return "🌧️";
  if (condition.includes("drizzle")) return "🌦️";
  if (condition.includes("thunderstorm")) return "⛈️";
  if (condition.includes("snow")) return "❄️";
  if (condition.includes("mist") || condition.includes("fog") || condition.includes("haze")) return "🌫️";
  if (condition.includes("smoke")) return "💨";
  if (condition.includes("dust") || condition.includes("sand")) return "🌪️";

  return "🌡️"; // default
}
