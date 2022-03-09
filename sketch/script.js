var background = chrome.extension.getBackgroundPage(); //do this in global scope for popup.js

document.getElementById("submit").addEventListener("click", url);

if (background.login == true) {
    document.getElementById("next").href = "leaderboard.html";
} else {
    document.getElementById("next").href = "index.html";
}

function url(){
    background.continue_loop = true;
    var x = document.getElementById("url").value;
    console.log(x);
    let msg = {
        txt: x
    };
    chrome.runtime.sendMessage(msg);
}

document.getElementById("end").addEventListener("click", end);

function end(){
    background.continue_loop = false;
}

document.getElementById("next").addEventListener("click", a);

function a() {
  if (background.login == true) {
  } else {
    alert("asds");
  }
}