// Saat tombol "PLAY" diklik
document.getElementById('playButton').addEventListener('click', function () {
  const music = document.getElementById('bgMusic');
  music.play();

  // Tambahkan class fade-out ke body
  document.body.classList.add('fade-out');

  // Tunggu animasi selesai, baru pindah halaman
  setTimeout(() => {
    window.location.href = "Materi.html";
  }, 600); // 600ms sesuai durasi di CSS
});

// Tombol untuk memutar atau menjeda musik
function toggleMusic() {
  const music = document.getElementById('bgMusic');
  if (music.paused) {
    music.play();
  } else {
    music.pause();
  }
}
