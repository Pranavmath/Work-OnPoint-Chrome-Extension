var background = chrome.extension.getBackgroundPage(); //do this in global scope for script.js


// Initializes the current topic and on submit of the current topic button call the url function
document.getElementById("current_topic").innerText = background.cur;
document.getElementById("submit").addEventListener("click", url);


// When the radio is changed in changes the variable in the background
$('input:radio').on('change', function(e){
  var name = e.currentTarget.id;
  var value = e.currentTarget.value;
  background.grace_period = value;
});


// When it is called it updates the current_topic in index.html
// It also calls the run function to start the session in the background.js
function url(){
    background.continue_loop = true;
    var topic = document.getElementById("topic").value;
    background.cur = topic;
    document.getElementById("current_topic").innerText = topic;
    console.log(topic);
    let msg = {
        sending_focus_topic: true,
        txt: topic
    };

    chrome.runtime.sendMessage(msg);
}

// When the end button is clicked tell background.js to stop the session and update current_topic
document.getElementById("end").addEventListener("click", end);

function end(){
    background.cur = "";
    background.continue_loop = false;
}
