const moveSound = require('../assets/move.wav');
const beginSound = require('../assets/begin.wav');
const endSound = require('../assets/end.wav');
const backgroundMusic = require('../assets/cryptic.mp3');
const backgroundMusicAudio = new Audio(backgroundMusic);
var audioClick;

playSound = sound => {
  if (audioClick) {
    audioClick.pause();
    audioClick.currentTime = 0;
    audioClick =null;
  }
  //TODO:Do we really need to destroy and reconstruct every time?
  let audio = new Audio(sound);
  audioClick = audio;
  audio.play();
};

playAudio = audio => {
  audio.play();
};
//todo: remove
//is this necessary? TODO.
playAudioLoop = audio => {
  let promise = audio.play();
  if (promise !== undefined) {
    promise.then(_ => {
      audio.type = "audio/mpeg"
      audio.loop = true;
    }).catch(error => {

    });
  }
}

stopAudio = audio => {
  audio.pause();
  audio.currentTime = 0;
};

stopSound = audio => {
  audio.pause();
  audio.currentTime = 0;
};

playMoveSound = () => {
  playSound(moveSound);
};

playBeginSound = () => {
  playSound(beginSound);
};

playEndSound = () => {
  playSound(endSound);
};

playBackgroundMusic = () => {
  playAudioLoop(backgroundMusicAudio);
};

stopBackgroundMusic = () => {
  stopSound(backgroundMusicAudio);
};

playPostGameMusic = () => {
  playAudio(postGameMusicAudio);
};

module.exports = {
  playMoveSound,
  playBeginSound,
  playEndSound,
  playBackgroundMusic
};
