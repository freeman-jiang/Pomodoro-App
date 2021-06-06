// Credit: Mateusz Rybczonec for the timer visuals

const userTimeLimit = document.getElementById('timeLimit') 
const userBreakLimit = document.getElementById('breakLimit')
const saveButton = document.getElementById('saveButton') 
const startButton = document.getElementById('startButton')
const breakButton = document.getElementById('breakButton')
const ping = new Audio('./sounds/ping.mp3');
const unsavedWarning = document.getElementById('unsavedWarning')
unsavedWarning.style.display = "none"

userTimeLimit.addEventListener("input", () => {
  unsavedWarning.style.display = "block"
});

userBreakLimit.addEventListener("input", () => {
  unsavedWarning.style.display = "block"
});




const saveInfo = () => {
  if (userTimeLimit.value >= 0.05 && userBreakLimit.value >= 0.05) {
      window.timeLimit = userTimeLimit.value * 60;
      window.breakLimit = userBreakLimit.value * 60;
      timeLeft = window.timeLimit;
      document.getElementById("timer").innerHTML = `
    <div class="base-timer">
      <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
          <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
          <path
            id="base-timer-path-remaining"
            stroke-dasharray="283"
            class="base-timer__path-remaining ${remainingPathColor}"
            d="
              M 50, 50
              m -45, 0
              a 45,45 0 1,0 90,0
              a 45,45 0 1,0 -90,0
            "
          ></path>
        </g>
      </svg>
      <span id="base-timer-label" class="base-timer__label">${formatTime(
        timeLeft
      )}</span>
    </div>
    `;
    unsavedWarning.style.display = "none"
  }

  else {
    alert("Please enter a time greater than 0.05 minutes.")
  }

  

}

const resetTimer = () => {
  saveButton.disabled = false;
  startButton.disabled = false;
  breakButton.disabled = false;
  timeLeft = window.timeLimit;
  timePassed = 0;
  document.getElementById("timer").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;
  clearInterval(timerInterval)
  ping.pause()
  ping.currentTime = 0;
}

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;
const breakColor = {
  color: "white"
}
const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  },
  breakTime: {
    color: "blue"
  }

};

window.timeLimit = 25*60;
window.breakLimit = 5*60;
// const timeLimit = 20;
let timePassed = 0;
let timeLeft = window.timeLimit;
let timeLeftBreak = window.timeBreak;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

document.getElementById("timer").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;


// startTimer();

function onTimesUp() {
  clearInterval(timerInterval);
  ping.play();
}

function startTimer() {
  saveButton.disabled = true;
  startButton.disabled = true;
  breakButton.disabled = true;
  ping.currentTime = 0;
  timerInterval = setInterval(() => {
    timePassed += 1;
    timeLeft = window.timeLimit - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / window.timeLimit;
  return rawTimeFraction - (1 / window.timeLimit) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

const startBreakTimer = () => {
  saveButton.disabled = true;
  startButton.disabled = true;
  breakButton.disabled = true;
  ping.currentTime = 0;
  timerInterval = setInterval(() => {
    timePassed += 1;
    timeLeftBreak = window.breakLimit - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeftBreak
    );
    
    // setRemainingPathColor(timeLeftBreak);
    setColorBreak()

    if (timeLeftBreak === 0) {
      onTimesUp();
    }
  }, 1000);
}



function setColorBreak() {
  const { alert, warning, info, breakTime } = COLOR_CODES;
  document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
  document
      .getElementById("base-timer-path-remaining")
      .classList.add(breakTime.color)
}