import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import './App.css'
import KalmanFilterVisualization from './components/KalmanFilterVisualization'

function App() {
  return (
    <div className="App">
      <h1>Kalman Filter Visualization</h1>
      <KalmanFilterVisualization />
    </div>
  )
}

export default App
