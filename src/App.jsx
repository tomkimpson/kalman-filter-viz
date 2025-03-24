import './App.css'
import KalmanFilterVisualization from './components/KalmanFilterVisualization'

function App() {
  return (
    <div className="App">
      <header className="p-4 bg-blue-600 text-white mb-6">
        <h1 className="text-2xl font-bold">Understanding the Kalman Filter</h1>
      </header>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left side: Explanatory text */}
          <div className="lg:w-1/3 order-2 lg:order-1">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-bold mb-4 text-blue-700">What is a Kalman Filter?</h2>
              <p className="mb-4">
                The Kalman filter is an algorithm that uses a series of measurements observed over time, 
                containing noise and other inaccuracies, and produces estimates of unknown variables that 
                tend to be more accurate than those based on a single measurement alone.
              </p>
              <p className="mb-4">
                It operates recursively on streams of noisy input data to produce a statistically optimal 
                estimate of the underlying system state.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-bold mb-4 text-blue-700">How It Works</h2>
              <h3 className="font-semibold text-blue-600 mb-2">1. Prediction Step</h3>
              <p className="mb-3 pl-4 border-l-2 border-blue-300">
                The filter predicts the current state based on the previous state estimation and a mathematical model.
                <br/><br/>
                <strong>State Prediction:</strong> x̂ₖ⁻ = Fₖx̂ₖ₋₁ + Bₖuₖ
                <br/>
                <strong>Covariance Prediction:</strong> Pₖ⁻ = FₖPₖ₋₁Fₖᵀ + Qₖ
              </p>
              
              <h3 className="font-semibold text-blue-600 mb-2">2. Update Step</h3>
              <p className="mb-3 pl-4 border-l-2 border-blue-300">
                The filter updates the prediction based on current measurements to get a more accurate estimate.
                <br/><br/>
                <strong>Kalman Gain:</strong> Kₖ = Pₖ⁻Hₖᵀ(HₖPₖ⁻Hₖᵀ + Rₖ)⁻¹
                <br/>
                <strong>State Update:</strong> x̂ₖ = x̂ₖ⁻ + Kₖ(zₖ - Hₖx̂ₖ⁻)
                <br/>
                <strong>Covariance Update:</strong> Pₖ = (I - KₖHₖ)Pₖ⁻
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4 text-blue-700">Real World Applications</h2>
              <ul className="list-disc pl-5">
                <li>Navigation systems (GPS)</li>
                <li>Robotic motion planning</li>
                <li>Computer vision tracking</li>
                <li>Spacecraft orientation</li>
                <li>Economic forecasting</li>
                <li>Autopilot systems</li>
              </ul>
            </div>
          </div>
          
          {/* Right side: Visualization */}
          <div className="lg:w-2/3 order-1 lg:order-2">
            <KalmanFilterVisualization />
          </div>
        </div>
      </div>
      
      <footer className="mt-12 p-4 bg-gray-100 text-center text-gray-600">
        <p>Kalman Filter Visualization • Created with React and Vite</p>
      </footer>
    </div>
  )
}

export default App