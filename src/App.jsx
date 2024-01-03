import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import LearnNotes from './pages/LearnNotes'
import LearnChords from './pages/LearnChords'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' exact element={<Home />} />
        <Route path='/learn-notes' element={<LearnNotes />} />
        <Route path='/learn-chords' element={<LearnChords />} />
      </Routes>
    </Router>
  )
}

export default App
