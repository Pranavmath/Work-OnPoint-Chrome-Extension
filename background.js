console.log('Chrome extension go!');
var begin = 0;
var continue_loop = true;
var coin = 0;
var week_time = 0;
var total_time = 0;
var focus_time = 0;
var grace_period = 5;
var cur = "";



/*
chrome.storage.sync.get('userid', function(items) {
        var userid = items.week;
        if (userid) {
        } else {
            var form = new FormData();
            form.append("userid", "None");
            form.append("name", current_topic);
            form.append("coins", 0);
            const user = await fetch("https://192.168.1.18:5000/leaderboard", { method: "POST", body: form, mode: "no-cors" });
            user = user.json;


            chrome.storage.sync.set({week: w}, function() {
            }
        }
}
*/

statistics();


/*
    chrome.storage.sync.get('week', function(items) {
        var week = items.week;
        if (week) {
            let data = {
                "week": [0, 0, 0, 0, 0, 0 ,0],
                "coin": coin,
            }
            data["week"][curr.getDay()] = time;
            return data;
        } else {
            var sus = [0, 0, 0, 0, 0, 0 ,0];
            chrome.storage.sync.set({week: sus}, function() {
                let data = {
                    "week": [0, 0, 0, 0, 0, 0 ,0],
                    "coin": coin,
                }
                data["week"][curr.getDay()] = time;
                return data;
            });
        }
    });
*/

/*
    var curr = new Date; // get current date

    let data = {
        "week": [0, 0, 0, 0, 0, 0, 0],
        "coin": coin,
    }
    data["week"][curr.getDay()] = time;
    return data;
*/

async function get_leaderboard(id, name) {
    var form = new FormData();
    form.append("user_id", id);
    form.append("name", name);
    form.append("coins", coin);

    const response = await fetch("https://192.168.1.18:5000/leaderboard", { method: "POST", body: form, mode: "no-cors" });

    const leaderboard_id = await response.json();

    return [leaderboard_id["userid"], leaderboard_id["leaderboard"]];
}

function leaderboard() {
    chrome.storage.sync.get('idname', function(items) {
        var name_id = items.idname;
        if (name_id){
            var id = name_id[0];
            var name = name_id[1];
            get_leaderboard(id, name).then(li => {
                return li[1]
            });
        } else {
            chrome.tabs.executeScript({code: "var type_alert = 'user';"}, function() {
                chrome.tabs.executeScript({file: '/content.js'});
                chrome.runtime.onMessage.addListener(
                    function(request, sender, sendResponse) {
                        var name = request.name;
                        get_leaderboard("None", name).then(li => {
                            alert(li[1]);
                            chrome.storage.sync.set({idname: [li[0], name]}, function() {
                                return li[1]
                            });
                        });
                    }
                );
            });
        }
    });
}

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
                w[0] = [Math.floor(total_time/60), 0, 0, 0, 0, 0, 0]
                w[1] = [Math.floor(focus_time/60), 0, 0, 0, 0, 0, 0]
            } else {
                w[0][curr.getDay()] = Math.floor(total_time/10);
                w[1][curr.getDay()] = Math.floor(focus_time/10);
            }

            chrome.storage.sync.set({week: w}, function() {
                week_time = w;
            });
        } else {
            var clean_week = [12, 0, 24, 10, 0, 0, 0];
            chrome.storage.sync.set({week: [clean_week, [10, 0, 19, 8, 0, 0, 0]]}, function() {
                week_time = [clean_week, [10, 0, 19, 8, 0, 0, 0]];
            });
        }
    });
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function fetchCosSimilarity(focus_topic, current_topic){
    var form = new FormData();
    form.append("text1", focus_topic);
    form.append("text2", current_topic);

    const response = await fetch("https://192.168.1.18:5000/similarity_texts", { method: "POST", body: form, mode: "no-cors" });

    response.ok;
    response.status;

    const cos_sim = await response.json();

    //console.log(cos_sim["cos_sim"]);

    return cos_sim["cos_sim"];
}

async function get_title(url){
    var form = new FormData();
    form.append("url", url);

    const response = await fetch("https://192.168.1.18:5000/get_title", { method: "POST", body: form, mode: "no-cors" });

    response.ok;
    response.status;

    const title = await response.json();

    //console.log(cos_sim["cos_sim"]);

    return title["title"];
}

/*
function off_topic(focus_topic, current_topic, current_time){
    fetchCosSimilarity(focus_topic, current_topic).then(cos_sim => {
        //console.log(cos_sim);
        if (cos_sim < 0.54){
            if (current_time-begin > grace_period * 1000){
                //alert("You are off topic");
                if (time > 2 * 60 && time <  40 * 60) {
                    alert("Starting to study might be tough but you got this");
                } else {
                    alert("You are off topic" + cos_sim);
                }
            }
        } else {
            begin = current_time;
        }
    });
}
*/

// Run this code when REST API is on

function off_topic(focus_topic, current_topic, current_time){
    fetchCosSimilarity(focus_topic, current_topic).then(cos_sim => {
        chrome.idle.queryState(
            15,
            function(state) {
                if (state ==  "active") {
                    total_time += 5;
                    if (cos_sim < 0.54){
                        if (current_time-begin > grace_period * 1000){
                            if (total_time > 0 && total_time < 147.688 && (total_time % 2 == 0) ) {
                                chrome.tabs.executeScript({code: "var type_alert = 'begin';"}, function() {
                                    chrome.tabs.executeScript({file: '/content.js'});
                                });
                            }
                            else if (total_time > 147.688 && total_time <  1693.762 && total_time % 3 == 0) {
                                chrome.tabs.executeScript({code: "var type_alert = 'middle';"}, function() {
                                    chrome.tabs.executeScript({file: '/content.js'});
                                });
                            }
                            else {
                                chrome.tabs.executeScript({code: "var type_alert = 'alert';"}, function() {
                                    chrome.tabs.executeScript({file: '/content.js'});
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
                        chrome.tabs.executeScript({file: '/content.js'});
                    });
                }
            }
        );
    });
}

function check(url, focus_topic, current_time) {
    get_title(url).then(title => {
        var current_topic = title;
        off_topic(focus_topic, current_topic, current_time);
    });
    /*
    chrome.idle.queryState(
      15,
      function(state) {
        if (state ==  "active") {
            coin += 1;
            time += 5;
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
    */
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