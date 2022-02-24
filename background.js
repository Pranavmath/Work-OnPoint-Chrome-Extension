console.log('Chrome extension go!');
var begin = 0;
var continue_loop = true;

function statistics () {
    let data = {
        "week": [2, 3, 4, 5, 6, 8, 10],
        "coin": 9,
        "rank": ["Hi", "Yo", "Joe"]
    }
    return data;
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function fetchCosSimilarity(focus_topic, current_topic){
    var form = new FormData();
    form.append("text1", focus_topic);
    form.append("text2", current_topic);

    const response = await fetch("https://192.168.1.11:5000/similarity_texts", { method: "POST", body: form, mode: "no-cors" });

    response.ok;
    response.status;

    const cos_sim = await response.json();

    //console.log(cos_sim["cos_sim"]);

    return cos_sim["cos_sim"];
}

async function get_title(url){
    var form = new FormData();
    form.append("url", url);

    const response = await fetch("https://192.168.1.11:5000/get_title", { method: "POST", body: form, mode: "no-cors" });

    response.ok;
    response.status;

    const title = await response.json();

    //console.log(cos_sim["cos_sim"]);

    return title["title"];
}

function off_topic(focus_topic, current_topic, current_time){
    fetchCosSimilarity(focus_topic, current_topic).then(cos_sim => {
        //console.log(cos_sim);
        if (cos_sim < 0.54){
            if (current_time-begin > 0){
                //alert("You are off topic");
                alert("You are off topic" + cos_sim);
            }
        } else {
            begin = current_time;
        }
    });
}

function check(url, focus_topic, current_time) {
    /*
    get_title(url).then(title => {
        var current_topic = title;
        off_topic(focus_topic, current_topic, current_time);
    });
    */
    chrome.idle.queryState(
      15,
      function(state) {
        if (state ==  "active") {
            chrome.tabs.executeScript({code: "var type_alert = 'alert';"}, function() {
                chrome.tabs.executeScript({file: '/content.js'});
            });
        } else {
            chrome.tabs.executeScript({code: "var type_alert = 'snooze';"}, function() {
                chrome.tabs.executeScript({file: '/content.js'});
            });
        }
      }
    );
}

chrome.runtime.onMessage.addListener(run); // listening for popup.js to message to start focus session

function run(message, sender, sendResponse) {
    focus_topic = message.txt;
    begin = Date.now();

    function repeat() {
        // I believe that currentWindow is better than lastFocusedWindow
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            let url = tabs[0].url;
            var current_time = Date.now();

            check(url, focus_topic, current_time);
        });

        sleep(5000).then(() => {
            if (continue_loop){
                repeat();
            }
        });
    }
    repeat();
}