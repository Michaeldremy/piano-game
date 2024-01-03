import React, { useEffect } from 'react'
import { GiMusicalScore } from 'react-icons/gi'

const LearnChords = () => {
  useEffect(() => {
    document.title = 'Piano Game | Chords'
  }, [])

  return (
    <div className='learn-chords-container'>
      <div>
        <GiMusicalScore />
      </div>
      <h1>Chords are coming soon...</h1>
    </div>
  )
}

export default LearnChords
