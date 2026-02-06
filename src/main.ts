import {Particle} from "./Particle.ts";
import audioPath from "./assets/times_up.mp3";

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

const setInitialMinuteFontColor = () => {
  mainElem.dataset.fontState = "font1";
  mainElem.dataset.timeColorState = "color1";
  shortBreakMinutes.value = "15";
  longBreakMinutes.value = "30";
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

const playTimerAudio = () => {
  try {
    if (audio) audio.play();
  } catch (e) {
    console.error("There was an issue in playing the audio", e);
  }
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// DOM Variables
const mainElem = document.querySelector("main") as HTMLElement;
const canvas = mainElem.firstElementChild as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const timerOptions = document.getElementById("timerOptions") as HTMLElement;
const [pomodoroBreak, shortBreak, longBreak] = [...timerOptions.querySelectorAll("input")] as HTMLInputElement[];
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
const [font1, font2] = [...settings.querySelectorAll("#fontSelection input")] as HTMLInputElement[];
const [color1, color2] = [...settings.querySelectorAll("#colorSelection input")] as HTMLInputElement[];

// ANCHOR Script Variables
const circleRadius = circleBar.r.baseVal.value;
const circumference = circleRadius * 2 * Math.PI;
let pomodoroTime = 7;
let shortBreakTime = 15;
let longBreakTime = 30;
let totalTime = pomodoroTime * 60;
let secondsRemaining = pomodoroTime * 60;
let timerInterval: ReturnType<typeof setInterval> | null = null;
let eventsEnabled = true;
const audio = new Audio(audioPath);
const canvasState = {width: 0, height: 0};
const particles = Array.from({length: 70}, () => new Particle(canvasState));
const resizeObserver = new ResizeObserver((entries) => canvasResize(entries));
resizeObserver.observe(canvas);

// ANCHOR Running Events
setInitialMinuteFontColor();
initialGlide();
animate();
timerOptions.addEventListener("change", setTimeOption);
startTimerBtn.addEventListener("click", startTimer);
pauseTimerBtn.addEventListener("click", pauseTimer);
restartTimerBtn.addEventListener("click", restartTimer);
openSettings.addEventListener("click", () => {
  if (!eventsEnabled) return;
  modal.classList.add("active");
});
closeSettings.addEventListener("click", () => modal.classList.remove("active"));
customTimes.addEventListener("input", formatInputMinutes);
customTimes.addEventListener("focusin", inputMinutesGlowup);
customTimes.addEventListener("focusout", validateMinutes);
customTimes.addEventListener("click", minuteIncrementAndDecrement);
settings.addEventListener("submit", updateSettings);

function updateSettings(e: SubmitEvent) {
  e.preventDefault();
  if (pomodoroMinutes.value === "") {
    pomodoroErrorState.dataset.state = "error";
    return;
  }
  if (pomodoroErrorState.dataset.state !== "idle" || shortBreakErrorState.dataset.state !== "idle" || longBreakErrorState.dataset.state !== "idle") return;

  pomodoroTime = parseInt(pomodoroMinutes.value);
  shortBreakTime = parseInt(shortBreakMinutes.value);
  longBreakTime = parseInt(longBreakMinutes.value);
  const currentTime = pomodoroBreak.checked ? pomodoroTime : shortBreak.checked ? shortBreakTime : longBreakTime;
  timerDisplay.textContent = currentTime < 10 ? String(currentTime).padStart(2, "0") + ":00" : String(currentTime) + ":00";
  totalTime = currentTime * 60;
  secondsRemaining = currentTime * 60;
  restartTimer();

  if (font1.checked) mainElem.dataset.fontState = "font1";
  else if (font2.checked) mainElem.dataset.fontState = "font2";
  else mainElem.dataset.fontState = "font3";

  if (color1.checked) mainElem.dataset.timeColorState = "color1";
  else if (color2.checked) mainElem.dataset.timeColorState = "color2";
  else mainElem.dataset.timeColorState = "color3";

  modal.classList.remove("active");
}

function setTimeOption(e: Event) {
  if (!eventsEnabled) return;
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
      const time1 = pomodoroTime;
      totalTime = pomodoroTime * 60;
      timerDisplay.textContent = time1 < 10 ? String(time1).padStart(2, "0") + ":00" : String(time1) + ":00";
      break;
    case "shortBreak":
      const time2 = shortBreakTime;
      totalTime = shortBreakTime * 60;
      timerDisplay.textContent = time2 < 10 ? String(time2).padStart(2, "0") + ":00" : String(time2) + ":00";
      break;
    case "longBreak":
      const time3 = longBreakTime;
      totalTime = longBreakTime * 60;
      timerDisplay.textContent = String(time3) + ":00";
      break;
  }

  if (pomodoroBreak.checked) {
    totalTime = pomodoroTime * 60;
    secondsRemaining = pomodoroTime * 60;
  } else if (shortBreak.checked) {
    totalTime = shortBreakTime * 60;
    secondsRemaining = shortBreakTime * 60;
  } else if (longBreak.checked) {
    totalTime = longBreakTime * 60;
    secondsRemaining = longBreakTime * 60;
  }
}

async function startTimer() {
  stopInterval();
  const currentTime = pomodoroBreak.checked ? pomodoroTime : shortBreak.checked ? shortBreakTime : longBreakTime;
  startTimerBtn.disabled = true;
  startTimerBtn.setAttribute("hidden", "");
  pauseTimerBtn.removeAttribute("hidden");
  pauseTimerBtn.disabled = false;
  restartTimerBtn.removeAttribute("hidden");
  restartTimerBtn.disabled = false;

  timerInterval = setInterval(() => {
    --secondsRemaining;
    if (secondsRemaining >= 0) {
      const formattedTime = formatTime(secondsRemaining);
      timerDisplay.textContent = formattedTime;
      animateCircleBar();
    } else {
      stopInterval();
      timesUp(currentTime);
    }
  }, 1000);
}

async function timesUp(currentTime: number) {
  eventsEnabled = !eventsEnabled;
  pauseTimerBtn.disabled = true;
  pauseTimerBtn.setAttribute("hidden", "");
  restartTimerBtn.disabled = true;
  restartTimerBtn.setAttribute("hidden", "");
  playTimerAudio();
  timerDisplay.classList.add("scale-time");
  timerDisplay.classList.add("end-time");
  await sleep(550);
  timerDisplay.classList.remove("end-time");
  await sleep(550);
  timerDisplay.classList.add("end-time");
  await sleep(550);
  timerDisplay.classList.remove("end-time");
  await sleep(550);
  timerDisplay.classList.add("end-time");
  await sleep(550);
  timerDisplay.classList.remove("end-time");
  playTimerAudio();
  timerDisplay.classList.add("end-time");
  await sleep(550);
  timerDisplay.classList.remove("end-time");
  await sleep(550);
  timerDisplay.classList.add("end-time");
  await sleep(550);
  timerDisplay.classList.remove("scale-time");
  timerDisplay.classList.remove("end-time");
  await sleep(550);
  timerDisplay.classList.add("end-time");
  await sleep(550);
  timerDisplay.classList.remove("end-time");
  secondsRemaining = currentTime * 60;
  eventsEnabled = !eventsEnabled;
  restartTimer();
}

function pauseTimer() {
  if (!eventsEnabled) return;
  stopInterval();
  pauseTimerBtn.disabled = true;
  pauseTimerBtn.setAttribute("hidden", "");
  restartTimerBtn.disabled = true;
  restartTimerBtn.setAttribute("hidden", "");
  startTimerBtn.disabled = false;
  startTimerBtn.removeAttribute("hidden");
}

function restartTimer() {
  if (!eventsEnabled) return;
  stopInterval();
  const currentTime = pomodoroBreak.checked ? pomodoroTime : shortBreak.checked ? shortBreakTime : longBreakTime;
  secondsRemaining = currentTime * 60;
  timerDisplay.textContent = currentTime < 10 ? String(currentTime).padStart(2, "0") + ":00" : String(currentTime) + ":00";
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

function canvasResize(entries: ResizeObserverEntry[]) {
  const entry = entries[0];
  const {width: cssWidth, height: cssHeight} = entry.contentRect;
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.floor(cssWidth * dpr);
  canvas.height = Math.floor(cssHeight * dpr);

  ctx.scale(dpr, dpr);

  canvasState.width = cssWidth;
  canvasState.height = cssHeight;
}

function animate() {
  const w = canvasState.width;
  const h = canvasState.height;

  ctx.clearRect(0, 0, w, h);

  particles.forEach((p) => {
    p.update();
    p.draw(ctx);
  });

  requestAnimationFrame(() => animate());
}
