const temperatureField = document.querySelector(".temp p");
const locationField = document.querySelector(".time_location p");
const dataandTimeField = document.querySelector(".time_location span");
const conditionField = document.querySelector(".condition p");
const searchField = document.querySelector(".search_area");
const form = document.querySelector("form");

// Optional: for displaying better errors in UI
const errorField = document.querySelector(".error");

let target = 'Mumbai';
const API_KEY = 'd6c2fe35c264e6c0458332533be50981'; // Replace with your valid API key

const fetchResults = async (targetLocation) => {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${targetLocation}&appid=${API_KEY}&units=metric`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        console.log("API Response:", data); // For debugging in browser console

        if (data.cod !== 200) {
            showError(`Error: ${data.message}`);
            return;
        }

        hideError();

        let locationName = data.name;
        let temp = data.main.temp;
        let condition = data.weather[0].description;
        let time = getLocalTime(data.timezone);

        updateDetails(temp, locationName, time, condition);
    } catch (error) {
        console.error("Fetch failed:", error);
        // showError("Something went wrong. Please check your internet or try again later.");
    }
};

function updateDetails(temp, locationName, time, condition) {
    let [splitDate, splitTime] = time.split(" ");
    let currentDay = getDayName(new Date(splitDate).getDay());

    temperatureField.innerText = `${temp}°C`;
    locationField.innerText = locationName;
    dataandTimeField.innerText = `${splitTime} - ${currentDay} ${splitDate}`;
    conditionField.innerText = condition;
}

function searchForLocation(e) {
    e.preventDefault();
    target = searchField.value.trim();
    if (target) {
        fetchResults(target);
        searchField.value = "";
    }
}

form.addEventListener('submit', searchForLocation);
fetchResults(target);

// Utility functions

function getDayName(number) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[number] || "";
}

function getLocalTime(offsetInSeconds) {
    const now = new Date();
    const localTime = new Date(now.getTime() + offsetInSeconds * 1000);
    let date = localTime.toISOString().split("T")[0];
    let time = localTime.toTimeString().split(" ")[0];
    return `${date} ${time}`;
}

function showError(message) {
    if (errorField) {
        errorField.innerText = message;
        errorField.style.display = "block";
    } else {
        alert(message); // fallback
    }
}

function hideError() {
    if (errorField) {
        errorField.style.display = "none";
        errorField.innerText = "";
    }
}
