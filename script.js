/* ==========================================================
   ROMANTIC APOLOGY WEBSITE — script.js
   Handles: passcode lock, page transitions, floating hearts,
   confetti, escaping NO button, sparkles, music, heart bursts,
   and a restart button on the final page.
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- CONFIG ---------- */
  const PASSCODE = '121706'; // <-- change this to your own 6-digit passcode
  const STORAGE_KEY = 'apology_unlocked';

  /* ---------- ELEMENT REFS ---------- */
  const pagePasscode = document.getElementById('page-passcode');
  const pageApology = document.getElementById('page-apology');
  const pageForever = document.getElementById('page-forever');

  const dotsWrap = document.getElementById('passcode-dots');
  const dots = Array.from(dotsWrap.querySelectorAll('.dot'));
  const keypad = document.getElementById('keypad');
  const deleteKey = document.getElementById('delete-key');
  const clickSound = document.getElementById('click-sound');

  const yesBtn = document.getElementById('yes-btn');
  const noBtn = document.getElementById('no-btn');
  const yesMessage = document.getElementById('yes-message');
  const confettiWrap = document.getElementById('confetti-canvas-wrap');

  const sparklesBg = document.getElementById('sparkles-bg');
  const foreverBtn = document.getElementById('forever-btn');
  const musicToggle = document.getElementById('music-toggle');
  const musicIcon = document.getElementById('music-icon');
  const musicLabel = document.getElementById('music-label');
  const bgMusic = document.getElementById('bg-music');
  const restartBtn = document.getElementById('restart-btn');

  let enteredCode = '';

  /* ==========================================================
     FLOATING HEARTS (background, all pages)
     ========================================================== */
  const heartsBg = document.getElementById('hearts-bg');
  function spawnHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = ['❤️','💕','💗','💖'][Math.floor(Math.random() * 4)];
    const size = 14 + Math.random() * 22;
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = size + 'px';
    heart.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
    const duration = 8 + Math.random() * 6;
    heart.style.animationDuration = duration + 's';
    heartsBg.appendChild(heart);
    setTimeout(() => heart.remove(), duration * 1000);
  }
  setInterval(spawnHeart, 600);
  for (let i = 0; i < 6; i++) setTimeout(spawnHeart, i * 300);

  /* ==========================================================
     PAGE 1 — PASSCODE LOGIC
     ========================================================== */

  const alreadyUnlocked = localStorage.getItem(STORAGE_KEY) === 'true';
  if (alreadyUnlocked) {
    goToPage(pageApology, pagePasscode, true);
  }

  function playClickSound() {
    try {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {});
    } catch (e) {}
  }

  function updateDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle('filled', i < enteredCode.length);
    });
  }

  function handleKeyPress(value) {
    if (enteredCode.length >= PASSCODE.length) return;
    playClickSound();
    enteredCode += value;
    updateDots();

    if (enteredCode.length === PASSCODE.length) {
      setTimeout(checkPasscode, 200);
    }
  }

  function checkPasscode() {
    if (enteredCode === PASSCODE) {
      unlockSuccess();
    } else {
      unlockFail();
    }
  }

  function unlockSuccess() {
    localStorage.setItem(STORAGE_KEY, 'true');
    dots.forEach(dot => dot.classList.add('filled'));
    setTimeout(() => {
      goToPage(pageApology, pagePasscode);
    }, 350);
  }

  function unlockFail() {
    if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
    dots.forEach(dot => dot.classList.add('error'));
    dotsWrap.classList.add('shake');
    setTimeout(() => {
      dotsWrap.classList.remove('shake');
      dots.forEach(dot => dot.classList.remove('error', 'filled'));
      enteredCode = '';
    }, 550);
  }

  keypad.addEventListener('click', (e) => {
    const key = e.target.closest('.key');
    if (!key || key.classList.contains('key-empty')) return;

    key.classList.add('pressed');
    setTimeout(() => key.classList.remove('pressed'), 150);

    if (key === deleteKey) {
      playClickSound();
      enteredCode = enteredCode.slice(0, -1);
      updateDots();
      return;
    }
    const value = key.dataset.key;
    if (value !== undefined) handleKeyPress(value);
  });

  document.addEventListener('keydown', (e) => {
    if (!pagePasscode.classList.contains('active')) return;
    if (/^[0-9]$/.test(e.key)) handleKeyPress(e.key);
    if (e.key === 'Backspace') {
      playClickSound();
      enteredCode = enteredCode.slice(0, -1);
      updateDots();
    }
  });

  /* ==========================================================
     PAGE TRANSITIONS
     ========================================================== */
  function goToPage(nextPage, currentPage, instant) {
    if (instant) {
      currentPage.classList.remove('active');
      nextPage.classList.add('active');
      if (nextPage === pageForever) initForeverPage();
      return;
    }
    currentPage.classList.add('fading-out');
    setTimeout(() => {
      currentPage.classList.remove('active', 'fading-out');
      nextPage.classList.add('active');
      if (nextPage === pageForever) initForeverPage();
    }, 900);
  }

  /* ==========================================================
     PAGE 2 — APOLOGY LOGIC
     ========================================================== */

  yesBtn.addEventListener('click', () => {
    yesBtn.disabled = true;
    noBtn.style.display = 'none';
    launchConfetti();
    spawnBurstHearts(yesBtn);

    const messages = ["Thank you... ❤️", "You just made me the happiest person.", "I love you so much."];
    yesMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
    yesMessage.classList.add('show');

    setTimeout(() => {
      goToPage(pageForever, pageApology);
    }, 2600);
  });

  function launchConfetti() {
    const colors = ['#FF6B9A', '#F9A8C5', '#F8C8DC', '#FFDDEB', '#ffffff'];
    for (let i = 0; i < 80; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const size = 6 + Math.random() * 8;
      piece.style.width = size + 'px';
      piece.style.height = size * 0.5 + 'px';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = (2.5 + Math.random() * 2) + 's';
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      confettiWrap.appendChild(piece);
      setTimeout(() => piece.remove(), 5000);
    }
  }

  function spawnBurstHearts(originEl) {
    const rect = originEl.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    for (let i = 0; i < 18; i++) {
      const heart = document.createElement('div');
      heart.className = 'heart-burst';
      heart.textContent = ['❤️','💕','💖','💗','💓'][Math.floor(Math.random() * 5)];
      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 160;
      heart.style.setProperty('--bx', Math.cos(angle) * dist + 'px');
      heart.style.setProperty('--by', Math.sin(angle) * dist + 'px');
      heart.style.left = originX + 'px';
      heart.style.top = originY + 'px';
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 1500);
    }
  }

  const escapeMessages = ["Nice try 😂", "Not today!", "You almost got me!", "Try again 😝", "Nope!", "You can't catch me!"];
  const AVOID_RADIUS = 120;
  let noBtnPositioned = false;

  function placeButtonRandomly() {
    const btnRect = noBtn.getBoundingClientRect();
    const w = btnRect.width || 160;
    const h = btnRect.height || 60;
    const maxX = window.innerWidth - w - 16;
    const maxY = window.innerHeight - h - 16;
    const x = Math.max(16, Math.random() * maxX);
    const y = Math.max(16, Math.random() * maxY);
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
    noBtn.classList.add('roaming');
  }

  function showEscapeMessage() {
    const msg = document.createElement('div');
    msg.className = 'escape-msg';
    msg.textContent = escapeMessages[Math.floor(Math.random() * escapeMessages.length)];
    const rect = noBtn.getBoundingClientRect();
    msg.style.left = rect.left + 'px';
    msg.style.top = (rect.top - 30) + 'px';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 1100);
  }

  function distanceToButton(x, y) {
    const rect = noBtn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.hypot(x - cx, y - cy);
  }

  function tryEscape(x, y) {
    if (!pageApology.classList.contains('active')) return;
    if (distanceToButton(x, y) < AVOID_RADIUS) {
      if (!noBtnPositioned) {
        noBtnPositioned = true;
      }
      placeButtonRandomly();
      showEscapeMessage();
    }
  }

  document.addEventListener('mousemove', (e) => tryEscape(e.clientX, e.clientY));

  noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    placeButtonRandomly();
    showEscapeMessage();
  }, { passive: false });

  document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    if (touch) tryEscape(touch.clientX, touch.clientY);
  });

  noBtn.addEventListener('mouseenter', () => {
    placeButtonRandomly();
    showEscapeMessage();
  });

  const apologyObserver = new MutationObserver(() => {
    if (pageApology.classList.contains('active') && !noBtnPositioned) {
      setTimeout(placeButtonRandomly, 50);
      noBtnPositioned = true;
    }
  });
  apologyObserver.observe(pageApology, { attributes: true, attributeFilter: ['class'] });

  window.addEventListener('resize', () => {
    if (noBtnPositioned && pageApology.classList.contains('active')) {
      placeButtonRandomly();
    }
  });

  /* ==========================================================
     PAGE 3 — FOREVER PAGE
     ========================================================== */
  let foreverInitialized = false;

  function initForeverPage() {
    if (foreverInitialized) return;
    foreverInitialized = true;
    spawnSparkles();
  }

  function spawnSparkles() {
    setInterval(() => {
      if (!pageForever.classList.contains('active')) return;
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = Math.random() * 100 + '%';
      sparkle.style.top = Math.random() * 100 + '%';
      sparkle.style.animationDelay = (Math.random() * 0.5) + 's';
      sparklesBg.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 2600);
    }, 350);
  }

  foreverBtn.addEventListener('click', () => {
    spawnBurstHearts(foreverBtn);
    for (let i = 0; i < 3; i++) {
      setTimeout(() => spawnBurstHearts(foreverBtn), i * 150);
    }
  });

  let musicPlaying = false;
  musicToggle.addEventListener('click', () => {
    if (musicPlaying) {
      bgMusic.pause();
      musicIcon.textContent = '▶';
      musicLabel.textContent = 'Play music';
    } else {
      bgMusic.play().catch(() => {});
      musicIcon.textContent = '⏸';
      musicLabel.textContent = 'Pause music';
    }
    musicPlaying = !musicPlaying;
  });

  /* ==========================================================
     RESTART BUTTON — clears the unlock flag, stops music,
     and reloads so the passcode screen shows fresh again.
     ========================================================== */
  restartBtn.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    bgMusic.pause();
    bgMusic.currentTime = 0;
    location.reload();
  });

});