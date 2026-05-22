const STORAGE_KEYS = {
  users: "saferouteUsers",
  session: "saferouteSession",
  profile: "saferouteEmergencyProfile"
};

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#navLinks");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const chatMessages = document.querySelector("#chatMessages");
const toast = document.querySelector("#toast");
const crashCountdown = document.querySelector("#crashCountdown");
const goldenTimer = document.querySelector("#goldenTimer");
const loginForm = document.querySelector("#loginForm");
const registerForm = document.querySelector("#registerForm");
const profileForm = document.querySelector("#profileForm");
const profileModal = document.querySelector("#profileModal");
const authLink = document.querySelector("#authLink");
const profileNav = document.querySelector("#profileNav");
const logoutButton = document.querySelector("#logoutButton");

let crashSeconds = 10;
let goldenSeconds = 60 * 60;
let toastTimer;

function readJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getUsers() {
  return readJSON(STORAGE_KEYS.users, []);
}

function getSession() {
  return readJSON(STORAGE_KEYS.session, null);
}

function getProfile() {
  return readJSON(STORAGE_KEYS.profile, null);
}

function setError(id, message) {
  const target = document.querySelector(id);
  if (target) {
    target.textContent = message;
  }
}

function showToast(message) {
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

function requireText(value) {
  return value.trim().length > 0;
}

function hasEmergencyProfile() {
  const profile = getProfile();
  return Boolean(profile && profile.name && profile.dob && profile.bloodGroup && profile.phone && profile.emergencyContact);
}

function buildProfileSummary() {
  const profile = getProfile();
  if (!profile) {
    return "No emergency profile saved.";
  }

  return [
    `Name: ${profile.name}`,
    `DOB: ${profile.dob}`,
    `Blood Group: ${profile.bloodGroup}`,
    `Phone: ${profile.phone}`,
    `Emergency Contact: ${profile.emergencyContact}`,
    profile.address ? `Address: ${profile.address}` : "",
    profile.medicalConditions ? `Medical Notes: ${profile.medicalConditions}` : ""
  ].filter(Boolean).join(" | ");
}

function addMessage(text, type) {
  if (!chatMessages) {
    return;
  }

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
  if (!crashCountdown) {
    return;
  }

  setInterval(() => {
    if (crashSeconds > 0) {
      crashSeconds -= 1;
      crashCountdown.textContent = crashSeconds;
    }
  }, 1000);
}

function startGoldenTimer() {
  if (!goldenTimer) {
    return;
  }

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

function openProfileModal() {
  if (!profileModal) {
    return;
  }

  fillProfileForm();
  profileModal.hidden = false;
  document.body.classList.add("modal-open");
  document.querySelector("#profileName")?.focus();
}

function closeProfileModal() {
  if (!profileModal) {
    return;
  }

  profileModal.hidden = true;
  document.body.classList.remove("modal-open");
}

function fillProfileForm() {
  const profile = getProfile();
  if (!profileForm || !profile) {
    return;
  }

  document.querySelector("#profileName").value = profile.name || "";
  document.querySelector("#profileDob").value = profile.dob || "";
  document.querySelector("#profileBlood").value = profile.bloodGroup || "";
  document.querySelector("#profilePhone").value = profile.phone || "";
  document.querySelector("#profileEmergency").value = profile.emergencyContact || "";
  document.querySelector("#profileAddress").value = profile.address || "";
  document.querySelector("#profileMedical").value = profile.medicalConditions || "";
}

function updateVault() {
  const profile = getProfile();
  const values = {
    vaultName: profile?.name || "Add profile",
    vaultBlood: profile?.bloodGroup || "Not saved",
    vaultPhone: profile?.phone || "Not saved",
    vaultEmergency: profile?.emergencyContact || "Not saved",
    vaultMedical: profile?.medicalConditions || "No notes saved"
  };

  Object.entries(values).forEach(([id, value]) => {
    const element = document.querySelector(`#${id}`);
    if (element) {
      element.textContent = value;
    }
  });
}

function updateNavbar() {
  const session = getSession();
  const profile = getProfile();

  if (authLink) {
    authLink.textContent = session ? (profile?.name ? `Hi, ${profile.name}` : "Profile") : "Login";
    authLink.href = session ? "#profile" : "login.html";
  }

  if (logoutButton) {
    logoutButton.hidden = !session;
  }
}

function ensureDashboardSession() {
  if (!document.querySelector("main") || loginForm || registerForm) {
    return;
  }

  const session = getSession();
  updateNavbar();
  updateVault();

  if (session && !hasEmergencyProfile()) {
    setTimeout(() => {
      openProfileModal();
      showToast("Complete your emergency profile to activate personalized SOS details.");
    }, 600);
  }
}

function handleLogin(event) {
  event.preventDefault();
  const identifier = document.querySelector("#loginIdentifier").value.trim();
  const password = document.querySelector("#loginPassword").value;

  if (!requireText(identifier) || !requireText(password)) {
    setError("#loginError", "Enter both email/username and password.");
    return;
  }

  const users = getUsers();
  let user = users.find((item) => item.identifier.toLowerCase() === identifier.toLowerCase() && item.password === password);

  if (!user && users.length === 0) {
    user = { identifier, password };
    writeJSON(STORAGE_KEYS.users, [user]);
  }

  if (!user) {
    setError("#loginError", "No matching demo account found. Register first or use your saved credentials.");
    return;
  }

  writeJSON(STORAGE_KEYS.session, { identifier: user.identifier, loggedInAt: new Date().toISOString() });
  setError("#loginError", "");
  showToast("Login successful. Redirecting to dashboard.");
  setTimeout(() => window.location.assign("index.html"), 450);
}

function handleRegister(event) {
  event.preventDefault();
  const identifier = document.querySelector("#registerIdentifier").value.trim();
  const password = document.querySelector("#registerPassword").value;
  const confirm = document.querySelector("#registerConfirm").value;

  if (!requireText(identifier) || !requireText(password) || !requireText(confirm)) {
    setError("#registerError", "Complete all required fields.");
    return;
  }

  if (password.length < 6) {
    setError("#registerError", "Password must be at least 6 characters for the demo.");
    return;
  }

  if (password !== confirm) {
    setError("#registerError", "Passwords do not match.");
    return;
  }

  const users = getUsers();
  if (users.some((item) => item.identifier.toLowerCase() === identifier.toLowerCase())) {
    setError("#registerError", "This demo account already exists. Login instead.");
    return;
  }

  users.push({ identifier, password });
  writeJSON(STORAGE_KEYS.users, users);
  writeJSON(STORAGE_KEYS.session, { identifier, loggedInAt: new Date().toISOString() });
  setError("#registerError", "");
  showToast("Account created. Redirecting to dashboard.");
  setTimeout(() => window.location.assign("index.html"), 450);
}

function handleProfileSave(event) {
  event.preventDefault();
  const profile = {
    name: document.querySelector("#profileName").value.trim(),
    dob: document.querySelector("#profileDob").value,
    bloodGroup: document.querySelector("#profileBlood").value,
    phone: document.querySelector("#profilePhone").value.trim(),
    emergencyContact: document.querySelector("#profileEmergency").value.trim(),
    address: document.querySelector("#profileAddress").value.trim(),
    medicalConditions: document.querySelector("#profileMedical").value.trim()
  };

  if (!profile.name || !profile.dob || !profile.bloodGroup || !profile.phone || !profile.emergencyContact) {
    setError("#profileError", "Name, date of birth, blood group, phone number, and emergency contact are required.");
    return;
  }

  writeJSON(STORAGE_KEYS.profile, profile);
  setError("#profileError", "");
  updateVault();
  updateNavbar();
  closeProfileModal();
  showToast("Emergency profile saved offline.");
}

function handleSOS() {
  const session = getSession();
  if (!session) {
    showToast("Login first to attach your emergency profile to SOS.");
    setTimeout(() => window.location.assign("login.html"), 650);
    return;
  }

  if (!hasEmergencyProfile()) {
    openProfileModal();
    showToast("Save your emergency profile before sending SOS.");
    return;
  }

  showToast(`SOS ready with profile: ${buildProfileSummary()}`);
}

function handleWhatsAppShare() {
  const profileSummary = buildProfileSummary();
  const message = encodeURIComponent(`SafeRoute AI Emergency Alert. ${profileSummary} Live location integration placeholder: add GPS coordinates here.`);
  const url = `https://wa.me/?text=${message}`;
  window.open(url, "_blank", "noopener,noreferrer");
  showToast("WhatsApp emergency message prepared with saved profile details.");
}

function initDashboard() {
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (link.id === "authLink" && getSession()) {
        event.preventDefault();
        openProfileModal();
      }

      navLinks?.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  document.querySelectorAll("[data-scroll]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector(button.dataset.scroll)?.scrollIntoView({ behavior: "smooth" });
    });
  });

  document.querySelectorAll("[data-action='sos']").forEach((button) => {
    button.addEventListener("click", handleSOS);
  });

  document.querySelector("#cancelCrash")?.addEventListener("click", () => {
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

  const panicLabels = ["AMB Ambulance", "HSP Hospital", "POL Police", "LOC Share Location"];
  document.querySelectorAll(".panic-button").forEach((button, index) => {
    button.textContent = panicLabels[index] || button.textContent.trim();
    button.addEventListener("click", () => {
      if (button.textContent.includes("Share")) {
        handleWhatsAppShare();
        return;
      }
      showToast(`${button.textContent} action placeholder selected. ${hasEmergencyProfile() ? buildProfileSummary() : "Add profile for auto-filled emergency details."}`);
    });
  });

  document.querySelector("#whatsappShare")?.addEventListener("click", handleWhatsAppShare);
  document.querySelector("#closeProfile")?.addEventListener("click", closeProfileModal);
  profileModal?.addEventListener("click", (event) => {
    if (event.target === profileModal) {
      closeProfileModal();
    }
  });
  profileNav?.addEventListener("click", openProfileModal);
  logoutButton?.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEYS.session);
    showToast("Logged out.");
    setTimeout(() => window.location.assign("login.html"), 450);
  });
  profileForm?.addEventListener("submit", handleProfileSave);
  chatForm?.addEventListener("submit", handleChatSubmit);

  if (window.IntersectionObserver) {
    const counterObserver = new IntersectionObserver(animateCounters, { threshold: 0.45 });
    document.querySelectorAll("[data-counter]").forEach((counter) => counterObserver.observe(counter));
  }

  ensureDashboardSession();
  startCrashCountdown();
  startGoldenTimer();
}

loginForm?.addEventListener("submit", handleLogin);
registerForm?.addEventListener("submit", handleRegister);
initDashboard();
