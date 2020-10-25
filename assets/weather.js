$(document).ready(function () {

    var cityname;
    var queryurl;
    var Apikey = "f9fea2b8e9e46bb87cf75d74d0796e30";

    // check weather on cityList // 
    $("#cityList").on("click", "td", function () {
        // Find what was clicked on, get value
        var clicked = $(this).text();

        (clicked);
    });

    // search cycle // 
    $("#Btn").click(function (weather) {

        cityname = $("#userInput").val();
        queryurl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&units=imperial" + "&appid=" + Apikey;

        if (cityname != "") {
            // Make our AJAX call to pull our necessary values
            $.ajax({
                url: queryurl,
                method: "GET",
            }).then(function (response) {
                console.log(response)

                // Store the lat and lon data for use for the uvi
                var lattitude = response.city.coord.lat;
                var longitude = response.city.coord.lon;

                // call getUVI, pass in lat and lon.
                getUVI(lattitude, longitude);


                var dateTime = convertDate(response.list[0].dt);

                // Grab our DOM elements and display the appropriate weather values to the page.
                $("#cityName").text(response.city.name);
                $("#temp").html(response.list[0].main.temp + " &#730");
                $("#humidity").text(response.list[0].main.humidity);
                $("#wind").text(response.list[0].wind.speed);
                $("#weather_image").attr("src", "http://openweathermap.org/img/w/" + response.list[0].weather[0].icon + ".png");
                $("#dateString").text(dateTime);


                getDailyForecast(response.city.name);

                // FIVE DAYS FORCAST //
                function getDailyForecast(city) {
                    // Make our AJAX call to pull our necessary values
                    $.ajax({
                        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&units=imperial" + "&appid=" + Apikey,
                        method: "GET"
                    }).then(function (response) {
                        // Clear out the div to make room for new forecasts
                        $("#forecastDays").empty();


                        // Add by 7 to cycle through all hourly entries for each day.
                        for (var i = 0, j = 1; i < response.list.length, j <= 5; i += 8, j++) {
                            // Convert our date to human readable format, store in var.
                            var dateTime = convertDate(response.list[i].dt);
                            // Create, style, and set our dynamic DOM elements
                            var newDiv = $("<div>").attr("id", "day" + j);
                            var pTemp = $("<p>");
                            var pHumid = $("<p>");
                            var iconImage = $("<img>");

                            newDiv.attr("class", "col-lg-2").appendTo("#forecastDays");
                            newDiv.html("<h6>" + dateTime + "</h6>").appendTo(newDiv);
                            pTemp.html('<i class="fas fa-thermometer-full"></i>' + response.list[i].main.temp).appendTo(newDiv);
                            pHumid.html('<i class="fas fa-smog"></i>' + response.list[i].main.humidity + "%").appendTo(newDiv);
                            iconImage.attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png").appendTo(newDiv);

                            // Append elements //
                            $("#forecastDays").append(newDiv);
                        }
                    });
                }

            });
        }

    })

    // Uvindex function //
    function getUVI(lattitude, longitude) {
        var queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lattitude + "&lon=" + longitude + "&appid=" + Apikey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

        
            var uvi = parseFloat(response.value);
            console.log(uvi);
           
            $("#uvi").html(uvi);

            
            // Green = favorable, orange = moderate, red = severe.
            if (uvi >= 0 && uvi <= 2) {
                // Remove any dynamically applied classes.
                $("#uvi").removeClass();
                // Add the appropriate color .
                $("#uvi").addClass("uvi favorable");
            }
            else if (uvi > 2 && uvi <= 5) {
                // Remove any dynamically applied classes.
                $("#uvi").removeClass();
                // Add the appropriate color .
                $("#uvi").addClass("uvi moderate");

            }
            else if (uvi > 5 && uvi <= 10) {
                // Remove any dynamically applied classes.
                $("#uvi").removeClass();
                // Add the appropriate color .
                $("#uvi").addClass("uvi severe")
            }

        });
    }

    // Date object //
    function convertDate(date) {
        var newDate = new Date(date * 1000);
        var newDateFormat = newDate.toLocaleDateString();
        return newDateFormat;
    }

})

