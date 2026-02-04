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

const stopInterval = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

const timerOptions = document.getElementById("timerOptions") as HTMLElement;
const glider = timerOptions.querySelector("#glider") as HTMLElement;
const timerDisplay = document.getElementById("timerDisplay") as HTMLSpanElement;
const startTimer = document.getElementById("startTimer") as HTMLButtonElement;
const pauseTimer = startTimer.nextElementSibling?.children[0] as HTMLButtonElement;
const restartTimer = startTimer.nextElementSibling?.children[1] as HTMLButtonElement;
const circleBar = document.getElementById("circleBar") as unknown as SVGCircleElement;

let time = 7;
let totalTime = time * 60;
let secondsRemaining = time * 60;
let timerInterval: ReturnType<typeof setInterval> | null = null;
const circleRadius = circleBar.r.baseVal.value;
const circumference = circleRadius * 2 * Math.PI;

startTimer.addEventListener("click", startTimerCountdown);

pauseTimer.addEventListener("click", () => {
  stopInterval();
  pauseTimer.disabled = true;
  pauseTimer.setAttribute("hidden", "");
  restartTimer.disabled = true;
  restartTimer.setAttribute("hidden", "");
  startTimer.disabled = false;
  startTimer.removeAttribute("hidden");
});

restartTimer.addEventListener("click", () => {
  stopInterval();
  secondsRemaining = time * 60;
  timerDisplay.textContent = time < 10 ? String(time).padStart(2, "0") + ":00" : String(time) + ":00";
  pauseTimer.disabled = true;
  pauseTimer.setAttribute("hidden", "");
  restartTimer.disabled = true;
  restartTimer.setAttribute("hidden", "");
  startTimer.disabled = false;
  startTimer.removeAttribute("hidden");
  circleBar.style.strokeDasharray = circumference.toString();
  circleBar.style.strokeDashoffset = "0";
});
timerOptions.addEventListener("change", setTimeOption);

initialGlide();

function startTimerCountdown() {
  stopInterval();
  startTimer.disabled = true;
  startTimer.setAttribute("hidden", "");
  pauseTimer.removeAttribute("hidden");
  pauseTimer.disabled = false;
  restartTimer.removeAttribute("hidden");
  restartTimer.disabled = false;

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

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function setTimeOption(e: Event) {
  if (!(e.target instanceof HTMLInputElement)) return;
  stopInterval();
  pauseTimer.disabled = true;
  pauseTimer.setAttribute("hidden", "");
  restartTimer.disabled = true;
  restartTimer.setAttribute("hidden", "");
  startTimer.disabled = false;
  startTimer.removeAttribute("hidden");
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
