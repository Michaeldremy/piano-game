import React, { useState, useEffect } from 'react'
import 'react-responsive-modal/styles.css'
import { Modal } from 'react-responsive-modal'
import noteJSON from '../notes.json'

const LearnNotes = () => {
  const [currentImage, setCurrentImage] = useState({})
  const [userGuess, setUserGuess] = useState('')
  const [score, setScore] = useState(0)
  const [userGuessedNotes, setUserGuessedNotes] = useState([])
  const [lastGuessCorrect, setLastGuessCorrect] = useState(true)
  const [open, setOpen] = useState(false)
  const [modalNoteSelected, setModalNoteSelected] = useState(null)

  const onOpenModal = () => setOpen(true)
  const onCloseModal = () => setOpen(false)

  console.log('Score: ', score)
  console.log(userGuessedNotes)

  // Function to select a random image
  const selectRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * noteJSON.length)
    return noteJSON[randomIndex]
  }

  // Load a random image when the component mounts
  useEffect(() => {
    setCurrentImage(selectRandomImage())
  }, [])

  useEffect(() => {
    if (open) {
      setModalNoteSelected(userGuessedNotes[0])
    }
  }, [open, userGuessedNotes])

  // Function to handle user guess
  const handleGuess = () => {
    // Trim the input and check if it's not empty
    const trimmedGuess = userGuess.trim()
    if (!trimmedGuess) {
      alert('Please enter a guess.')
      return
    }

    if (userGuess.toUpperCase() === currentImage.note) {
      // User guessed correctly
      setScore(score + 1)
      setUserGuessedNotes(prev => [
        ...prev,
        { ...currentImage, guessedAnswer: userGuess, answeredCorrectly: true },
      ])
      setCurrentImage(selectRandomImage())
      setLastGuessCorrect(true)
    } else {
      // User guessed incorrectly
      setUserGuessedNotes(prev => [
        ...prev,
        { ...currentImage, guessedAnswer: userGuess, answeredCorrectly: false },
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
      <h1>Learning Notes</h1>
      <p>
        Simply name the note! Game is over once the score reaches 10. Discover
        what notes you missed to learn quicker!
      </p>
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

      <div className='notes-container'>
        <div className='note-image'>
          {currentImage.src && (
            <img src={currentImage.src} alt='Guess the note' />
          )}
        </div>
        <div>
          <div className='note-input-field-container'>
            <h2 className='score'>Score: {score}/10</h2>
            <h1>What note is this?</h1>
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
