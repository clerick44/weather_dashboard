// sets constant for displaying Ferenhaight and degree symbol
const degF = "&#8457";

//resets variable before local data is imported
var searchHistory = [];

$(document).ready(function () {
  loadHistory();
  populateHistory();

  //hides forcast containers and displays current date
  $(".forecast").hide();
  $("#currentDate").html(moment().format("ddd, MMM Do"));

  //calls fetchweather function when clicked
  $("#searchButton").click(function () {
    fetchWeather(searchBox.value);
  });

  //gets data from openweather API
  function fetchWeather(event) {
    var lat;
    var lon;

    //sets variable to search string from whichever button was clicked
    var locationVal = event;
    //displays history
    populateHistory();

    //builds first fetch url using locationVal
    var firstFetchUrl =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      locationVal +
      "&units=imperial&appid=04540eb612d1334a8fb06879d6710e36";
    // var secondFetchUrl =
    //   "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    //   lat +
    //   "&lon=" +
    //   lon +
    //   "&exclude=minutely,hourly,alerts&appid=04540eb612d1334a8fb06879d6710e36";
    //calls first fetch
    fetch(firstFetchUrl)
      //checks for good fetch, displays message if not
      .then((response) => {
        if (!response.ok) {
          alert("Something has gone wrong. Error " + response.status);
          return response.status;
        }
        return response.json();
      })

      .then((data) => {
        //displays location on page
        $("#location").html(data.name);
        //stores location to local storage
        updateHistory(data.name);
        //grabs lat and lon values for searched location to be used in second fetch
        lat = data.coord.lat;
        lon = data.coord.lon;

        var secondFetchUrl =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          lat +
          "&lon=" +
          lon +
          "&exclude=minutely,hourly,alerts&appid=04540eb612d1334a8fb06879d6710e36";
        //calls second fetch and checks for errors
        fetch(secondFetchUrl)
          .then((response) => {
            if (!response.ok) {
              alert("Something has gone wrong. Error " + response.status);
              return response.status;
            }
            return response.json();
          })
          //calls functions to populate app
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

    return;
  }
  //populates current weather data
  function displayCurrentWeather(data) {
    //removes any existing icons before displaying new one
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
    //displays current and high/low temps after converting from degress kelvin and wind, UV index and humidity
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
    //cchanges background color of UV index based on severity
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
  //displays 5 day forecast
  function displayForecast(data) {
    //collects all children into forecast variable
    var forecast = $("#forecastContainer").children();
    //clears any existing data from previous search and makes visable
    $(".forecastDateEl").remove();
    $(".forecastIconEl").remove();
    $(".forecastHighLowEl").remove();
    $(".forecast").show();
    //runs function on all forecast children
    forecast.each(function (i, val) {
      //alligns index of children with forecast data from second fetch
      var offset = i + 1;
      //defines locations for data to be displayed
      var dateDiv = $(this).children(":nth-child(1)");
      var iconDiv = $(this).children(":nth-child(2)");
      var highLowDiv = $(this).children(":nth-child(3)");
      //changes unix date code from second fetch into day and date
      var forecastDate = moment
        .unix(data.daily[offset].dt)
        .format("ddd, MMM Do");
      //converts temps from kelvin to ferenheit
      var highTemp =
        Math.floor(((data.daily[offset].temp.max - 273) * 9) / 5 + 32) + degF;
      var lowTemp =
        Math.floor(((data.daily[offset].temp.min - 273) * 9) / 5 + 32) + degF;
      //displays data in forecast div
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
  //gets stored search history and places it in searchHistory variable defined at top
  function loadHistory() {
    var storedSearchHistory = JSON.parse(
      localStorage.getItem("weatherSearchHistory")
    );
    if (storedSearchHistory !== null) {
      searchHistory = storedSearchHistory;
    }
    return;
  }

  //updates search history, limits it to only last 6 searches and stores locally
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

  //displays saearch history
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
