const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const colors = ["#900C3F", "#FF33F6", "#C70039", "#FF5733", "#33FF57", "#3357FF", "#FFC300"];
let startAngle = 0;
let arc = Math.PI / (names.length / 2);
let spinAngle = 0
let spinSpeed = 50
let isSpin = false
let selectname = document.getElementById("selectname")
let selectnumber = document.getElementById("selectnumber")
let winnerIndex

const images = {};
const loadImage = (name) => {
  if (!images[name]) {
    console.log(name)
    const img = new Image();
    img.src = `asset/${name}.png`; // Pastikan gambar berada di folder "images" dengan nama sesuai
    images[name] = img;
  }
  return images[name];
};

function resizeCanvas() {
  const container = canvas.parentElement; // Ambil elemen container
  const size = Math.min(container.offsetWidth, 500); // Pastikan ukuran canvas tidak lebih besar dari 500px
  canvas.width = size; // Set lebar canvas sesuai ukuran container
  canvas.height = size; // Set tinggi canvas agar tetap persegi

  // Hitung ulang arc berdasarkan jumlah segmen yang tersedia
  arc = Math.PI / (names.length / 2);

  // Gambar ulang roda setelah ukuran canvas diubah
  drawWheel();
}

// Panggil resizeCanvas() saat jendela diubah ukurannya
window.addEventListener("resize", resizeCanvas);

// Panggil fungsi resizeCanvas() saat pertama kali halaman dimuat
resizeCanvas();


function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSphere()
  const radius = (canvas.width - 50) / 2;

  for (let i = 0; i < names.length; i++) {
    const angle = startAngle + i * arc;
    ctx.fillStyle = colors[i % colors.length];

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.arc(canvas.width / 2, canvas.height / 2, radius, angle, angle + arc, false);
    ctx.lineTo(canvas.width / 2, canvas.height / 2);
    ctx.fill();

    const img = loadImage(names[i]); // Ambil gambar sesuai nama
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle + arc / 2);

    ctx.drawImage(img, radius - 104, -70, 95, 95);

    // Tampilkan keterangan gambar
    ctx.textAlign = "center";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 13px Arial";
    ctx.fillText(keterangan[i], radius - 80 + 50 / 2, -25 + 50 + 20);

    ctx.restore();
  }
  drawSpinButton();
  drawArrow();
}

function drawSphere() {
  ctx.save();
  ctx.beginPath();
  ctx.arc(canvas.width/2, canvas.height/2 , (canvas.width - 30) / 2, 0, 2 * Math.PI);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.closePath();
}

function drawSpinButton() {
  spin.play();
  ctx.save();
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 40, 0, 2 * Math.PI);
  ctx.fillStyle = "#aaaaaa";
  ctx.fill();
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.closePath();

  // Teks di tombol
  ctx.fillStyle = "#777777";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("SPIN", canvas.width / 2, canvas.height / 2);
  ctx.restore();
}

// Fungsi mendeteksi klik pada tombol
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Hitung jarak klik dari tengah roda
  const distance = Math.sqrt((mouseX - canvas.width / 2) ** 2 + (mouseY - canvas.height / 2) ** 2);

  // Jika klik dalam radius tombol, mulai putaran
  if (distance <= 50) {
    if (!isSpin) {
      spinAngle = Math.random() * 2000 + 200; // Kecepatan putaran
      isSpin = true;
      rotateWheel();
    }
  }
});

function drawArrow() {
  ctx.save();
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.moveTo(canvas.width - 10, canvas.height / 2 - 10);
  ctx.lineTo(canvas.width - 10, canvas.height / 2 + 10);
  ctx.lineTo(canvas.width - 40, canvas.height / 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function rotateWheel() {
  startAngle += (spinAngle * Math.PI) / 180;

  // Fungsi dramatisasi: perlambatan lebih cepat di awal, kemudian lebih lambat
  spinAngle *= 0.98 + (Math.random() * 0.02); // Variasi perlambatan yang lebih dramatis

  drawWheel();
  

  // Jika kecepatan putaran sudah cukup lambat, hentikan putaran dan tentukan pemenang

  if (spinAngle > 0.05) {
    requestAnimationFrame(rotateWheel);
  } else {
    spin.pause();
    spin.currentTime = 0;
    determineWinner();
    isSpin = false

  }
}

function determineWinner() {
  const winningAngle = (2 * Math.PI - (startAngle % (2 * Math.PI))) % (2 * Math.PI);
  winnerIndex = Math.floor(winningAngle / arc);
  // document.getElementById("result").textContent = `Winner: ${names[winnerIndex]}`;
  
}


document.getElementById("submitButton").addEventListener("click", () => {
  if (winnerIndex != null && !isSpin) {
    if (!isSpin && names[winnerIndex]?.trim() == selectname.options[selectname.selectedIndex].value + " " + selectnumber.options[selectnumber.selectedIndex].value) {
      benar.play();
      Swal.fire({
  title: 'Benar',
  text: ' ' + selectnumber.options[selectnumber.selectedIndex].text + ' ' + selectname.options[selectname.selectedIndex].text + ' ' + keterangan[winnerIndex],
  icon: 'success'
});
    } else {
      salah.play();
      Swal.fire({
  title: 'salah',
  text: 'Tolong isi jawaban dengan benar',
  icon: 'error'
});
    }
  } else if(!isSpin){
    warning.play();
    const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});
Toast.fire({
  icon: "warning",
  title: "Spin terlebih dahulu"
});
  } else {
    warning.play();
    const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});
Toast.fire({
  icon: "warning",
  title: "Tunggu spin berhenti"
});
  }
});

// Gambar roda awal
drawWheel();

function navigateTo(url) {
  window.location.href = url;
}

function toggleMenu() {
  const navLinks = document.getElementById('nav-links');
  navLinks.classList.toggle('show');
}
function Warning() {
    var myAudio = document.getElementById("warning");  
    myAudio.volume = 0.5; 
  }
  function Alert() {
    var myAudio = document.getElementById("salah","benar");  
    myAudio.volume = 0.8; 
  }
  function Spin() {
    var myAudio = document.getElementById("spin");  
    myAudio.volume = 1; 
  }
  