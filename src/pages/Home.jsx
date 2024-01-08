import React from 'react'
import { Link } from 'react-router-dom'
import { GiMusicalNotes } from 'react-icons/gi'
import { GiMusicalScore } from 'react-icons/gi'
import '../App.css'

const Home = () => {
  const typeOfPianoTutorials = [
    {
      name: 'Notes',
      level: 'Beginner',
      path: 'learn-notes',
      icon: <GiMusicalNotes />,
    },
    {
      name: 'Chords',
      level: 'Beginner',
      path: 'learn-chords',
      icon: <GiMusicalScore />,
    },
  ]

  return (
    <div className='home'>
      <div className='piano-game-intro'>
        <div className='piano-intro-heading'>
          <img src='/piano-icon.png' alt='' />
          <h1>Piano Game</h1>
        </div>
        <p>Designed to help you learn notes and chords.</p>
      </div>
      {typeOfPianoTutorials.map((tutorial, i) => (
        <Link
          to={tutorial.path}
          key={i}
          className='game-button-global tutorial-nav'
        >
          <div className='flex-center'>
            <div className='tutorial-icon'>{tutorial.icon}</div>
            <p className='tutorial-name'>{tutorial.name}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default Home
