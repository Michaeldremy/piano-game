import React from 'react'
import Lottie from 'lottie-react'
import PerfectScoreAnimation from '../../animations/Perfect Score.json'
import styles from '../../css/lottieAnimations.module.css'

const PerfectScore = () => {
  return (
    <div className={styles.perfectScoreAnimationContainer}>
      <Lottie
        animationData={PerfectScoreAnimation}
        className={styles.perfectScoreAnimation}
        loop={true}
      />
    </div>
  )
}

export default PerfectScore
