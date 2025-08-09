const tg = window.Telegram.WebApp;
const params = new URLSearchParams(window.location.search);
const giveaway_id = params.get("giveaway_id") || "";

let isCaptchaPassed = false;

function verifyCaptcha() {
  const checkbox = document.getElementById("checkbox");
  checkbox.classList.add("checked");
  isCaptchaPassed = true;
  setTimeout(() => {
    document.querySelector(".captcha").style.display = "none";
    document.getElementById("main").style.display = "block";

    const uid = tg.initDataUnsafe?.user?.id || "guest";
    const ref = getRefFromStartParam() || uid;
    document.getElementById("ref-link").value = `https://t.me/K7_Base_Bot?start=${ref}`;
  }, 500);
}

function getRefFromStartParam() {
  const startParam = tg.initDataUnsafe?.start_param || "";
  if (startParam.startsWith("ref")) {
    return startParam.substring(3);
  }
  return null;
}

function joinGiveaway() {
  if (!isCaptchaPassed) {
    alert("Пожалуйста, подтвердите, что вы не робот.");
    return;
  }

  const uid = tg.initDataUnsafe?.user?.id || "guest";
  const ref = getRefFromStartParam();
  const data = {
    action: "join",
    giveaway_id: giveaway_id,
  };
  if (ref && ref != uid) {
    data.ref = ref;
  }
  tg.sendData(JSON.stringify(data));
}

// Таймер обратного отсчёта
function startTimer(endDateStr) {
  const timerEl = document.getElementById("timer");
  const endDate = new Date(endDateStr.split('.').reverse().join('-') + "T23:59:59");

  function updateTimer() {
    const now = new Date();
    const diff = endDate - now;
    if (diff <= 0) {
      timerEl.textContent = "Время вышло!";
      return;
    }
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    timerEl.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  function pad(num) {
    return num.toString().padStart(2, "0");
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

window.addEventListener("DOMContentLoaded", () => {
  // TODO: загрузить дату окончания через API, сейчас заглушка
  const endDate = params.get("end_date") || "";
  if (endDate) startTimer(endDate);
});
