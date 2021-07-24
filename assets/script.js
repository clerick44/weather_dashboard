$(document).ready(function () {
  const searchBoxEl = document.querySelector("#searchBox");
  const searchButtonEl = document.querySelector("#searchButton");
  const locationEl = document.querySelector("#location");
  const currentIconEl = document.querySelector("#currentIcon");
  const currentDateEl = document.querySelector("#currentDate");
  const currentTempEl = document.querySelector("#currentTemp");
  const currentHighLowEl = document.querySelector("#currentHighLow");
  const currentHumidityEl = document.querySelector("#currentHumidity");
  const currentWindEl = document.querySelector("#currentWind");
  const currentUvIndexEl = document.querySelector("#currentUvIndex");

  searchButtonEl.addEventListener("click", fetchWeather);

  var todayDate;

  function fetchWeather() {
    todayDate = moment().format("ddd, MMM Do");

    var locationVal = searchBox.value;

    var fetchUrl =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      locationVal +
      "&units=imperial&appid=04540eb612d1334a8fb06879d6710e36";
    console.log(fetchUrl);
    fetch(fetchUrl)
      .then((response) => response.json())
      .then((data) => console.log(data));
  }
});
