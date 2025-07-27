const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const idleSprite = new Image();
idleSprite.src = 'assets/idle.png';

const bgImage = new Image();
bgImage.src = 'assets/Background3.png';

const platformTexture = new Image();
platformTexture.src = 'assets/platform2.png';

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
  { x: 0, y: 500, width: 960, height: 40 },       // Tanah dasar
  { x: 100, y: 420, width: 120, height: 20 },     // Platform 1 kiri bawah
  { x: 250, y: 350, width: 100, height: 20 },     // Platform 2 naik
  { x: 400, y: 280, width: 100, height: 20 },     // Platform 3 naik
  { x: 550, y: 190, width: 100, height: 20 },     // Platform 4 turun
  { x: 400, y: 100, width: 120, height: 20 },     // Platform 5 tertinggi (tengah layar)
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

  const URL = "https://script.google.com/macros/s/AKfycbwcAKfDr8-PNRwFlfdFPKXme2ZDryYZcRHUfBGD0yC0B5FpZsFil4KMHBjO0U_a9kW5/exec"; // GANTI

  fetch(URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `nama=${encodeURIComponent(nama)}&jawaban=${encodeURIComponent(jawaban)}`
  }).then(() => {
    alert("Jawaban terkirim. Sekarang Simpulkanlah Materi Hari ini!");
    window.location.href = "kesimpulan.html"; // Pindah halaman
  }).catch(() => {
    alert("Gagal mengirim jawaban.");
  });
}

gameLoop();
