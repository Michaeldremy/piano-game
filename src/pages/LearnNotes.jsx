import React, { useState, useEffect } from 'react'
import 'react-responsive-modal/styles.css'
import { Modal } from 'react-responsive-modal'
import { GiMusicalNotes } from 'react-icons/gi'
import noteJSON from '../notes.json'
import PlusOneScore from '../components/animations/PlusOneScore'
import coinScoreSound from '../sounds/coin_noise.mp3'

const LearnNotes = () => {
  const [currentImage, setCurrentImage] = useState({})
  const [userGuess, setUserGuess] = useState('')
  const [score, setScore] = useState(0)
  const [userGuessedNotes, setUserGuessedNotes] = useState([])
  const [lastGuessCorrect, setLastGuessCorrect] = useState(true)
  const [open, setOpen] = useState(false)
  const [modalNoteSelected, setModalNoteSelected] = useState(null)
  const [displayPlusOneScoreAnimation, setDisplayPlusOneScoreAnimation] =
    useState(false)
  const [
    animationPositionClassOfPlusOneScore,
    setAnimationPositionClassOfPlusOneScore,
  ] = useState('')
  const [currentChoices, setCurrentChoices] = useState([])
  const onOpenModal = () => setOpen(true)
  const onCloseModal = () => setOpen(false)

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

  // Function to select a random image
  const selectRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * noteJSON.length)
    return noteJSON[randomIndex]
  }

  const playSound = () => {
    let audio = new Audio(coinScoreSound).play()
    audio.volume = 0.5
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

    return Array.from(options)
  }

  // Function to handle user guess
  const handleGuess = guessedNote => {
    // Trim the input and check if it's not empty
    const usersGuess = guessedNote || userGuess

    const trimmedGuess = userGuess.trim()
    if (!trimmedGuess && !guessedNote) {
      alert('Please enter a guess.')
      return
    }

    if (usersGuess.toUpperCase() === currentImage.note) {
      playSound()
      setScore(score + 1)
      setDisplayPlusOneScoreAnimation(true)
      setAnimationPositionClassOfPlusOneScore(getRandomAnimationPosition())
      setTimeout(() => {
        setDisplayPlusOneScoreAnimation(false)
      }, 1300)
      setUserGuessedNotes(prev => [
        ...prev,
        { ...currentImage, guessedAnswer: usersGuess, answeredCorrectly: true },
      ])
      setCurrentImage(selectRandomImage())
      setLastGuessCorrect(true)
    } else {
      // User guessed incorrectly
      setUserGuessedNotes(prev => [
        ...prev,
        {
          ...currentImage,
          guessedAnswer: usersGuess,
          answeredCorrectly: false,
        },
      ])
      setLastGuessCorrect(false) // Indicate that the last guess was incorrect
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
        <h2 className='score'>Score: {score}</h2>
        {displayPlusOneScoreAnimation && (
          <PlusOneScore positionClass={animationPositionClassOfPlusOneScore} />
        )}
      </div>
      <div className='notes-container'>
        {/* Lottie Animation */}

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
          <div className='note-input-field-container'>
            <h1>What note is this?</h1>
            <div className='button-options-container'>
              {currentChoices.map((option, index) => (
                <button key={index} onClick={() => handleGuess(option)}>
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
            {!lastGuessCorrect && (
              <p className='incorrect-answer'>Incorrect, try again!</p>
            )}
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
                <div className='answers'>
                  {modalNoteSelected.guessedAnswer == modalNoteSelected.note ? (
                    <h1 className='correct-answer'>
                      Correct Answer: {modalNoteSelected.note}
                    </h1>
                  ) : (
                    <>
                      <h1 className='incorrect-answer'>
                        Original Answer: {modalNoteSelected.guessedAnswer}
                      </h1>
                      <h1 className='correct-answer'>
                        Correct Answer: {modalNoteSelected.note}
                      </h1>
                    </>
                  )}
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
