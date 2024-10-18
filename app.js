const bodyParser = require("body-parser");
const express = require("express");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    const query = req.body.cityName;  // Correctly get the city name
    const apiKey = "729258e8f0045e4e9b7d2468326ba699";
    const unit = "metric";

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

    https.get(url, function (response) {
        console.log(response.statusCode);

        if (response.statusCode === 200) {
            response.on("data", function (data) {
                const weatherData = JSON.parse(data);

                // Check if the necessary fields are present in the response
                if (weatherData.main && weatherData.weather) {
                    const temp = weatherData.main.temp;
                    const weatherDescription = weatherData.weather[0].description;
                    const icon = weatherData.weather[0].icon;
                    const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

                    res.write("<p>The weather in " + query + " is currently " + weatherDescription + ".</p>");
                    res.write("<h1>The temperature in " + query + " is " + temp + " degrees Celsius.</h1>");
                    res.write("<img src=" + imageURL + ">");
                    res.send();
                } else {
                    res.write("<p>Weather data not available for " + query + ". Please try another city.</p>");
                    res.send();
                }
            });
        } else {
            res.write("<p>Unable to fetch weather data. Please check the city name and try again.</p>");
            res.send();
        }
    }).on("error", function (e) {
        console.error(e.message);
        res.send("Error occurred while fetching weather data.");
    });
});

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});
