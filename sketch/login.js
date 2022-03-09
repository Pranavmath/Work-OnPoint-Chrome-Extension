var background = chrome.extension.getBackgroundPage(); //do this in global scope for popup.js
const form  = document.getElementById('login');

form.addEventListener('submit', (event) => {
    alert("hello");
});