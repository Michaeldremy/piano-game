import React from 'react'
import Modal from 'react-responsive-modal'

const OneMinuteTimerModal = ({
  openOneMinuteModal,
  onCloseOneMinuteTimerModal,
  userGuessedNotes,
  resetGame,
}) => {
  return (
    <Modal
      classNames={{
        modal: 'notes-modal',
      }}
      open={openOneMinuteModal}
      onClose={() => onCloseOneMinuteTimerModal()}
      center
    >
      <div className='one-minute-timer-modal-container'>
        <h1>Results from 1 minute timer</h1>
      </div>
      <div className='notes-guess-container'>
        <div className='how-many-notes-guess-container'>
          <h2>You guessed {userGuessedNotes.length} notes in 60 seconds!</h2>
          <div className='save-leaderboards-container'>
            <p>
              Would you like to save your score to the Piano Game leaderboards?
            </p>
            <div className='save-leaderboard-buttons'>
              <button className='game-button-global save-to-leaderboards-button'>
                Yes
              </button>
              <button className='game-button-global dont-save-to-leaderboards-button'>
                No
              </button>
            </div>
          </div>
        </div>
        <button className='reset-button' onClick={() => resetGame()}>
          Play again?
        </button>
      </div>
    </Modal>
  )
}

export default OneMinuteTimerModal
