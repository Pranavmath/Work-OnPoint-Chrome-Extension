var background = chrome.extension.getBackgroundPage(); //do this in global scope for popup.js

background.statistics(); // initial data that will get updated when refreshed
var coin = background.coin; // initial data that will get updated when refreshed
var week = background.week_time; // initial data that will get updated when refreshed

var barColors = ["red", "green","blue","orange","brown"];


document.getElementById("coin").innerHTML = coin;

new Chart("graph", {
  type: "bar",
  data: {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    datasets: [{
      backgroundColor: barColors,
      data: week
    }]
  },
  options: {
    legend: {display: false},
    title: {
      display: true,
      text: "Focus Time from last few weeks"
    }
  }
});



document.getElementById("refresh").addEventListener("click", refresh);

function refresh() {
	background.statistics();
	coin = background.coin; // initial data that will get updated when refreshed
    week = background.week_time; // initial data that will get updated when refreshed

	document.getElementById("coin").innerHTML = coin;
	new Chart("graph", {
      type: "bar",
      data: {
        labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        datasets: [{
          backgroundColor: barColors,
          data: week
        }]
      },
      options: {
        legend: {display: false},
        title: {
          display: true,
          text: "Focus Time from last few weeks"
        }
      }
    });
}