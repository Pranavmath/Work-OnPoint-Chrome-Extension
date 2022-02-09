document.getElementById("submit").addEventListener("click", url);

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
    let msg = {
        txt: "end focus session"
    };
    chrome.runtime.sendMessage(msg);
    alert("end ran");
}
