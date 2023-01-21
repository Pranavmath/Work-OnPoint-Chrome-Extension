var background = chrome.extension.getBackgroundPage(); //do this in global scope for statistics.js
var coin = background.coin; // initial data that will get updated when refreshed
var week = background.week_time; // initial data that will get updated when refreshed

background.statistics(); // initial data that will get updated when refreshed
week = background.week_time; // initial data that will get updated when refreshed

var barColors = ["red", "green", "blue", "orange", "brown", "purple", "yellow"];


document.getElementById("coin").innerHTML = coin;

// Makes the graph on initialization
new Chart("graph", {
  type: "bar",
  data: {
    labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    datasets: [{
      label: "Total Time",
      backgroundColor: barColors,
      data: week[0]
    }, {
      label: "Total Focus Time",
      backgroundColor: barColors,
      data: week[1]
    }]
  },
  options: {
    legend: {display: false},
    title: {
      display: true,
      text: "Focus Time from last few days (in minutes)"
    }
  }
});



document.getElementById("refresh").addEventListener("click", refresh);

// Refreshes the statistics and updates the chart
function refresh() {
	background.statistics();
	coin = background.coin; // initial data that will get updated when refreshed
    week = background.week_time; // initial data that will get updated when refreshed

	document.getElementById("coin").innerHTML = coin;
	new Chart("graph", {
      type: "bar",
      data: {
        labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        datasets: [{
          label: "Total Time",
          backgroundColor: barColors,
          data: week[0]
        }, {
          label: "Total Focus Time",
          backgroundColor: barColors,
          data: week[1]
        }]
      },
      options: {
        legend: {display: false},
        title: {
          display: true,
          text: "Focus Time from last few days (in minutes)"
        }
      }
    });
}