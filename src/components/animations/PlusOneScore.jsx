import React from 'react'
import Lottie from 'lottie-react'
import Coin from '../../animations/Coin.json'
import styles from '../../css/lottieAnimations.module.css'

const PlusOneScore = ({ positionClass }) => {
  const containerClass = `${styles.plusOneScoreAnimationContainer} ${styles[positionClass]}`

  return (
    <div className={containerClass}>
      <Lottie
        animationData={Coin}
        className={styles.plusOneScoreAnimation}
        loop={false}
      />
    </div>
  )
}

export default PlusOneScore
