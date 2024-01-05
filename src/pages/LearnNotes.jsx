import React, { useState, useEffect } from 'react'
import 'react-responsive-modal/styles.css'
import { Modal } from 'react-responsive-modal'
import { GiMusicalNotes } from 'react-icons/gi'
import noteJSON from '../notes.json'
import PlusOneScore from '../components/animations/PlusOneScore'
import coinScoreSound from '../sounds/coin_noise.mp3'
import {
  playFailSound,
  playPerfectScoreSound,
  playPlusOneScoreSound,
  shuffleArray,
} from '../utils/learnNotesUtility'
import PerfectScore from '../components/animations/PerfectScore'

const LearnNotes = () => {
  const [currentImage, setCurrentImage] = useState({})
  const [userGuess, setUserGuess] = useState('')
  const [score, setScore] = useState(0)
  const [userGuessedNotes, setUserGuessedNotes] = useState([])
  const [lastGuessCorrect, setLastGuessCorrect] = useState(true)
  const [open, setOpen] = useState(false)
  const [modalNoteSelected, setModalNoteSelected] = useState(null)
  const [currentChoices, setCurrentChoices] = useState([])
  const [plusOneAnimations, setPlusOneAnimations] = useState([])

  // Load a random image when the component mounts
  useEffect(() => {
    document.title = 'Piano Game | Notes'
    setCurrentImage(selectRandomImage())
  }, [])

  useEffect(() => {
    setCurrentChoices(generateAnswerOptions(currentImage.note))
  }, [currentImage])

  useEffect(() => {
    if (open) {
      setModalNoteSelected(userGuessedNotes[0])
    }
  }, [open, userGuessedNotes])

  useEffect(() => {
    if (score === 10 && perfectScore(userGuessedNotes)) {
      playPerfectScoreSound()
    }
  }, [score, userGuessedNotes])

  const onOpenModal = () => setOpen(true)
  const onCloseModal = () => setOpen(false)

  // Function to select a random image
  const selectRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * noteJSON.length)
    return noteJSON[randomIndex]
  }

  const getRandomAnimationPosition = () => {
    const positions = [
      'plusOneScoreAnimationContainerRight',
      'plusOneScoreAnimationContainerLeft',
    ]
    return positions[Math.floor(Math.random() * positions.length)]
  }

  const generateAnswerOptions = correctNote => {
    let options = new Set()
    options.add(correctNote)

    while (options.size < 4) {
      const randomOption =
        noteJSON[Math.floor(Math.random() * noteJSON.length)].note
      options.add(randomOption)
    }

    return shuffleArray(Array.from(options))
  }

  const perfectScore = notesGuessedByUser => {
    // Check if the array is empty
    if (notesGuessedByUser.length === 0) {
      return false // Or true, based on your game logic
    }

    if (notesGuessedByUser.length === 10) {
      return notesGuessedByUser.every(note => note.answeredCorrectly === true)
    }
  }

  // Function to handle user guess
  const handleGuess = guessedNote => {
    const usersGuess = guessedNote || userGuess
    const trimmedGuess = userGuess.trim()
    if (!trimmedGuess && !guessedNote) {
      alert('Please enter a guess.')
      return
    }

    if (usersGuess.toUpperCase() === currentImage.note) {
      // Check if the next correct guess will result in a perfect score
      if (
        score === 9 &&
        perfectScore([...userGuessedNotes, { answeredCorrectly: true }])
      ) {
        // If it's a perfect score, don't trigger the coin animation
        playPerfectScoreSound() // Play perfect score sound if you have one
      } else {
        // Otherwise, play the coin animation as usual
        playPlusOneScoreSound()
        setPlusOneAnimations(prevAnimations => [
          ...prevAnimations,
          { id: Date.now(), position: getRandomAnimationPosition() },
        ])
      }
      setScore(score + 1)
      if (plusOneAnimations.length >= 3) {
        setPlusOneAnimations(prevAnimations => prevAnimations.slice(1))
      }
      setUserGuessedNotes(prev => [
        ...prev,
        { ...currentImage, guessedAnswer: usersGuess, answeredCorrectly: true },
      ])
      setCurrentImage(selectRandomImage())
      setLastGuessCorrect(true)
    } else {
      playFailSound()
      // Handle incorrect guess
      setUserGuessedNotes(prev => [
        ...prev,
        {
          ...currentImage,
          guessedAnswer: usersGuess,
          answeredCorrectly: false,
        },
      ])
      setLastGuessCorrect(false)
    }
    setUserGuess('')
  }

  // Function to handle key press on input field
  const handleKeyPress = e => {
    if (e.charCode === 13) {
      handleGuess()
    }
  }

  const resetGame = () => {
    setCurrentImage(selectRandomImage())
    setUserGuessedNotes([])
    setLastGuessCorrect(true)
    setScore(0)
    setModalNoteSelected(null)
    onCloseModal()
    setUserGuess('')
  }

  return (
    <div className='learn-notes-container'>
      <div className='flex-center'>
        <GiMusicalNotes />
        <h1>Learning Notes</h1>
      </div>
      <p>
        Simply name the note! Game ends when the score reaches 10. Discover what
        notes you missed to learn quicker!
      </p>

      <div className='flex-center score-container'>
        {!perfectScore(userGuessedNotes) && (
          <h2 className='score'>Score: {score}</h2>
        )}
        {score === 10 && perfectScore(userGuessedNotes) && <PerfectScore />}
        {plusOneAnimations.map(animation => (
          <PlusOneScore key={animation.id} positionClass={animation.position} />
        ))}
      </div>
      <div className='notes-container'>
        <div className='note-image'>
          {currentImage.src && (
            <img src={currentImage.src} alt='Guess the note' />
          )}
        </div>
        <div className='quiz-button-note-field-container'>
          <div className='quiz-buttons'>
            {score === 10 && (
              <>
                <button className='reset-button' onClick={() => resetGame()}>
                  Reset Game
                </button>
                <button
                  className='view-results-button'
                  onClick={() => onOpenModal()}
                >
                  View Results
                </button>
              </>
            )}
          </div>
          <div
            className={`${
              !lastGuessCorrect
                ? 'note-input-field-container incorrect-answer-border'
                : 'note-input-field-container'
            }`}
          >
            <h1>What note is this?</h1>
            <div className='button-options-container'>
              {currentChoices.map((option, index) => (
                <button
                  key={index}
                  disabled={score === 10}
                  onClick={() => handleGuess(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className='input-button-container'>
              <input
                type='text'
                value={userGuess}
                onChange={e => setUserGuess(e?.target?.value?.toUpperCase())}
                onKeyPress={handleKeyPress}
                disabled={score === 10}
              />
              <button
                disabled={!userGuess.trim()}
                onClick={() => handleGuess()}
              >
                ENTER
              </button>
            </div>
          </div>
          <div className='all-notes'>
            Need help with learning the notes? View the{' '}
            <a
              href='/piano-notes-chart.gif'
              target='_blank'
              referrerPolicy='no-referrer'
            >
              piano chart
            </a>{' '}
            to help memorize the notes.
          </div>
        </div>
      </div>
      <Modal
        classNames={{
          modal: 'notes-modal',
        }}
        open={open}
        onClose={() => {
          onCloseModal()
          setModalNoteSelected(null) // Reset the selected note image on modal close
        }}
        center
      >
        <div className='modal-container'>
          <h1>Results from learning notes</h1>
          <div className='guessed-notes-container'>
            {userGuessedNotes.map((note, i) => (
              <div
                key={i}
                className={
                  note.answeredCorrectly ? 'correct-answer' : 'incorrect-answer'
                }
                onClick={() => {
                  setModalNoteSelected(note)
                }}
              >
                <p>{note.note}</p>
              </div>
            ))}
          </div>
          {modalNoteSelected && (
            <div className='modal-selected-note-container'>
              <div className='modal-selected-note-image'>
                <img src={modalNoteSelected.src} alt='Selected note' />
              </div>
              <div>
                {modalNoteSelected.guessedAnswer !== modalNoteSelected.note && (
                  <>
                    <div className='answers'>
                      <h1 className='incorrect-answer'>
                        Original Answer: {modalNoteSelected.guessedAnswer}
                      </h1>
                      <h1 className='correct-answer'>
                        Correct Answer: {modalNoteSelected.note}
                      </h1>
                    </div>
                    <div className='modal-all-notes'>
                      Need help with learning the notes? View the{' '}
                      <a
                        href='/piano-notes-chart.gif'
                        target='_blank'
                        referrerPolicy='no-referrer'
                      >
                        piano chart
                      </a>{' '}
                      to help memorize the notes.
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          <button className='reset-button' onClick={() => resetGame()}>
            Play again?
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default LearnNotes
