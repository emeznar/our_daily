window.onload = function() {

    //get current time as page loads
    DisplayCurrentTime();

    //get weather data on page load
    getWeatherdata();

    //get drawing board on page load
    getDrawingBoard();


};

function DisplayCurrentTime() {
    var date = new Date();
    //make a list of days then assign variable by calling day integer of array
    var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday"
    ];
    var day = dayNames[date.getDay()];

    //list months then assign variable by calling month integer of array
    var monthNames = ["January", "February", "March", "April",
        "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    var month = monthNames[date.getMonth()];

    //Get day of month as an integer
    var dayofmonth = date.getDate();
    //Get time - hours - separate am/pm then minutes//add leading zeros
    function addZeros(value) {
        if (value < 10) {
            return "0" + value;
        } else {
            return value;
        }
    }
    var hours = addZeros(date.getHours()) > 12 ? date.getHours() - 12 : date.getHours();
    var am_pm = date.getHours() >= 12 ? "PM" : "AM";
    var minutes = addZeros(date.getMinutes());

    //Add greeting
    var greeting = '';
    if (date.getHours() < 12) {
        greeting = "Good morning, on  ";
    } else if (date.getHours() > 15) {
        greeting = "Good evening, on  ";
    } else {
        greeting = "Good afternoon, on  ";
    }

    //assign all info obtained to variable and send to main page
    var time = greeting + day + ", " + month + " " + dayofmonth + " at " +
        hours.toString() + ":" + minutes + " " + am_pm;
    //console.log(time);
    document.querySelector("#displaydateTime").innerHTML = time;

}
//Query api for weather information on top of page
function getWeatherdata() {

    var weather_key = config.MY_WEATHERKEY;
    var lattitude = 38.8114;
    var longitude = -89.9532;
    var params = weather_key + "/" + lattitude + "," + longitude;
    var todaysConditions = "";
    var todaysLow = "";
    var todaysHigh = "";

    $.ajax({
        dataType: 'jsonp', //workaround for CORS error from local server
        url: "https://api.darksky.net/forecast/" + params,
        type: 'GET',

        success: function(response) {
            console.log(response);
            //Today's weather
            var currentTemp = Math.round(response.currently.temperature);
            var currentWeather = response.currently.summary;
            //get icon variable from response and run through function for src assignment
            var todaysweathericon = response.daily.data[0].icon;
            document.getElementById('todayicon').src = getWeatherIcon(todaysweathericon);
            //get forecast summary from response
            var todaysConditions = (response.daily.data[0].summary); //.substring(0,13);
            //get low and high from response
            var todaysLow = Math.round(response.daily.data[0].temperatureMin);
            var todaysHigh = Math.round(response.daily.data[0].temperatureMax);
            //Tomorrow's weather - do same as above for response data
            var day1weathericon = response.daily.data[1].icon;
            document.getElementById('day1icon').src = getWeatherIcon(day1weathericon);
            var day1Conditions = (response.daily.data[1].summary); //.substring(0,13);
            var day1Low = Math.round(response.daily.data[1].temperatureMin);
            var day1High = Math.round(response.daily.data[1].temperatureMax);
            //Next day's weather
            //Get day again and add 2 for display - nextday
            var todaydate = new Date();
            //shift start of list by 2 to get day 2 days from now
            var dayNames = ["Tuesday", "Wednesday", "Thursday", "Friday",
                "Saturday", "Sunday", "Monday"
            ];
            var nextday = dayNames[todaydate.getDay()];
            var day2weathericon = response.daily.data[2].icon;
            document.getElementById('day2icon').src = getWeatherIcon(day2weathericon);
            var day2Conditions = (response.daily.data[2].summary); //.substring(0,13);
            var day2Low = Math.round(response.daily.data[2].temperatureMin);
            var day2High = Math.round(response.daily.data[2].temperatureMax);

            //Send the rest of the info to page
            //Current conditions
            $("#displaycurrent").text("Weather conditions were " + currentWeather +
                " and " + currentTemp + String.fromCharCode(176));
            //Todays forecast
            $("#todaysforecast").text(todaysConditions);
            $("#todayHiLow").text(todaysLow + String.fromCharCode(176) + "|" + todaysHigh + String.fromCharCode(176));
            //Tomorrow's forecast
            $("#day1forecast").text(day1Conditions);
            $("#tomorrowHiLow").text(day1Low + String.fromCharCode(176) + "|" + day1High + String.fromCharCode(176));
            //next day's forecast (enter day with variable)
            $("#day2day").text(nextday);
            $("#day2forecast").text(day2Conditions);
            $("#nextDayHiLow").text(day2Low + String.fromCharCode(176) + "|" + day2High + String.fromCharCode(176));
        },
        error: function(response) {
            console.log('Error in Operation');
        }
    });
}

function getWeatherIcon(x) {
    //if response/day/icon = defined text, assign image
    var weathericon = "";
    if (x === "partly-cloudy-day") {
        weathericon = "img/partlycloudyday.png";
    } else if (x === "partly-cloudy-night") {
        weathericon = "img/partlycloudynight.png";
    } else if (x === "cloudy") {
        weathericon = "img/cloudy.png";
    } else if (x === "fog") {
        weathericon = "img/fog.png";
    } else if (x === "wind") {
        weathericon = "img/wind.png";
    } else if (x === "sleet") {
        weathericon = "img/sleet.png";
    } else if (x === "snow") {
        weathericon = "img/snow.png";
    } else if (x === "rain") {
        weathericon = "img/rain.png";
    } else if (x === "clear-night") {
        weathericon = "img/clearnight.png";
    } else {
        weathericon = "img/clearday.png";
    }
    return weathericon;
}
//Add school lunch menu pdf to iframe
//get current month abbreviation a different way from above and use for menu link
function getSchoolLunchMenu() {
    var today = new Date();
    today2 = today.toString();
    var monthAbrev = (today2.substr(4, 4)).trim();
    var lunchMenuLink = "http://www.ecusd7.org/departments/food_service/menus/2016-17/" +
        monthAbrev + "/ElemLunch.pdf#toolbar=0"; //toolbar=0 disables save/print option at top
    document.getElementById('lunch-menu').src = lunchMenuLink;
}
getSchoolLunchMenu();

//get calendar link from git ignore file
function getCalendar() {
    var calendarLink = config.MY_EMAILLINK;
    document.getElementById('calendar-frame').src = calendarLink;
}
getCalendar();


//create the shopping list module in angular
var myShoppingListApp = angular.module('myShoppingListApp', []);
//give focus to add item textbox on load
$("#textbox").focus();
//use scope in function to bind list data between js and html file - empty list to start
myShoppingListApp.controller('firstController', function($scope) {
    $scope.todo_lists = [];
    $scope.new_item = "";
    $scope.form_error = "";

    $scope.addItem = function() {
        if ($scope.new_item.length === 0) {
            $scope.form_error = true;
        } else {
            $scope.form_error = false;
            //add item to list
            $scope.todo_lists.push($scope.new_item);
            $scope.new_item = '';
            //Give focus to add new item textbox after submission
            $("#textbox").focus();
        }
    };

    //delete all items from the list
    $scope.deleteItem = function(i) {
        if (confirm("OK to delete ALL items?")) {
            $scope.todo_lists = [];
        }
    };
});
//capitalize first letter of word
myShoppingListApp.filter('capitalize', function() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    };
});

//Display drawing board for notes/pictures/etc...
function getDrawingBoard() {
    var myCanvas = document.getElementById("myCanvas");
    //create color variable to provide hard coded option to change color of drawing
    var curColor = "#806600";
    //Listen for click events on drawing board - change color appropriately
    // when the draw button is clicked
    $("#draw-button").click(function() {
        // change color
        curColor = "#806600";
    });
    $("#erase-button").click(function() {
        // change brush to background color for erase
        curColor = "#FFFFF0";
    });

    if (myCanvas) {
        var isDown = false;
        var ctx = myCanvas.getContext("2d");
        var canvasX, canvasY;
        ctx.lineWidth = 5;

        $(myCanvas)
            .mousedown(function(e) {
                isDown = true;
                ctx.beginPath();
                canvasX = e.pageX - myCanvas.offsetLeft;
                canvasY = e.pageY - myCanvas.offsetTop;
                ctx.moveTo(canvasX, canvasY);
            })
            .mousemove(function(e) {
                if (isDown !== false) {
                    canvasX = e.pageX - myCanvas.offsetLeft;
                    canvasY = e.pageY - myCanvas.offsetTop;
                    ctx.lineTo(canvasX, canvasY);
                    ctx.strokeStyle = curColor;
                    ctx.stroke();
                }
            })
            .mouseup(function(e) {
                isDown = false;
                ctx.closePath();
            });
    }
}

//function to clear drawing canvas when clear button clicked
function clearCanvas() {
    // refresh drawing board
    myCanvas.width = myCanvas.width;
    getDrawingBoard();
}
