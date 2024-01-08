import React from 'react'
import Modal from 'react-responsive-modal'

const ScoreToTenResultsModal = ({
  open,
  setModalNoteSelected,
  onCloseModal,
  userGuessedNotes,
  modalNoteSelected,
  resetGame,
}) => {
  return (
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
                <div className='answers-container'>
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
                </div>
              )}
            </div>
          </div>
        )}
        <button className='reset-button' onClick={() => resetGame()}>
          Play again?
        </button>
      </div>
    </Modal>
  )
}

export default ScoreToTenResultsModal
