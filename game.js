const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const idleSprite = new Image();
idleSprite.src = 'assets/idle.png';

const bgImage = new Image();
bgImage.src = 'assets/Background1.png';

const platformTexture = new Image();
platformTexture.src = 'assets/platform.png';

const SPRITE_WIDTH = 32;
const SPRITE_HEIGHT = 32;
const TOTAL_FRAMES = 10;
let currentFrame = 0;
let frameCounter = 0;
const FRAME_SPEED = 6;

const player = {
  x: 50,
  y: 0,
  width: 64,
  height: 64,
  vy: 0,
  isJumping: false
};

const gravity = 0.6;
const jumpPower = -12;
const keys = {};
let popupShown = false;

const platforms = [
  { x: 0, y: 500, width: 960, height: 40 },
  { x: 200, y: 400, width: 120, height: 20 },
  { x: 400, y: 320, width: 120, height: 20 },
  { x: 650, y: 250, width: 120, height: 20 }, // terakhir
];

// Keyboard Controls
document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

function drawPlayer() {
  frameCounter++;
  if (frameCounter % FRAME_SPEED === 0) {
    currentFrame = (currentFrame + 1) % TOTAL_FRAMES;
  }

  ctx.drawImage(
    idleSprite,
    currentFrame * SPRITE_WIDTH, 0,
    SPRITE_WIDTH, SPRITE_HEIGHT,
    player.x, player.y,
    player.width, player.height
  );
}

function drawPlatforms() {
  platforms.forEach(p => {
    for (let i = 0; i < p.width; i += 32) {
      ctx.drawImage(platformTexture, p.x + i, p.y, 32, p.height);
    }
  });
}

function update() {
  if (keys["a"]) player.x -= 4;
  if (keys["d"]) player.x += 4;
  if (keys["w"] && !player.isJumping) {
    player.vy = jumpPower;
    player.isJumping = true;
  }

  player.vy += gravity;
  player.y += player.vy;

  let onGround = false;
  platforms.forEach(p => {
    if (
      player.x < p.x + p.width &&
      player.x + player.width > p.x &&
      player.y + player.height > p.y &&
      player.y + player.height < p.y + p.height + 10 &&
      player.vy >= 0
    ) {
      player.y = p.y - player.height;
      player.vy = 0;
      player.isJumping = false;
      onGround = true;

      if (p === platforms[platforms.length - 1] && !popupShown) {
        showPopup();
      }
    }
  });

  if (!onGround) player.isJumping = true;
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  drawPlatforms();
  drawPlayer();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function showPopup() {
  document.getElementById("popup").classList.remove("hidden");
  popupShown = true;
}

// Kirim jawaban + pindah ke halaman game1.html
function submitJawaban() {
  const nama = document.getElementById("nama").value.trim();
  const jawaban = document.getElementById("jawaban").value.trim();

  if (!nama || !jawaban) {
    alert("Harap isi nama dan jawaban.");
    return;
  }

  const URL = "https://script.google.com/macros/s/AKfycbwSMbkqmln3lnJKOlETTZFwqQOJILv6ZJi_l-whqTIjlMpiNt8fSsiijKyoN_EpMoci/exec"; // GANTI

  fetch(URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `nama=${encodeURIComponent(nama)}&jawaban=${encodeURIComponent(jawaban)}`
  }).then(() => {
    alert("Jawaban terkirim. Lanjut ke level berikutnya!");
    window.location.href = "game1.html"; // Pindah halaman
  }).catch(() => {
    alert("Gagal mengirim jawaban.");
  });
}

gameLoop();
