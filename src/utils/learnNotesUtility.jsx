import perfectScoreSound from '../sounds/perfect_score.mp3'
import coinScoreSound from '../sounds/coin_noise.mp3'
import failSound from '../sounds/fail_sound.mp3'

export const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export const playPerfectScoreSound = () => {
  new Audio(perfectScoreSound).play()
}

export const playPlusOneScoreSound = () => {
  new Audio(coinScoreSound).play()
}

export const playFailSound = () => {
  new Audio(failSound).play()
}
