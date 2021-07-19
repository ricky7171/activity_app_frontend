export function playAudio(path) {
    var audio = new Audio;
    audio.pause();
    audio = new Audio(path);
    audio.play();
    return audio;
}

export function playBeepSound() {
    return playAudio('/assets/beep_sound.mp3');
}