const fileInput = document.getElementById("file-input");
const audioPlayer = document.getElementById("audio-player");
const trackListEl = document.getElementById("track-list");
const currentTrackNameEl = document.getElementById("current-track-name");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const playPauseBtn = document.getElementById("play-pause-btn");

let tracks = []; // { file, url, name }
let currentIndex = -1;

// Handle file selection
fileInput.addEventListener("change", (event) => {
  const files = Array.from(event.target.files || []);

  // Release previous object URLs
  tracks.forEach((t) => URL.revokeObjectURL(t.url));

  tracks = files.map((file) => ({
    file,
    url: URL.createObjectURL(file),
    name: file.name,
  }));

  renderTrackList();

  if (tracks.length > 0) {
    setCurrentTrack(0);
    enableControls(true);
  } else {
    resetPlayer();
  }
});

// Render playlist UI
function renderTrackList() {
  trackListEl.innerHTML = "";

  tracks.forEach((track, index) => {
    const li = document.createElement("li");
    li.className = "track-item";
    li.dataset.index = index;

    const indexSpan = document.createElement("span");
    indexSpan.className = "track-index";
    indexSpan.textContent = index + 1;

    const nameSpan = document.createElement("span");
    nameSpan.className = "track-name";
    nameSpan.textContent = track.name;

    const playBtn = document.createElement("button");
    playBtn.className = "track-play-btn";
    playBtn.textContent = "Play";
    playBtn.addEventListener("click", () => {
      setCurrentTrack(index);
      audioPlayer.play();
      updatePlayPauseButton();
    });

    li.appendChild(indexSpan);
    li.appendChild(nameSpan);
    li.appendChild(playBtn);

    trackListEl.appendChild(li);
  });

  highlightActiveTrack();
}

// Set current track by index
function setCurrentTrack(index) {
  if (index < 0 || index >= tracks.length) return;
  currentIndex = index;

  const track = tracks[currentIndex];
  audioPlayer.src = track.url;
  currentTrackNameEl.textContent = track.name;

  highlightActiveTrack();
}

// Highlight the active track list item
function highlightActiveTrack() {
  const items = trackListEl.querySelectorAll(".track-item");
  items.forEach((item) => {
    const idx = Number(item.dataset.index);
    if (idx === currentIndex) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// Enable / disable player controls
function enableControls(enabled) {
  prevBtn.disabled = !enabled;
  nextBtn.disabled = !enabled;
  playPauseBtn.disabled = !enabled;
}

// Reset when no tracks
function resetPlayer() {
  currentIndex = -1;
  audioPlayer.removeAttribute("src");
  currentTrackNameEl.textContent = "Nothing yet";
  enableControls(false);
}

// Prev / next buttons
prevBtn.addEventListener("click", () => {
  if (tracks.length === 0) return;
  const newIndex =
    currentIndex - 1 < 0 ? tracks.length - 1 : currentIndex - 1;
  setCurrentTrack(newIndex);
  audioPlayer.play();
  updatePlayPauseButton();
});

nextBtn.addEventListener("click", () => {
  if (tracks.length === 0) return;
  const newIndex =
    currentIndex + 1 >= tracks.length ? 0 : currentIndex + 1;
  setCurrentTrack(newIndex);
  audioPlayer.play();
  updatePlayPauseButton();
});

// Play / pause toggle
playPauseBtn.addEventListener("click", () => {
  if (!audioPlayer.src) return;

  if (audioPlayer.paused) {
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
  updatePlayPauseButton();
});

// Update play/pause button label based on state
function updatePlayPauseButton() {
  if (audioPlayer.paused) {
    playPauseBtn.textContent = "Play";
  } else {
    playPauseBtn.textContent = "Pause";
  }
}

// When song ends, move to next
audioPlayer.addEventListener("ended", () => {
  if (tracks.length === 0) return;
  const newIndex =
    currentIndex + 1 >= tracks.length ? 0 : currentIndex + 1;
  setCurrentTrack(newIndex);
  audioPlayer.play();
  updatePlayPauseButton();
});

// Keep button in sync if user uses built-in audio controls
audioPlayer.addEventListener("play", updatePlayPauseButton);
audioPlayer.addEventListener("pause", updatePlayPauseButton);