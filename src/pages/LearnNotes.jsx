import React, { useState, useEffect } from 'react'
import 'react-responsive-modal/styles.css'
import { GiMusicalNotes } from 'react-icons/gi'
import noteJSON from '../notes.json'
import { PiTimerBold } from 'react-icons/pi'
import { VscDebugRestart } from 'react-icons/vsc'
import {
  playFailSound,
  playPlusOneScoreSound,
  shuffleArray,
} from '../utils/learnNotesUtility'
import ScoreToTenResultsModal from '../components/Modals/ScoreToTenResultsModal'
import gameVersions from '../gameVersions.json'
import OneMinuteTimerModal from '../components/Modals/OneMinuteTimerModal'

const LearnNotes = () => {
  const [currentImage, setCurrentImage] = useState({})
  const [userGuess, setUserGuess] = useState('')
  const [score, setScore] = useState(0)
  const [userGuessedNotes, setUserGuessedNotes] = useState([])
  const [lastGuessCorrect, setLastGuessCorrect] = useState(true)
  const [open, setOpen] = useState(false)
  const [openOneMinuteModal, setOpenOneMinuteModal] = useState(false)
  const [modalNoteSelected, setModalNoteSelected] = useState(null)
  const [currentChoices, setCurrentChoices] = useState([])
  const [plusOneAnimations, setPlusOneAnimations] = useState([])
  const [selectedGameVersion, setSelectedGameVersion] = useState()
  const [remainingTime, setRemainingTime] = useState(60)
  const [timerActive, setTimerActive] = useState(false)
  const [animationCounter, setAnimationCounter] = useState(0)

  const SCORE_TO_TEN = selectedGameVersion?.name == 'Score to 10'
  const ONE_MINUTE_TIMER = selectedGameVersion?.name === '1 Minute timer'

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
    let interval
    if (timerActive && ONE_MINUTE_TIMER) {
      interval = setInterval(() => {
        setRemainingTime(time => {
          if (time === 1) {
            clearInterval(interval)
            // End the game here
            onEndOfTimerGame()
            return 0
          }
          return time - 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [timerActive, selectedGameVersion])

  const onOpenModal = () => setOpen(true)
  const onCloseModal = () => setOpen(false)
  const onOpenOneMinuteTimerModal = () => setOpenOneMinuteModal(true)
  const onCloseOneMinuteTimerModal = () => setOpenOneMinuteModal(false)

  const gameVersionChange = selectedGameVersion => {
    setSelectedGameVersion(selectedGameVersion)
    resetGame()
  }

  // Function to select a random image
  const selectRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * noteJSON.length)
    return noteJSON[randomIndex]
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

  // Function to handle user guess
  const handleGuess = guessedNote => {
    const usersGuess = guessedNote || userGuess
    const trimmedGuess = userGuess.trim()
    if (!trimmedGuess && !guessedNote) {
      alert('Please enter a guess.')
      return
    }

    if (usersGuess.toUpperCase() === currentImage.note) {
      // Play the correct answer sound
      playPlusOneScoreSound()
      setScore(score + 1)
      triggerPlusOneAnimation()
      // Add animation for a correct guess
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
      // Handle incorrect guess
      playFailSound()
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

  const triggerPlusOneAnimation = () => {
    const randomX = Math.random() * 100 // Random position within the container
    const randomY = Math.random() * 100 // Random position within the container
    const backgroundColors = [
      'rgb(255, 246, 125)',
      'rgba(71, 227, 255, 0.89)',
      'rgb(114, 255, 114)',
      'rgb(239, 114, 255)',
      'rgb(255, 189, 114)',
    ]

    const newAnimation = {
      id: `${Date.now()}-${animationCounter}`,
      style: {
        left: `${randomX}%`,
        top: `${randomY}%`,
        opacity: 1,
        transform: 'translateY(0px)',
        backgroundColor:
          backgroundColors[Math.floor(Math.random() * backgroundColors.length)],
      },
    }

    setAnimationCounter(prevCount => prevCount + 1)
    setPlusOneAnimations(currentAnimations => [
      ...currentAnimations,
      newAnimation,
    ])
  }

  // Function to handle key press on input field
  const handleKeyPress = e => {
    if (e.charCode === 13) {
      handleGuess()
    }
  }

  const onEndOfTimerGame = () => {
    setUserGuess('')
    onOpenOneMinuteTimerModal()
    setTimerActive(false)
  }

  const resetGame = () => {
    setCurrentImage(selectRandomImage())
    setUserGuessedNotes([])
    setLastGuessCorrect(true)
    setScore(0)
    setModalNoteSelected(null)
    onCloseModal()
    onCloseOneMinuteTimerModal()
    setRemainingTime(60)
    setTimerActive(false)
    setUserGuess('')
  }

  return (
    <div
      className={
        selectedGameVersion
          ? 'learn-notes-container learn-notes-container-margin-top'
          : 'learn-notes-container'
      }
    >
      <div className='flex-center'>
        <GiMusicalNotes className='header-icon' />
        <h1 className='header-title'>Learning Notes</h1>
      </div>

      <div className='game-version-container'>
        {gameVersions.map((version, i) => (
          <div key={i} className='flex-center'>
            <button
              className={`${
                version?.name === selectedGameVersion?.name
                  ? 'game-version-selected'
                  : 'game-versions-button'
              }`}
              onClick={() => gameVersionChange(version)}
            >
              {version?.name}
            </button>
          </div>
        ))}
      </div>

      <div
        className='flex-center score-container'
        style={!selectedGameVersion ? { display: 'none' } : {}}
      >
        <div className='flex-center'>
          {ONE_MINUTE_TIMER && (
            <h2 className='time-remaining font-open-sans'>
              {remainingTime}
              <span style={{ textTransform: 'lowercase' }}>s</span>
            </h2>
          )}
          <h2 className='score font-open-sans'>Score: {score}</h2>
        </div>
      </div>
      {/* Animations */}
      <div className='animations-container'>
        {plusOneAnimations.map(animation => (
          <div
            key={animation.id}
            className='animation-plus-one'
            style={animation.style}
          >
            +1
          </div>
        ))}
      </div>
      {ONE_MINUTE_TIMER && (
        <div className='one-minute-timer-options-container'>
          <div className='one-minute-timer-options flex-center'>
            <div
              className='restart-timer flex-center'
              onClick={() => {
                setRemainingTime(60)
                setScore(0)
                setTimerActive(false)
              }}
            >
              <VscDebugRestart />
              <p>RESTART</p>
            </div>
            <div
              className='start-timer flex-center'
              onClick={() => {
                setRemainingTime(60)
                setScore(0)
                setTimerActive(true)
              }}
            >
              <PiTimerBold />
              <p>START</p>
            </div>
          </div>
        </div>
      )}
      {selectedGameVersion && (
        <div className='notes-container'>
          <div className='note-image'>
            {currentImage.src && (
              <img src={currentImage.src} alt='Guess the note' />
            )}
          </div>
          <div className='quiz-button-note-field-container'>
            <div className='quiz-buttons'>
              {score === 10 && SCORE_TO_TEN && (
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
              {ONE_MINUTE_TIMER && remainingTime == 0 && (
                <button
                  className='view-results-button'
                  onClick={() => onOpenOneMinuteTimerModal()}
                >
                  View Results
                </button>
              )}
            </div>
            <div
              className={`${
                !lastGuessCorrect
                  ? 'note-input-field-container incorrect-answer-border'
                  : 'note-input-field-container'
              }`}
            >
              <h1 className='what-note-header'>
                {SCORE_TO_TEN ? 'What note is this?' : 'It is timed, go!'}
              </h1>
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
                  disabled={
                    (SCORE_TO_TEN && score === 10) || remainingTime === 0
                  }
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
      )}
      <OneMinuteTimerModal
        openOneMinuteModal={openOneMinuteModal}
        setOpenOneMinuteModal={setOpenOneMinuteModal}
        onCloseOneMinuteTimerModal={onCloseOneMinuteTimerModal}
        userGuessedNotes={userGuessedNotes}
        resetGame={resetGame}
      />
      <ScoreToTenResultsModal
        open={open}
        setModalNoteSelected={setModalNoteSelected}
        onCloseModal={onCloseModal}
        userGuessedNotes={userGuessedNotes}
        modalNoteSelected={modalNoteSelected}
        resetGame={resetGame}
      />
    </div>
  )
}

export default LearnNotes
