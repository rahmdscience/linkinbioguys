// Init Lucide
lucide.createIcons();

// === SOUND EFFECTS ===
const hoverSfx = document.getElementById("sfx-hover");
const clickSfx = document.getElementById("sfx-click");
hoverSfx.volume = 0.15;
clickSfx.volume = 0.4;

document.querySelectorAll("a, button, .cursor-pointer").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    hoverSfx.currentTime = 0;
    hoverSfx.play().catch(() => {});
  });
  el.addEventListener("mousedown", () => {
    clickSfx.currentTime = 0;
    clickSfx.play().catch(() => {});
  });
});

// === TERMINAL LOADING SCREEN (FIXED) ===
const loadingScreen = document.getElementById("loading-screen");
const loadingText = document.getElementById("loading-text");
const terminalMsgs = [
  "> INITIALIZING SYSTEM...",
  "> LOADING ASSETS...",
  "> ESTABLISHING SECURE CONNECTION...",
  "> WELCOME, RAHMAD SAINS.",
];
let msgIdx = 0;
let charIdx = 0;

function typeWriter() {
  if (msgIdx < terminalMsgs.length) {
    if (charIdx < terminalMsgs[msgIdx].length) {
      loadingText.innerHTML += terminalMsgs[msgIdx].charAt(charIdx);
      charIdx++;
      setTimeout(typeWriter, 30); // Kecepatan ketik
    } else {
      loadingText.innerHTML += "<br><br>";
      msgIdx++;
      charIdx = 0;
      setTimeout(typeWriter, 300); // Jeda antar kalimat
    }
  } else {
    // Animasi selesai, hilangkan layar secara perlahan lalu sembunyikan total
    setTimeout(() => {
      loadingScreen.classList.add("-translate-y-full", "opacity-0");
      setTimeout(() => {
        loadingScreen.classList.add("hidden");
      }, 700);
    }, 800);
  }
}

// === LIVE LOCAL TIME ===
function updateLocalTime() {
  const now = new Date();
  // Zona waktu WIB
  const timeString = now.toLocaleTimeString("id-ID", {
    timeZone: "Asia/Jakarta",
    hour12: false,
  });
  document.getElementById("local-time").textContent =
    "LOCAL TIME: " + timeString + " WIB";

  // Logika Status Berdasarkan Waktu
  const hour = parseInt(
    now.toLocaleTimeString("en-US", {
      timeZone: "Asia/Jakarta",
      hour12: false,
      hour: "numeric",
    }),
  );
  let statusText = "ONLINE";
  let statusColor = "text-white";

  if (hour >= 0 && hour < 5) {
    statusText = "LATE NIGHT CODING";
    statusColor = "text-red-500";
  } else if (hour >= 5 && hour < 8) {
    statusText = "SLEEPING";
    statusColor = "text-gray-400";
  } else if (hour >= 8 && hour < 16) {
    statusText = "AT CAMPUS";
    statusColor = "text-white";
  } else if (hour >= 20) {
    statusText = "DEEP WORK";
    statusColor = "text-white";
  }

  const statusEl = document.getElementById("local-status");
  statusEl.textContent = statusText;
  statusEl.className = `${statusColor} animate-pulse`;
}
setInterval(updateLocalTime, 1000);
updateLocalTime();

// === INVERT THEME (DARK MODE) ===
let inverted = localStorage.getItem("invertTheme") === "true";
if (inverted) document.documentElement.classList.add("invert-mode");

function toggleInvert() {
  inverted = !inverted;
  document.documentElement.classList.toggle("invert-mode", inverted);
  localStorage.setItem("invertTheme", inverted);
  showToast(inverted ? "INVERT MODE ON" : "INVERT MODE OFF");
}

// === EASTER EGG (5 Clicks) ===
let clickCount = 0;
const profileTitle = document.getElementById("profile-title");
const easterEggOverlay = document.getElementById("easter-egg");

profileTitle.addEventListener("click", () => {
  clickCount++;
  if (clickCount === 5) {
    easterEggOverlay.classList.remove("hidden");
    easterEggOverlay.classList.add("flex");
    clickCount = 0;
  }
});

function closeEasterEgg() {
  easterEggOverlay.classList.add("hidden");
  easterEggOverlay.classList.remove("flex");
}

// === BACKGROUND MUSIC ===
let bgMusicPlaying = false;
const bgAudio = document.getElementById("bg-audio");

function toggleBgMusic() {
  const icon = document.getElementById("music-icon");
  const btn = document.getElementById("music-btn");
  icon.classList.add("active");
  setTimeout(() => icon.classList.remove("active"), 400);

  if (bgMusicPlaying) {
    bgAudio.pause();
    bgMusicPlaying = false;
    btn.classList.remove("bg-black", "text-white");
    btn.classList.add("bg-white", "text-black");
    showToast("AUDIO: OFF");
  } else {
    bgAudio.volume = 0.25;
    bgAudio
      .play()
      .then(() => {
        bgMusicPlaying = true;
        btn.classList.add("bg-black", "text-white");
        btn.classList.remove("bg-white", "text-black");
        showToast("AUDIO: ON");
      })
      .catch(() => showToast("TAP AGAIN TO PLAY"));
  }
}

// === SHARE ===
function shareProfile() {
  if (navigator.share) {
    navigator.share({
      title: "Rahmad Sains",
      text: "Check out my links!",
      url: location.href,
    });
  } else if (navigator.clipboard) {
    navigator.clipboard
      .writeText(location.href)
      .then(() => showToast("LINK COPIED"));
  }
}

// === RIPPLE EFFECT & VIEWS ===
function trackClick(e, name) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const ripple = document.createElement("span");
  ripple.className = "ripple-paper";
  ripple.style.left = e.clientX - rect.left - 20 + "px";
  ripple.style.top = e.clientY - rect.top - 20 + "px";
  card.appendChild(ripple);
  setTimeout(() => ripple.remove(), 500);

  let totalViews = parseInt(localStorage.getItem("totalViews") || "89");
  totalViews += 1;
  localStorage.setItem("totalViews", totalViews.toString());
  document.getElementById("view-count").textContent =
    totalViews.toLocaleString();
}

function initCounts() {
  let totalViews = parseInt(localStorage.getItem("totalViews") || "89");
  let totalMsgs = parseInt(localStorage.getItem("totalMessages") || "17");

  const elViews = document.getElementById("view-count");
  const elMsgs = document.getElementById("message-count");

  const start = performance.now();

  function update(now) {
    const p = Math.min((now - start) / 1500, 1);
    const eased = 1 - Math.pow(1 - p, 3);

    elViews.textContent = Math.round(totalViews * eased).toLocaleString();
    elMsgs.textContent = Math.round(totalMsgs * eased).toLocaleString();

    if (p < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// === FORM SUBMIT ===
function sendMessage(e) {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById("send-btn");
  const sendText = document.getElementById("send-text");
  const sendIcon = document.getElementById("send-icon");

  sendText.textContent = "SENDING...";
  sendIcon.className =
    "spinner w-5 h-5 border-4 border-white/30 border-t-white rounded-full";
  sendIcon.removeAttribute("data-lucide");
  btn.disabled = true;
  btn.style.opacity = "0.7";

  const formData = new FormData(form);

  fetch("https://formsubmit.co/ajax/6043e401191691d6d1c8bb6db41322fa", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(Object.fromEntries(formData)),
  })
    .then((res) => {
      if (res.ok) {
        form.classList.add("hidden");
        document.getElementById("success-state").classList.remove("hidden");
        lucide.createIcons();
        showToast("SUCCESS");

        let currentMsgs = parseInt(
          localStorage.getItem("totalMessages") || "17",
        );
        currentMsgs += 1;
        localStorage.setItem("totalMessages", currentMsgs.toString());
        document.getElementById("message-count").textContent =
          currentMsgs.toLocaleString();
      } else throw new Error();
    })
    .catch(() => {
      const d = Object.fromEntries(formData);
      const subj = encodeURIComponent(
        "Message from " + d.name + " (" + d.email + ")",
      );
      const body = encodeURIComponent(
        "Name: " + d.name + "\nEmail: " + d.email + "\n\n" + d.message,
      );
      location.href =
        "mailto:rsainsalhafidz@gmail.com?subject=" + subj + "&body=" + body;
      showToast("OPENING EMAIL APP...");
    })
    .finally(() => {
      setTimeout(() => {
        sendText.textContent = "SUBMIT";
        sendIcon.className = "w-5 h-5";
        sendIcon.setAttribute("data-lucide", "send");
        btn.disabled = false;
        btn.style.opacity = "1";
        lucide.createIcons();
      }, 3000);
    });
}

// === TOAST NOTIFICATION ===
function showToast(msg) {
  const c = document.getElementById("toast-container");
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  c.appendChild(t);
  requestAnimationFrame(() => t.classList.add("show"));
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 300);
  }, 2200);
}

// === HIDE NAVBAR ON SCROLL ===
const topNav = document.getElementById("top-nav");
window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    topNav.classList.add(
      "-translate-y-full",
      "opacity-0",
      "pointer-events-none",
    );
  } else {
    topNav.classList.remove(
      "-translate-y-full",
      "opacity-0",
      "pointer-events-none",
    );
  }
});

// === INIT ===
window.addEventListener("load", () => {
  initCounts();
  setTimeout(typeWriter, 500);
});
