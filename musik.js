const MUSIC_FILE = 'assets/media/musik.mp3';

const audio = new Audio(MUSIC_FILE);
audio.preload = 'auto';
audio.loop = true;
audio.volume = 0.35;

let isPlaying = false;

const startOverlay = document.getElementById('musicStart');
const playBtn = document.getElementById('musicPlay');
const muteBtn = document.getElementById('musicMute');
const volumeEl = document.getElementById('musicVolume');

async function startMusic(){
  try{
    await audio.play();
    isPlaying = true;
    document.body.classList.add('music-unlocked');
    window.setTimeout(()=> startOverlay?.setAttribute('hidden', ''), 850);
    if(playBtn) playBtn.textContent = '❚❚';
  } catch(err){
    document.body.classList.remove('music-unlocked');
    startOverlay?.removeAttribute('hidden');
  }
}

function pauseMusic(){
  audio.pause();
  isPlaying = false;
  if(playBtn) playBtn.textContent = '▶';
}

function toggleMusic(){
  if(isPlaying) pauseMusic();
  else startMusic();
}

startOverlay?.addEventListener('click', startMusic);
startOverlay?.addEventListener('keydown', event=>{
  if(event.key === 'Enter' || event.key === ' '){
    event.preventDefault();
    startMusic();
  }
});

document.addEventListener('keydown', event=>{
  if(!document.body.classList.contains('music-unlocked') && event.key === 'Enter'){
    startMusic();
  }
});

playBtn?.addEventListener('click', toggleMusic);

muteBtn?.addEventListener('click', ()=>{
  audio.muted = !audio.muted;
  muteBtn.textContent = audio.muted ? 'Muted' : 'Mute';
});

volumeEl?.addEventListener('input', ()=>{
  audio.volume = Number(volumeEl.value) / 100;
  if(audio.volume > 0 && audio.muted){
    audio.muted = false;
    if(muteBtn) muteBtn.textContent = 'Mute';
  }
});

startMusic();
