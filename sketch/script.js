document.getElementById("submit").addEventListener("click", url);
var background = chrome.extension.getBackgroundPage(); //do this in global scope for popup.js

function url(){
    var x = document.getElementById("url").value;
    console.log(x);
    let msg = {
        txt: x
    };
    chrome.runtime.sendMessage(msg);
    document.getElementById("end").addEventListener("click", end);
}

function end(){
    background.continue_loop = false;
}
