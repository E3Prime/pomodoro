const formatInputMinutes = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.value.length > 2) target.value = target.value.slice(0, 2);
  target.value = target.value.replace(/[^a-zA-Z0-9]/g, "");
};

const inputMinutesGlowup = (e: Event) => {
  if (!(e.target instanceof HTMLInputElement)) return;
  const target = e.target;
  target.parentElement?.classList.add("input-glow");
};

const increment = (minuteElem: HTMLInputElement) => {
  if (minuteElem.value === "") minuteElem.value = "0";
  let minuteVal = parseInt(minuteElem.value);
  ++minuteVal;

  switch (minuteElem.id) {
    case "pomodoroMinutes":
      if (minuteVal >= 99) minuteElem.value = "99";
      else minuteElem.value = minuteVal.toString();
      break;
    case "shortBreakMinutes":
      if (minuteVal >= 30 || minuteVal <= 15) minuteElem.value = "30";
      else minuteElem.value = minuteVal.toString();
      break;
    case "longBreakMinutes":
      if (minuteVal >= 60 || minuteVal <= 30) minuteElem.value = "60";
      else minuteElem.value = minuteVal.toString();
      break;
  }

  if (pomodoroMinutes.value !== "" && shortBreakMinutes.value !== "" && longBreakMinutes.value !== "") {
    pomodoroErrorState.dataset.state = "idle";
    shortBreakErrorState.dataset.state = "idle";
    longBreakErrorState.dataset.state = "idle";
  }
};

const decrement = (minuteElem: HTMLInputElement) => {
  if (minuteElem.value === "") minuteElem.value = "0";
  let minuteVal = parseInt(minuteElem.value);
  --minuteVal;

  switch (minuteElem.id) {
    case "pomodoroMinutes":
      if (minuteVal <= 0) minuteElem.value = "0";
      else minuteElem.value = minuteVal.toString();
      break;
    case "shortBreakMinutes":
      if (minuteVal <= 15 || minuteVal >= 30) minuteElem.value = "15";
      else minuteElem.value = minuteVal.toString();
      break;
    case "longBreakMinutes":
      if (minuteVal <= 30 || minuteVal >= 60) minuteElem.value = "30";
      else minuteElem.value = minuteVal.toString();
      break;
  }

  if (pomodoroMinutes.value !== "" && shortBreakMinutes.value !== "" && longBreakMinutes.value !== "") {
    pomodoroErrorState.dataset.state = "idle";
    shortBreakErrorState.dataset.state = "idle";
    longBreakErrorState.dataset.state = "idle";
  }
};

const minuteIncrementAndDecrement = (e: PointerEvent) => {
  if (!(e.target instanceof HTMLButtonElement)) return;
  const target = e.target;
  if (target.id === "pomodoroMinuteIncrement" || target.id === "pomodoroMinuteDecrement") target.id === "pomodoroMinuteIncrement" ? increment(pomodoroMinutes) : decrement(pomodoroMinutes);

  if (target.id === "shortBreakMinuteIncrement" || target.id === "shortBreakMinuteDecrement")
    target.id === "shortBreakMinuteIncrement" ? increment(shortBreakMinutes) : decrement(shortBreakMinutes);

  if (target.id === "longBreakMinuteIncrement" || target.id === "longBreakMinuteDecrement")
    target.id === "longBreakMinuteIncrement" ? increment(longBreakMinutes) : decrement(longBreakMinutes);
};

const initialGlide = () => {
  const activeTimeOption = timerOptions.querySelector('input[name="break-option"]:checked')?.parentElement as HTMLInputElement;
  glider.style.width = `${activeTimeOption.offsetWidth}px`;
  glider.style.left = `${activeTimeOption.offsetLeft}px`;
  circleBar.style.strokeDasharray = circumference.toString();
  circleBar.style.strokeDashoffset = "0";
};

const animateCircleBar = () => {
  const progress = secondsRemaining / totalTime;
  const offset = circumference * (1 - progress);
  circleBar.style.strokeDashoffset = offset.toString();
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const stopInterval = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

const timerOptions = document.getElementById("timerOptions") as HTMLElement;
const glider = timerOptions.querySelector("#glider") as HTMLElement;
const timerDisplay = document.getElementById("timerDisplay") as HTMLSpanElement;
const startTimerBtn = document.getElementById("startTimer") as HTMLButtonElement;
const pauseTimerBtn = startTimerBtn.nextElementSibling?.children[0] as HTMLButtonElement;
const restartTimerBtn = startTimerBtn.nextElementSibling?.children[1] as HTMLButtonElement;
const circleBar = document.getElementById("circleBar") as unknown as SVGCircleElement;
const openSettings = document.getElementById("openSettings") as HTMLButtonElement;
const closeSettings = document.getElementById("closeSettings") as HTMLButtonElement;
const settings = document.getElementById("settings") as HTMLFormElement;
const modal = settings.parentElement?.parentElement as HTMLElement;
const customTimes = settings.querySelector("#customTimes") as HTMLDivElement;
const [pomodoroMinutes, shortBreakMinutes, longBreakMinutes] = [...customTimes.querySelectorAll("input")];
const pomodoroErrorState = customTimes.children[0] as HTMLDivElement;
const shortBreakErrorState = customTimes.children[1] as HTMLDivElement;
const longBreakErrorState = customTimes.children[2] as HTMLDivElement;
const pomodoroErrorElem = pomodoroErrorState.firstElementChild as HTMLParagraphElement;
const shortBreakErrorElem = shortBreakErrorState.firstElementChild as HTMLParagraphElement;
const longBreakErrorElem = longBreakErrorState.firstElementChild as HTMLParagraphElement;
const [font1, font2, font3] = [...settings.querySelectorAll("#fontSelection input")] as HTMLInputElement[];
const [color1, color2, color3] = [...settings.querySelectorAll("#colorSelection input")] as HTMLInputElement[];
console.log(font1, color1);

const circleRadius = circleBar.r.baseVal.value;
const circumference = circleRadius * 2 * Math.PI;
let time = 7;
let totalTime = time * 60;
let secondsRemaining = time * 60;
let timerInterval: ReturnType<typeof setInterval> | null = null;

initialGlide();
timerOptions.addEventListener("change", setTimeOption);
startTimerBtn.addEventListener("click", startTimer);
pauseTimerBtn.addEventListener("click", pauseTimer);
restartTimerBtn.addEventListener("click", restartTimer);
openSettings.addEventListener("click", () => modal.classList.add("active"));
closeSettings.addEventListener("click", () => modal.classList.remove("active"));
customTimes.addEventListener("input", formatInputMinutes);
customTimes.addEventListener("focusin", inputMinutesGlowup);
customTimes.addEventListener("focusout", validateMinutes);
customTimes.addEventListener("click", minuteIncrementAndDecrement);
settings.addEventListener("submit", updateSettings);

function updateSettings(e: SubmitEvent) {
  e.preventDefault();
}

function setTimeOption(e: Event) {
  if (!(e.target instanceof HTMLInputElement)) return;
  stopInterval();
  pauseTimerBtn.disabled = true;
  pauseTimerBtn.setAttribute("hidden", "");
  restartTimerBtn.disabled = true;
  restartTimerBtn.setAttribute("hidden", "");
  startTimerBtn.disabled = false;
  startTimerBtn.removeAttribute("hidden");
  const target = e.target;
  glider.style.width = target.parentElement?.offsetWidth + "px";
  glider.style.left = target.parentElement?.offsetLeft + "px";
  circleBar.style.strokeDasharray = circumference.toString();
  circleBar.style.strokeDashoffset = "0";

  switch (target.id) {
    case "pomodoroBreak":
      time = 7;
      totalTime = time * 60;
      timerDisplay.textContent = time < 10 ? String(time).padStart(2, "0") + ":00" : String(time) + ":00";
      break;
    case "shortBreak":
      time = 15;
      totalTime = time * 60;
      timerDisplay.textContent = time < 10 ? String(time).padStart(2, "0") + ":00" : String(time) + ":00";
      break;
    case "longBreak":
      time = 30;
      totalTime = time * 60;
      timerDisplay.textContent = String(time) + ":00";
      break;
  }

  secondsRemaining = time * 60;
}

function startTimer() {
  stopInterval();
  startTimerBtn.disabled = true;
  startTimerBtn.setAttribute("hidden", "");
  pauseTimerBtn.removeAttribute("hidden");
  pauseTimerBtn.disabled = false;
  restartTimerBtn.removeAttribute("hidden");
  restartTimerBtn.disabled = false;

  if (secondsRemaining <= 0) secondsRemaining = time * 60;

  timerInterval = setInterval(() => {
    --secondsRemaining;
    if (secondsRemaining >= 0) {
      const formattedTime = formatTime(secondsRemaining);
      timerDisplay.textContent = formattedTime;
    } else stopInterval();
    animateCircleBar();
  }, 1000);
}

function pauseTimer() {
  stopInterval();
  pauseTimerBtn.disabled = true;
  pauseTimerBtn.setAttribute("hidden", "");
  restartTimerBtn.disabled = true;
  restartTimerBtn.setAttribute("hidden", "");
  startTimerBtn.disabled = false;
  startTimerBtn.removeAttribute("hidden");
}

function restartTimer() {
  stopInterval();
  secondsRemaining = time * 60;
  timerDisplay.textContent = time < 10 ? String(time).padStart(2, "0") + ":00" : String(time) + ":00";
  pauseTimerBtn.disabled = true;
  pauseTimerBtn.setAttribute("hidden", "");
  restartTimerBtn.disabled = true;
  restartTimerBtn.setAttribute("hidden", "");
  startTimerBtn.disabled = false;
  startTimerBtn.removeAttribute("hidden");
  circleBar.style.strokeDasharray = circumference.toString();
  circleBar.style.strokeDashoffset = "0";
}

function validateMinutes(e: FocusEvent) {
  if (!(e.target instanceof HTMLInputElement)) return;
  const target = e.target as HTMLInputElement;
  target.parentElement?.classList.remove("input-glow");

  if (target.id === pomodoroMinutes.id) {
    const pomodoroValue = Number(pomodoroMinutes.value);
    if (pomodoroMinutes.value === "") {
      pomodoroErrorState.dataset.state = "error";
      pomodoroErrorElem.textContent = "You must enter a value!";
    } else if (pomodoroValue === 0) {
      pomodoroErrorState.dataset.state = "error";
      pomodoroErrorElem.textContent = "Value cannot be zero!";
    } else pomodoroErrorState.dataset.state = "idle";
  } else if (target.id === shortBreakMinutes.id) {
    const shortBreakValue = Number(shortBreakMinutes.value);
    if (shortBreakMinutes.value === "") {
      shortBreakErrorState.dataset.state = "error";
      shortBreakErrorElem.textContent = "You must enter a value!";
    } else if (shortBreakValue === 0) {
      shortBreakErrorState.dataset.state = "error";
      shortBreakErrorElem.textContent = "Value cannot be zero!";
    } else if (!(shortBreakValue >= 15 && shortBreakValue <= 30)) {
      shortBreakErrorState.dataset.state = "error";
      shortBreakErrorElem.textContent = "Value must be between 15 & 30!";
    } else shortBreakErrorState.dataset.state = "idle";
  } else if (target.id === longBreakMinutes.id) {
    const longBreakValue = Number(longBreakMinutes.value);
    if (longBreakMinutes.value === "") {
      longBreakErrorState.dataset.state = "error";
      longBreakErrorElem.textContent = "You must enter a value!";
    } else if (longBreakValue === 0) {
      longBreakErrorState.dataset.state = "error";
      longBreakErrorElem.textContent = "Value cannot be zero!";
    } else if (!(longBreakValue >= 30 && longBreakValue <= 60)) {
      longBreakErrorState.dataset.state = "error";
      longBreakErrorElem.textContent = "Value must be between 30 & 60!";
    } else longBreakErrorState.dataset.state = "idle";
  }
}
