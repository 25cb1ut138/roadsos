const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#navLinks");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const chatMessages = document.querySelector("#chatMessages");
const toast = document.querySelector("#toast");
const crashCountdown = document.querySelector("#crashCountdown");
const goldenTimer = document.querySelector("#goldenTimer");

let crashSeconds = 10;
let goldenSeconds = 60 * 60;
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

function addMessage(text, type) {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleChatSubmit(event) {
  event.preventDefault();
  const text = chatInput.value.trim();

  if (!text) {
    return;
  }

  addMessage(text, "user");
  chatInput.value = "";

  setTimeout(() => {
    addMessage("AI integration placeholder: stay safe, move away from traffic if possible, call emergency services, and share your live location.", "bot");
  }, 450);
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function startCrashCountdown() {
  setInterval(() => {
    if (crashSeconds > 0) {
      crashSeconds -= 1;
      crashCountdown.textContent = crashSeconds;
    }
  }, 1000);
}

function startGoldenTimer() {
  setInterval(() => {
    if (goldenSeconds > 0) {
      goldenSeconds -= 1;
      goldenTimer.textContent = formatTime(goldenSeconds);
    }
  }, 1000);
}

function animateCounters(entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    const counter = entry.target;
    const target = Number(counter.dataset.counter);
    const duration = 1400;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(target * eased).toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
    observer.unobserve(counter);
  });
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(button.dataset.scroll).scrollIntoView({ behavior: "smooth" });
  });
});

document.querySelectorAll("[data-action='sos']").forEach((button) => {
  button.addEventListener("click", () => {
    showToast("SOS workflow placeholder activated. Emergency APIs can connect here.");
  });
});

document.querySelector("#cancelCrash").addEventListener("click", () => {
  crashSeconds = 10;
  crashCountdown.textContent = crashSeconds;
  showToast("Crash alert cancelled.");
});

document.querySelectorAll(".prompt-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    chatInput.value = chip.textContent;
    chatInput.focus();
  });
});

document.querySelectorAll(".panic-button").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(`${button.textContent} action placeholder selected.`);
  });
});

document.querySelector("#whatsappShare").addEventListener("click", () => {
  showToast("WhatsApp share placeholder ready for live location integration.");
});

chatForm.addEventListener("submit", handleChatSubmit);

const counterObserver = new IntersectionObserver(animateCounters, { threshold: 0.45 });
document.querySelectorAll("[data-counter]").forEach((counter) => counterObserver.observe(counter));

startCrashCountdown();
startGoldenTimer();