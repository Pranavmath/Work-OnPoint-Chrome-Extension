var background = chrome.extension.getBackgroundPage(); //do this in global scope for popup.js
var data = background.statistics(); // initial data that will get updated when refreshed
var barColors = ["red", "green","blue","orange","brown"];


document.getElementById("coin").innerHTML = data["coin"];

new Chart("graph", {
  type: "bar",
  data: {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    datasets: [{
      backgroundColor: barColors,
      data: data["week"]
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
	data = background.statistics();
	document.getElementById("coin").innerHTML = data["coin"];

}