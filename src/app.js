var dataAlarm = [];
var counter = 0;
var interval;
init();

/**
 * inisialisasi aplikasi
 */
async function init() {
  let data = localStorage.getItem("dataAlarm");
  if (data) {
    dataAlarm = JSON.parse(data);
  }
  setInterval(() => {
    let playedAlarm = -1;
    dataAlarm.forEach((item, index) => {
      let dt = new Date();
      let alarmTime = new Date(item).toLocaleString().substr(0, 16);
      let currentTime = dt.toLocaleString().substr(0, 16);
      if (alarmTime == currentTime) {
        playAudio();
        playedAlarm = index;
      }
    });
    if (playedAlarm >= 0) {
      dataAlarm.splice(playedAlarm, 1);
      localStorage.setItem("dataAlarm", JSON.stringify(dataAlarm));
    }
    refresh();
  }, 5000);
  refresh();
}

/**
 * refresh alarm list
 */
function refresh() {
  let alarmList = document.getElementById("alarm-list");
  alarmList.innerHTML = "";
  if (dataAlarm.length) {
    dataAlarm.forEach((item) => {
      let li = document.createElement("LI");
      let span = document.createElement("SPAN");
      span.classList.add("close-icon");
      let spanText = document.createTextNode("X");
      span.appendChild(spanText);
      let liText = document.createTextNode(new Date(item).toLocaleString());
      li.appendChild(liText);
      li.appendChild(span);
      alarmList.appendChild(li);
      span.addEventListener("click", function () {
        let alarmTime = this.parentNode.childNodes[0];
        deleteList(alarmTime.wholeText);
      });
    });
  } else {
    let node = document.createElement("LI");
    let textnode = document.createTextNode("Belum ada Alarm");
    node.appendChild(textnode);
    alarmList.appendChild(node);
  }
}

/**
 * delete alarm list
 */
function deleteList(textDate) {
  let deletedIndex = -1;
  dataAlarm.forEach((item, index) => {
    let alarmTime = new Date(item).toLocaleString().substr(0, 16);
    if (alarmTime == textDate.substr(0, 16)) {
      deletedIndex = index;
    }
  });
  if (deletedIndex >= 0) {
    dataAlarm.splice(deletedIndex, 1);
    localStorage.setItem("dataAlarm", JSON.stringify(dataAlarm));
  }
  refresh();
}

/**
 * putar suara alarm
 */
function playAudio() {
  const alarmSound = document.getElementById("alarm-sound");
  alarmSound.addEventListener("ended", function () {
    let img = document.getElementById("alarm-image");
    img.style.transform = "scale(1)";
    clearInterval(interval);
    counter = 0;
  });
  alarmSound.play().then(() => scaleImage());
}

/**
 * ubah ukuran image
 */
function scaleImage() {
  interval = setInterval(() => {
    counter++;
    let img = document.getElementById("alarm-image");
    if (counter % 2 == 0) {
      img.style.transform = "scale(1.1)";
    } else {
      img.style.transform = "scale(.9)";
    }
  }, 300);
}

/**
 * menampilkan error pada inputan
 */
function setError(text) {
  var textError = document.getElementById("text-error");
  textError.innerHTML = text;
  textError.style.display = "block";
  setTimeout(function () {
    textError.style.display = "none";
  }, 5000);
}

/**
 * tambah alarm
 */
function tambahAlarm() {
  let dateInput = document.getElementById("tanggal-input");
  let timeInput = document.getElementById("waktu-input");
  if (!dateInput.value || !timeInput.value) {
    setError("Tanggal dan Waktu harus diinput!");
    return;
  }
  let newAlarm = new Date(`${dateInput.value}T${timeInput.value}:00`);

  if (new Date() > newAlarm) {
    setError("Alarm harus diwaktu yang akan datang!");
    return;
  }

  let sameTime = false;
  dataAlarm.forEach((item) => {
    if (new Date(item).toLocaleString() == newAlarm.toLocaleString())
      sameTime = true;
  });

  if (sameTime) {
    setError("Alarm sudah ada!");
    return;
  }

  dataAlarm.push(newAlarm);
  localStorage.setItem("dataAlarm", JSON.stringify(dataAlarm));
  refresh();
}
