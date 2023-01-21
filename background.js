console.log('Chrome extension go!');
var begin = 0;
var continue_loop = true;
var coin = 0;
var week_time = 0;
var total_time = 0;
var focus_time = 0;
var grace_period = 5;
var cur = "";
var current_leaderboard = [];

// Initializes the current_leaderboard array by running this in the beginning of the program
chrome.storage.sync.get('name_and_id', function(items) {
    var name_id = items.name_and_id;
    if (name_id){
        var id = name_id[0];
        var name = name_id[1];
        get_leaderboard(id, name).then(id_and_leaderboard => {
            current_leaderboard = id_and_leaderboard[1];
        });
    }
});

statistics();


// This uses the backend REST API to get the leaderboard
async function get_leaderboard(id, name) {
    var form = new FormData();
    form.append("user_id", id);
    form.append("name", name);
    form.append("coins", coin);

    const response = await fetch("https://192.168.1.9:5000/leaderboard", { method: "POST", body: form, mode: "no-cors" });

    const leaderboard_and_id = await response.json();

    return [leaderboard_and_id["userid"], leaderboard_and_id["leaderboard"]];
}

// This returns the leaderboard of users that use the Chrome extension using the get_leaderboard function
// If the name and id is already stored then get it and get the leaderboard
// If not get the user's name from an alert and then store it and return the leaderboard
function leaderboard() {
    chrome.storage.sync.get('name_and_id', function(items) {
        var name_id = items.name_and_id;
        if (name_id){
            var id = name_id[0];
            var name = name_id[1];
            get_leaderboard(id, name).then(id_and_leaderboard => {
                current_leaderboard = id_and_leaderboard[1];
            });
        } else {
            chrome.tabs.executeScript({code: "var type_alert = 'user';"}, function() {
                chrome.tabs.executeScript({file: '/injectalert.js'});
                chrome.runtime.onMessage.addListener(
                    function(request, sender, sendResponse) {
                        var name = request.name;
                        get_leaderboard("None", name).then(id_and_leaderboard => {
                            chrome.storage.sync.set({name_and_id: [id_and_leaderboard[0], name]}, function() {
                                current_leaderboard = id_and_leaderboard[1];
                            });
                        });
                    }
                );
            });
        }
    });
}

// This updates the current statistics which is array: w[0]: total time array and w[1]: focus time array
// It then stores it using chrome storage
function statistics () {
    var curr = new Date; // get current date

    chrome.storage.sync.get('week', function(items) {
        var w = items.week;
        if (w) {
            if (total_time == 0) {
                total_time = w[0][curr.getDay()];
            }

            if (focus_time == 0) {
                focus_time = w[1][curr.getDay()];
            }

            if (curr.getDay() == 0) {
                w[0] = [Math.floor(total_time/10), 0, 0, 0, 0, 0, 0]
                w[1] = [Math.floor(focus_time/10), 0, 0, 0, 0, 0, 0]
            } else {
                w[0][curr.getDay()] = Math.floor(total_time/10);
                w[1][curr.getDay()] = Math.floor(focus_time/10);
            }

            chrome.storage.sync.set({week: w}, function() {
                week_time = w;
            });
        } else {
            var clean_week = [42, 12, 24, 10, 21, 44, 0];
            chrome.storage.sync.set({week: [clean_week, [30, 5, 19, 8, 11, 34, 0]]}, function() {
                week_time = [clean_week, [30, 5, 19, 8, 11, 34, 0]];
            });
        }
    });
}

// This function sleeps for a certain amount of milliseconds
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// This function gets the cossine similarity between 2 topics by calling the backend api
async function fetchCosSimilarity(focus_topic, current_topic){
    var form = new FormData();
    form.append("text1", focus_topic);
    form.append("text2", current_topic);

    const response = await fetch("https://192.168.1.9:5000/similarity_texts", { method: "POST", body: form, mode: "no-cors" });

    response.ok;
    response.status;

    const cos_sim = await response.json();

    //console.log(cos_sim["cos_sim"]);

    return cos_sim["cos_sim"];
}

// This function returns the title of a webpage given the url
async function get_title(url){
    var form = new FormData();
    form.append("url", url);

    const response = await fetch("https://192.168.1.9:5000/get_title", { method: "POST", body: form, mode: "no-cors" });

    response.ok;
    response.status;

    const title = await response.json();

    //console.log(cos_sim["cos_sim"]);

    return title["title"];
}


// The off_topic function gets the cosine similarity from the fetchCosSimilarity function
// Then using the cosine similarity and current time it will alert the user in a specific way
function off_topic(focus_topic, current_topic, current_time){
    fetchCosSimilarity(focus_topic, current_topic).then(cos_sim => {
        chrome.idle.queryState(
            15,
            function(state) {
                if (state ==  "active") {
                    total_time += 5;
                    if (cos_sim < 0.54){
                        if (current_time-begin > grace_period * 1000) {
                            if (total_time > 0 && total_time < 147.688 && (total_time % 2 == 0) ) {
                                chrome.tabs.executeScript({code: "var type_alert = 'begin';"}, function() {
                                    chrome.tabs.executeScript({file: '/injectalert.js'});
                                });
                            }
                            else if (total_time > 147.688 && total_time <  1693.762 && total_time % 3 == 0) {
                                chrome.tabs.executeScript({code: "var type_alert = 'middle';"}, function() {
                                    chrome.tabs.executeScript({file: '/injectalert.js'});
                                });
                            }
                            else {
                                chrome.tabs.executeScript({code: "var type_alert = 'alert';"}, function() {
                                    chrome.tabs.executeScript({file: '/injectalert.js'});
                                });
                            }
                        }
                    } else {
                        focus_time += 5;
                        coin += 1;
                        begin = current_time;
                    }
                } else {
                    chrome.tabs.executeScript({code: "var type_alert = 'snooze';"}, function() {
                        chrome.tabs.executeScript({file: '/injectalert.js'});
                    });
                }
            }
        );
    });
}

// The check function gets the current topic from the get_title function using the url
// It then passes the focus topic, current topic and current time to the off_topic function
function check(url, focus_topic, current_time) {
    get_title(url).then(title => {
        var current_topic = title;
        off_topic(focus_topic, current_topic, current_time);
    });
}

// The run function is called when the script.js sends a message to start the session
chrome.runtime.onMessage.addListener(run); // listening for popup.js to message to start focus session

// Gets focus topic and calls and sends the focus topic, current time, and url to check funciton
// This is then repeated every 5000 milliseconds
function run(message, sender, sendResponse) {
    if (message.sending_focus_topic == true) {
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
                if (continue_loop) {
                    repeat();
                }
            });
        }

        repeat();
    }
}