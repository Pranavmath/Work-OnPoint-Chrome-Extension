var background = chrome.extension.getBackgroundPage(); //do this in global scope for popup.js

document.getElementById("submit").addEventListener("click", url);

$('input:radio').on('change', function(e){
  var name = e.currentTarget.id;
  var value = e.currentTarget.value;
  background.grace_period = value;
});

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
