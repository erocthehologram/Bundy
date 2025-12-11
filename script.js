const audioPlayer = document.getElementById("audio-player");
const trackListEl = document.getElementById("track-list");
const currentTrackNameEl = document.getElementById("current-track-name");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const playPauseBtn = document.getElementById("play-pause-btn");
const shuffleBtn = document.getElementById("shuffle-btn");
const repeatBtn = document.getElementById("repeat-btn");
const coverArtEl = document.getElementById("cover-art");

// Your 10 tracks (from Dropbox)
// If you later have cover images, put a URL in `cover:`
// e.g. cover: "https://.../mycover.jpg"
let tracks = [
  {
    name: "Elusion",
    url: "https://www.dropbox.com/scl/fi/6l7xtrbwjyoqmugv16ez8/elusion.mp3?rlkey=we3yapxu6t576a84e5j00yogp&st=ewn5x30w&raw=1",
    cover: null
  },
  {
    name: "Autonomy",
    url: "https://www.dropbox.com/scl/fi/7ppvorniwnurzmuze3pum/autonomy.mp3?rlkey=op33p12z6kuxc5096kch3qqrw&st=ejr2wpld&raw=1",
    cover: null
  },
  {
    name: "Detachment",
    url: "https://www.dropbox.com/scl/fi/560hu9slfymc9qo908ziu/detachment.mp3?rlkey=swx33pd87c7p01dmil552nh48&st=zi6nood3&raw=1",
    cover: null
  },
  {
    name: "Sovereignty",
    url: "https://www.dropbox.com/scl/fi/iyonc7egvhcwyg3lgosn1/sovereignty.mp3?rlkey=y3jipfn5dvtvfikcbfqcomqoa&st=amsw7ptf&raw=1",
    cover: null
  },
  {
    name: "Ego",
    url: "https://www.dropbox.com/scl/fi/wdd8ylq86daytl46353rh/ego.mp3?rlkey=93fy8l0s1fib3ukm0d167q2np&st=ib5atel5&raw=1",
    cover: null
  },
  {
    name: "Intrepid",
    url: "https://www.dropbox.com/scl/fi/uqyhut3mwwfchi0pxyyfu/intrepid.mp3?rlkey=vfhdptw41qbzm7t9oglku4oab&st=7qvbf21u&raw=1",
    cover: null
  },
  {
    name: "Codependency",
    url: "https://www.dropbox.com/scl/fi/hzfui0l0t2x0cy6frsevv/codependency.mp3?rlkey=2su5wvjwobd7kpmkr0lncgpqa&st=on5i75fw&raw=1",
    cover: null
  },
  {
    name: "Dovish",
    url: "https://www.dropbox.com/scl/fi/l31cq415sr1itfj7fq70h/dovish.mp3?rlkey=r2igmy5d61iqy2evgqbz244rn&st=2ppfhovz&raw=1",
    cover: null
  },
  {
    name: "Detachment II",
    url: "https://www.dropbox.com/scl/fi/xgedqojcyfw28y9a8puia/detachment-II.mp3?rlkey=77m8luuj2gmls5y835arcodq5&st=86a2wbr1&raw=1",
    cover: null
  },
  {
    name: "Venturous",
    url: "https://www.dropbox.com/scl/fi/4nj49rv3swgtwd6dtvngg/venturous.mp3?rlkey=mhttdzufebztxvpmzaf1tp8nd&st=beb6z8bw&raw=1",
    cover: null
  }
];

let currentIndex = 0;
let isShuffle = false;
// "off" = no repeat, "all" = loop playlist, "one" = repeat current song
let repeatMode = "off";

// ---------- UI RENDERING ----------

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

function updateCoverArt(track) {
  if (!coverArtEl) return;
  if (track.cover) {
    coverArtEl.style.backgroundImage = `url('${track.cover}')`;
  } else {
    // fallback to gradient background defined in CSS
    coverArtEl.style.backgroundImage = "";
  }
}

// ---------- CORE PLAYER LOGIC ----------

function setCurrentTrack(index) {
  if (index < 0 || index >= tracks.length) return;
  currentIndex = index;

  const track = tracks[currentIndex];
  audioPlayer.src = track.url;
  currentTrackNameEl.textContent = track.name;

  highlightActiveTrack();
  updateCoverArt(track);
  enableControls(true);
}

function enableControls(enabled) {
  prevBtn.disabled = !enabled;
  nextBtn.disabled = !enabled;
  playPauseBtn.disabled = !enabled;
  shuffleBtn.disabled = !enabled;
  repeatBtn.disabled = !enabled;
}

// random index different from current
function getRandomIndex() {
  if (tracks.length <= 1) return currentIndex;
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * tracks.length);
  } while (newIndex === currentIndex);
  return newIndex;
}

// ---------- BUTTON HANDLERS ----------

prevBtn.addEventListener("click", () => {
  if (tracks.length === 0) return;

  let newIndex;
  if (isShuffle) {
    newIndex = getRandomIndex();
  } else {
    newIndex = currentIndex - 1 < 0 ? tracks.length - 1 : currentIndex - 1;
  }

  setCurrentTrack(newIndex);
  audioPlayer.play();
  updatePlayPauseButton();
});

nextBtn.addEventListener("click", () => {
  if (tracks.length === 0) return;

  let newIndex;
  if (isShuffle) {
    newIndex = getRandomIndex();
  } else {
    newIndex =
      currentIndex + 1 >= tracks.length ? 0 : currentIndex + 1;
  }

  setCurrentTrack(newIndex);
  audioPlayer.play();
  updatePlayPauseButton();
});

playPauseBtn.addEventListener("click", () => {
  if (!audioPlayer.src) return;

  if (audioPlayer.paused) {
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
  updatePlayPauseButton();
});

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.textContent = isShuffle ? "Shuffle On" : "Shuffle Off";
  shuffleBtn.classList.toggle("active", isShuffle);
});

repeatBtn.addEventListener("click", () => {
  // cycle: off -> all -> one -> off
  if (repeatMode === "off") {
    repeatMode = "all";
    repeatBtn.textContent = "Repeat All";
  } else if (repeatMode === "all") {
    repeatMode = "one";
    repeatBtn.textContent = "Repeat One";
  } else {
    repeatMode = "off";
    repeatBtn.textContent = "Repeat Off";
  }
  repeatBtn.classList.toggle("active", repeatMode !== "off");
});

// ---------- AUDIO EVENTS ----------

function updatePlayPauseButton() {
  if (audioPlayer.paused) {
    playPauseBtn.textContent = "Play";
  } else {
    playPauseBtn.textContent = "Pause";
  }
}

audioPlayer.addEventListener("ended", () => {
  if (tracks.length === 0) return;

  // repeat current track
  if (repeatMode === "one") {
    audioPlayer.currentTime = 0;
    audioPlayer.play();
    return;
  }

  let newIndex;

  if (isShuffle) {
    newIndex = getRandomIndex();
  } else {
    const isLast = currentIndex === tracks.length - 1;
    if (isLast) {
      if (repeatMode === "all") {
        newIndex = 0; // loop playlist
      } else {
        // no repeat, stop playback
        updatePlayPauseButton();
        return;
      }
    } else {
      newIndex = currentIndex + 1;
    }
  }

  setCurrentTrack(newIndex);
  audioPlayer.play();
  updatePlayPauseButton();
});

// keep button text in sync
audioPlayer.addEventListener("play", updatePlayPauseButton);
audioPlayer.addEventListener("pause", updatePlayPauseButton);

// ---------- INIT ----------

if (tracks.length > 0) {
  renderTrackList();
  setCurrentTrack(0);
} else {
  enableControls(false);
}
