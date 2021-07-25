$(document).ready(function () {
  $("#currentDate").html(moment().format("ddd, MMM Do"));

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

  function fetchWeather() {
    const degF = "&#8457";
    var lat;
    var lon;
    var locationVal = searchBox.value;

    var firstFetchUrl =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      locationVal +
      "&units=imperial&appid=04540eb612d1334a8fb06879d6710e36";
    var secondFetchUrl =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&exclude=minutely,hourly,alerts&appid=04540eb612d1334a8fb06879d6710e36";

    console.log(firstFetchUrl);
    fetch(firstFetchUrl)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        $("#location").html(data.name);
        $("#currentIcon").append(
          $("<img>", {
            id: "currentConditionsIcon",
            src:
              "http://openweathermap.org/img/wn/" +
              data.weather[0].icon +
              "@2x.png",
          })
        );
        $("#currentTemp").html(Math.floor(data.main.temp) + degF);
        $("#currentHumidity").html(data.main.humidity + "%");
        $("#currentWind").html(Math.round(data.wind.speed) + " mph");

        lat = data.coord.lat;
        lon = data.coord.lon;
        var secondFetchUrl =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          lat +
          "&lon=" +
          lon +
          "&exclude=minutely,hourly,alerts&appid=04540eb612d1334a8fb06879d6710e36";
        console.log(secondFetchUrl);
        fetch(secondFetchUrl)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            $("#high").html(
              Math.floor(((data.daily[0].temp.max - 273) * 9) / 5 + 32) + degF
            );
            $("#low").html(
              Math.floor(((data.daily[0].temp.min - 273) * 9) / 5 + 32) + degF
            );
            $("#currentUvIndex").html(data.current.uvi);

            for (let i = 1; i < data.daily.length; i++) {}
          });
      });

    // .catch((data) {});
  }
});
