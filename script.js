// Init Lucide
lucide.createIcons();

// === Background Music ===
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

// === Share ===
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

// === Track Click + Ripple ===
function trackClick(e, name) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const ripple = document.createElement("span");
  ripple.className = "ripple-paper";
  ripple.style.left = e.clientX - rect.left - 20 + "px";
  ripple.style.top = e.clientY - rect.top - 20 + "px";
  card.appendChild(ripple);
  setTimeout(() => ripple.remove(), 500);

  let total = parseInt(localStorage.getItem("totalViews") || "1247");
  total += 1;
  localStorage.setItem("totalViews", total.toString());
  document.getElementById("view-count").textContent = total.toLocaleString();
}

// === View Count ===
function initViews() {
  let total = parseInt(localStorage.getItem("totalViews") || "1247");
  const el = document.getElementById("view-count");
  const start = performance.now();
  function update(now) {
    const p = Math.min((now - start) / 1500, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(total * eased).toLocaleString();
    if (p < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// === Send Message (FormSubmit) ===
function sendMessage(e) {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById("send-btn");
  const sendText = document.getElementById("send-text");
  const sendIcon = document.getElementById("send-icon");

  // Loading State
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
        // Reset Button
        sendText.textContent = "SUBMIT";
        sendIcon.className = "w-5 h-5";
        sendIcon.setAttribute("data-lucide", "send");
        btn.disabled = false;
        btn.style.opacity = "1";
        lucide.createIcons();
      }, 3000);
    });
}

// === Toast ===
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

// === Scroll Hide Navbar ===
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

// === Init ===
window.addEventListener("load", initViews);
