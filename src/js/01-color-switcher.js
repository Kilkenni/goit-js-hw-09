function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

const btnStartElem = document.querySelector("button[data-start]");
const btnStopElem = document.querySelector("button[data-stop]");

btnStartElem.addEventListener("click", startBkgRainbow);

btnStopElem.addEventListener("click", stopBkgRainbow);

let bkgTimerID = 0;

function startBkgRainbow(event) {
    btnStartElem.disabled = true;
    //console.log("starting Rainbow Factory");   
    bkgTimerID = setInterval(recolorBkg, 1000);
}

function recolorBkg() {
    document.body.style.backgroundColor = getRandomHexColor();
}

function stopBkgRainbow(event) {
    try {
        clearInterval(bkgTimerID);
    }
    catch (error) {
        console.log(error);
    }
    btnStartElem.disabled = false;
}