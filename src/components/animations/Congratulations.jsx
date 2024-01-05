import React from 'react'
import Lottie from 'lottie-react'
import CongratulationsAnimation from '../../animations/Congratulations.json'
import styles from '../../css/lottieAnimations.module.css'

const Congratulations = () => {
  return (
    <div className='flex-center'>
      <Lottie
        animationData={CongratulationsAnimation}
        className='congratulations-animation'
      />
    </div>
  )
}

export default Congratulations
