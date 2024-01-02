import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './App.css'
import Home from './pages/Home'
import LearnNotes from './pages/LearnNotes'
import LearnChords from './pages/LearnChords'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/learn-notes',
    element: <LearnNotes />,
  },
  {
    path: '/learn-chords',
    element: <LearnChords />,
  },
])

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
