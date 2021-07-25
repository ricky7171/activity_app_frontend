import { BEEP_SOUND } from "../../../config";

export function playAudio(path) {
    var audio = new Audio;
    audio.pause();
    audio = new Audio(path);
    audio.play();
    return audio;
}

export function playBeepSound() {
    return playAudio(BEEP_SOUND);
}