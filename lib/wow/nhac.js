/*
* 
* 
*/
document.addEventListener('DOMContentLoaded', function() {
  var music = document.getElementById("bg-music");
  var button = document.getElementById("music-toggle");

  // Thêm class phát nhạc ban đầu (vì có thuộc tính autoplay)
  if (!music.paused) {
    button.classList.add("playing");
  }

  // Phát nhạc ngay khi người dùng click bất kỳ đâu trên web (nếu trình duyệt chặn autoplay)
  document.body.addEventListener('click', function() {
    if (music.paused) {
      music.play().then(function() {
        button.classList.add("playing");
      }).catch(function(error) {
        console.log("Trình duyệt chưa cho phép phát tự động.");
      });
    }
  }, { once: true });
});

// Hàm xử lý Bật/Tắt nhạc khi click vào nút
function toggleMusic() {
  var music = document.getElementById("bg-music");
  var button = document.getElementById("music-toggle");
  
  if (music.paused) {
    music.play();
    button.classList.add("playing"); // Thêm hiệu ứng xoay
  } else {
    music.pause();
    button.classList.remove("playing"); // Dừng hiệu ứng xoay
  }
}
