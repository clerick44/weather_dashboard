const degF = "&#8457";

var searchHistory = [];

$(document).ready(function () {
  loadHistory();
  populateHistory();

  $(".forecast").hide();
  $("#currentDate").html(moment().format("ddd, MMM Do"));

  $("#searchButton").click(function () {
    fetchWeather(searchBox.value);
  });

  function fetchWeather(event) {
    console.log(event);
    // console.log(data);
    var lat;
    var lon;
    // var locationVal = searchBox.value;
    var locationVal = event;
    // updateHistory(locationVal);
    populateHistory();

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

    fetch(firstFetchUrl)
      .then((response) => {
        if (!response.ok) {
          alert("Something has gone wrong. Error " + response.status);
          return response.status;
        }
        return response.json();
      })
      .then((data) => {
        $("#location").html(data.name);
        updateHistory(data.name);
        lat = data.coord.lat;
        lon = data.coord.lon;

        var secondFetchUrl =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          lat +
          "&lon=" +
          lon +
          "&exclude=minutely,hourly,alerts&appid=04540eb612d1334a8fb06879d6710e36";

        fetch(secondFetchUrl)
          .then((response) => {
            if (!response.ok) {
              alert("Something has gone wrong. Error " + response.status);
              return response.status;
            }
            return response.json();
          })
          .then((data) => {
            displayCurrentWeather(data);
            displayForecast(data);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });

    // .catch(data) {
    return;
  }

  function displayCurrentWeather(data) {
    $("#currentConditionsIcon").remove();
    $("#currentIcon").append(
      $("<img>", {
        id: "currentConditionsIcon",
        src:
          "http://openweathermap.org/img/wn/" +
          data.current.weather[0].icon +
          "@2x.png",
      })
    );
    $("#currentTemp").html(
      Math.floor(((data.current.temp - 273) * 9) / 5 + 32) + degF
    );
    $("#currentHumidity").html(data.current.humidity + "%");
    $("#currentWind").html(Math.round(data.current.wind_speed) + " mph");

    $("#high").html(
      Math.floor(((data.daily[0].temp.max - 273) * 9) / 5 + 32) + degF
    );
    $("#low").html(
      Math.floor(((data.daily[0].temp.min - 273) * 9) / 5 + 32) + degF
    );
    $("#currentUvIndex").html(Math.floor(data.current.uvi));
    var uvi = Math.floor(data.current.uvi);

    if (uvi < 3) {
      $("#currentUvIndex").css("background-color", "green");
    } else if (uvi >= 3 && uvi < 6) {
      $("#currentUvIndex").css("background-color", "yellow");
    } else if (uvi >= 6 && uvi < 8) {
      $("#currentUvIndex").css("background-color", "orange");
    } else if (uvi >= 8 && uvi < 11) {
      $("#currentUvIndex").css("background-color", "red");
    } else {
      $("#currentUvIndex").css("background-color", "purple");
    }
    return;
  }

  function displayForecast(data) {
    var forecast = $("#forecastContainer").children();

    $(".forecastDateEl").remove();
    $(".forecastIconEl").remove();
    $(".forecastHighLowEl").remove();
    $(".forecast").show();

    forecast.each(function (i, val) {
      var offset = i + 1;

      var dateDiv = $(this).children(":nth-child(1)");
      var iconDiv = $(this).children(":nth-child(2)");
      var highLowDiv = $(this).children(":nth-child(3)");

      var forecastDate = moment
        .unix(data.daily[offset].dt)
        .format("ddd, MMM Do");
      var highTemp =
        Math.floor(((data.daily[offset].temp.max - 273) * 9) / 5 + 32) + degF;
      var lowTemp =
        Math.floor(((data.daily[offset].temp.min - 273) * 9) / 5 + 32) + degF;

      $(dateDiv).append(
        "<span class='forecastDateEl'>" + forecastDate + "</span>"
      );

      $(iconDiv).append(
        $("<img>", {
          class: "forecastIconEl",
          src:
            "http://openweathermap.org/img/wn/" +
            data.daily[offset].weather[0].icon +
            "@2x.png",
        })
      );

      $(highLowDiv).append(
        $(
          "<span class='forecastHighLowEl'>" +
            highTemp +
            " / " +
            lowTemp +
            "</span>"
        )
      );
    });
  }

  function loadHistory() {
    var storedSearchHistory = JSON.parse(
      localStorage.getItem("weatherSearchHistory")
    );
    if (storedSearchHistory !== null) {
      searchHistory = storedSearchHistory;
    }
    return;
  }

  function updateHistory(val) {
    if (searchHistory.length > 5) {
      searchHistory.shift();
    }

    if (searchHistory.indexOf(val) !== -1) {
      return;
    }

    searchHistory.push(val);
    localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));
    return;
  }

  function populateHistory() {
    $(".historyButton").remove();

    $.each(searchHistory, function (i, val) {
      $("#searchHistory").append(
        "<div class='historyButton'>" + searchHistory[i] + "</div>"
      );
    });
    $(".historyButton").click(function () {
      fetchWeather($(this).text());
    });

    return;
  }
});
