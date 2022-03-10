var background = chrome.extension.getBackgroundPage(); //do this in global scope for popup.js

document.getElementById("submit").addEventListener("click", url);

$('input:radio').on('change', function(e){
  var name = e.currentTarget.id;
  var value = e.currentTarget.value;
  background.grace_period = value;
});

/* Remmeber and keep current selected radio
<input type=radio id=blah1 value=blah1 name=blah checked />
<input type=radio id=blah2 value=blah2 name=blah />
<input type=radio id=blah3 value=blah3 name=blah />

$(function () {

    $('input[type="radio"]').click(function () {
        localStorage.setItem('radioIdSelected', $(this).attr('id'));
    });

    var storageRadio = localStorage.getItem('radioIdSelected');

    if (storageRadio !== null && storageRadio !== undefined && $('#' + storageRadio).length) {
        $('#' + storageRadio).trigger('click');
    } else {
        $('input[type="radio"]:first').trigger('click');
    }

});

*/


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
