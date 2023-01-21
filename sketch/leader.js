var background = chrome.extension.getBackgroundPage(); //do this in global scope for leader.js
var l = [];

// Gets the leaderboard and updates the leaderboard html
background.leaderboard();
l = background.current_leaderboard;

console.log(l);

document.getElementById("user1").innerHTML = l[0][0];
document.getElementById("coin1").innerHTML = l[0][1];

document.getElementById("user2").innerHTML = l[1][0];
document.getElementById("coin2").innerHTML = l[1][1];

document.getElementById("user3").innerHTML = l[2][0];
document.getElementById("coin3").innerHTML = l[2][1];
