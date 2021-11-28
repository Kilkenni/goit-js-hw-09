import flatpickr from "flatpickr"; //lib for a date picking interface
import "flatpickr/dist/flatpickr.min.css"; //CSS for it
//require("flatpickr/dist/themes/dark.css"); //hiss!
import Notiflix from 'notiflix'; //instead of window.alert

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day); // Remaining days
  const hours = Math.floor((ms % day) / hour);// Remaining hours
  const minutes = Math.floor(((ms % day) % hour) / minute);// Remaining minutes
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);// Remaining seconds

  return { days, hours, minutes, seconds };
}


const timerElem = document.querySelector(".timer");
const btnStartElem = document.querySelector("button[data-start]");
const inputDateElem = document.querySelector(`input[id="datetime-picker"]`);
let selectedDate;
let intervalCountdownID;

btnStartElem.disabled = true;
const datePickerOptions = {
  enableTime: true, //enable choosing time in a picker
  time_24hr: true, //discard AM/PM and use 24hr format like a Chad
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
      validateDate(selectedDates[0]);
  },
};

function validateDate(someDate) {
    //console.log(selectedDates[0]);
    const currentDate = new Date();

    if (someDate <= currentDate) {
        btnStartElem.disabled = true;
        selectedDate = undefined; //reset selected
        //window.alert("Please choose a date in the future");
        Notiflix.Notify.failure("Please choose a date in the future");
        return; //early exit if the date is invalid
    }

    selectedDate = someDate;
    btnStartElem.disabled = false; //otherwise ready to go sir
    return;
}

const datePicker = flatpickr(inputDateElem, datePickerOptions);

btnStartElem.addEventListener("click", startCountdown);

function addLeadingZero(value) {
    return value.toString().padStart(2, "0");
}

function updateTimer(newDateTime) {
    if (selectedDate === undefined) {
        clearInterval(intervalCountdownID);
        return;
    } //stop refreshing and early exit if the date is incorrect
    const remainingTime = convertMs(newDateTime - new Date());

    const timeIsUp = Object.values(remainingTime).reduce((totalValue, timePart) => {
        return totalValue + timePart;
    }, 0); //counts sum of all time parts in remainingTime
    if (timeIsUp <= 0) {
        clearInterval(intervalCountdownID); //stop the refreshing
        if (timeIsUp < 0) {
            return; //if negative, exit before timer update
        }
    }

    for (const timePart of Object.keys(remainingTime)) {
        timerElem.querySelector(`span[data-${timePart}]`).textContent = addLeadingZero(remainingTime[timePart]);
    } //timer update
}

function startCountdown(event) {
    validateDate(selectedDate); //check the date before launching - it may have gone invalid before we even started
    intervalCountdownID = setInterval(() => {updateTimer(selectedDate)}, 1000);
    //updateTimer(selectedDate);
}