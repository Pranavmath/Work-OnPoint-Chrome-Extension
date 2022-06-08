var background = chrome.extension.getBackgroundPage(); //do this in global scope for popup.js
var l = background.leaderboard();


document.getElementById("user1").innerHTML = l[0][0];
document.getElementById("coin1").innerHTML = l[0][1];

document.getElementById("user2").innerHTML = l[1][0];
document.getElementById("coin2").innerHTML = l[1][1];

document.getElementById("user3").innerHTML = l[2][0];
document.getElementById("coin3").innerHTML = l[2][1];
