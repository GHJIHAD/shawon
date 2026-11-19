// Auto-load local images with extension fallback (.jpg -> .png -> .webp -> monogram)
function setupSmartAvatar(imgId, fallbackId, baseName) {
  const img = document.getElementById(imgId);
  const fallback = document.getElementById(fallbackId);
  if (!img || !fallback) return;

  const candidates = [`${baseName}.jpg`, `${baseName}.png`, `${baseName}.webp`];
  let index = 0;

  img.addEventListener("error", () => {
    index += 1;
    if (index < candidates.length) {
      img.src = candidates[index];
    } else {
      img.classList.add("hidden");
      fallback.classList.remove("hidden");
    }
  });
}

setupSmartAvatar("shawon-avatar", "shawon-fallback", "shawon");
setupSmartAvatar("hiya-avatar", "hiya-fallback", "hiya");

// Basic deterrent against dragging and context menu on avatars
(function initAvatarGuard() {
  const avatars = document.querySelectorAll("#shawon-avatar, #hiya-avatar");
  avatars.forEach((img) => {
    img.setAttribute("draggable", "false");
    img.addEventListener("contextmenu", (e) => e.preventDefault());
    img.addEventListener("dragstart", (e) => e.preventDefault());
  });
})();

// Floating ambient hearts in background
(function initFloatingHearts() {
  const container = document.getElementById("hearts-bg");
  if (!container) return;

  const symbols = ["❤️", "💖", "💕", "💘", "♥"];
  const count = 24;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "floating-heart";
    el.textContent = symbols[i % symbols.length];
    el.style.left = `${(i / count) * 96 + Math.random() * 4}%`;
    el.style.fontSize = `${16 + Math.random() * 14}px`;
    el.style.animationDuration = `${9 + Math.random() * 8}s`;
    el.style.animationDelay = `${-(Math.random() * 12)}s`;
    container.appendChild(el);
  }
})();

// Interactive "Send Love to Hiya" counter + heart burst
(function initLoveButton() {
  const btn = document.getElementById("send-love-btn");
  const countEl = document.getElementById("love-count");
  const burstLayer = document.getElementById("burst-layer");
  if (!btn || !countEl || !burstLayer) return;

  const storageKey = "shawon_hiya_love_count_v1";
  let count = Number(localStorage.getItem(storageKey)) || 143;
  countEl.textContent = count.toLocaleString();

  const hearts = ["❤️", "💖", "💕", "💘", "🌹"];

  btn.addEventListener("click", (e) => {
    count += 1;
    countEl.textContent = count.toLocaleString();
    localStorage.setItem(storageKey, String(count));

    const rect = btn.getBoundingClientRect();
    const originX = e.clientX || rect.left + rect.width / 2;
    const originY = e.clientY || rect.top + rect.height / 2;

    for (let i = 0; i < 14; i++) {
      const span = document.createElement("span");
      span.className = "burst-heart";
      span.textContent = hearts[i % hearts.length];
      span.style.left = `${originX}px`;
      span.style.top = `${originY}px`;

      const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.35;
      const distance = 65 + Math.random() * 95;
      span.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
      span.style.setProperty("--dy", `${Math.sin(angle) * distance - 25}px`);
      span.style.setProperty("--rot", `${(Math.random() - 0.5) * 60}deg`);

      burstLayer.appendChild(span);
      setTimeout(() => span.remove(), 1000);
    }
  });
})();

// Typing animation for Shawon's roles
(function initTypingRoles() {
  const target = document.getElementById("typed-role");
  if (!target) return;

  const roles = [
    "Loyal Boyfriend to Wifey Hiya ❤️",
    "Professional & Experienced Gamer",
    "PC & System Optimization Expert",
    "White Hat Hacker & Security Learner",
    "Developer & AI Enthusiast",
    "Beginner Footballer & Student",
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex += 1;
      target.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
      setTimeout(tick, 65);
    } else {
      charIndex -= 1;
      target.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, 35);
    }
  }

  tick();
})();

// Helper for copy buttons
function bindCopyButton(btnId, sourceId, copiedLabel) {
  const btn = document.getElementById(btnId);
  const sourceEl = document.getElementById(sourceId);
  if (!btn || !sourceEl) return;

  btn.addEventListener("click", async () => {
    const value = sourceEl.textContent.trim();
    const original = btn.textContent;
    try {
      await navigator.clipboard.writeText(value);
      btn.textContent = copiedLabel;
      setTimeout(() => {
        btn.textContent = original;
      }, 1500);
    } catch {
      btn.textContent = value;
    }
  });
}

bindCopyButton("copy-discord-btn", "discord-handle", "Copied!");
bindCopyButton("copy-gmail-btn", "gmail-address", "Copied!");