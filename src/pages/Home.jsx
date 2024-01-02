import React from 'react'
import '../App.css'

const Home = () => {
  const typeOfPianoTutorials = [
    { name: 'Notes', level: 'Beginner', path: 'learn-notes' },
    { name: 'Chords', level: 'Beginner', path: 'learn-chords' },
  ]

  return (
    <div className='home'>
      <div className='piano-game-intro'>
        <h1>Piano Game</h1>
        <p>
          <span>Purpose:</span> This game is designed to help you learn piano
          notes or chords.
        </p>
      </div>
      {typeOfPianoTutorials.map((tutorial, i) => (
        <a href={tutorial.path} key={i} className='tutorial_nav'>
          <div>Learn {tutorial.name}</div>
        </a>
      ))}
    </div>
  )
}

export default Home
