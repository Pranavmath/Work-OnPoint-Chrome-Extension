document.getElementById("submit").addEventListener("click", url);

function url(){
    var x = document.getElementById("url").value;
    console.log(x);
    let msg = {
        txt: x
    };
    chrome.runtime.sendMessage(msg);
}