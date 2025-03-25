import './App.css'
import KalmanFilterVisualization from './components/KalmanFilterVisualization'
import KalmanSimpleGaussian from './components/KalmanSimpleGaussian'

function App() {
  return (
    <div className="App">
      <header className="p-4 bg-blue-600 text-white mb-6">
        <h1 className="text-2xl font-bold">Understanding the Kalman Filter</h1>
      </header>
      
      <div className="container mx-auto px-4 mb-8">
        {/* Main visualization section */}
        <KalmanFilterVisualization />
        
        {/* Gaussian diagram section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Kalman Filter: The Bayesian Perspective</h2>
          <KalmanSimpleGaussian />
        </div>
        
        {/* Additional explanatory text */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Key Concepts of the Kalman Filter</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-2">How It Works</h3>
              <p className="mb-3">
                The Kalman filter is a recursive algorithm that estimates the state of a dynamic system from a series 
                of noisy measurements. It works in two main steps:
              </p>
              
              <div className="pl-4 border-l-2 border-blue-200 mb-4">
                <h4 className="font-medium">1. Prediction Step</h4>
                <p className="text-sm">
                  The filter predicts the current state based on the previous state using a system model.
                  It also predicts how uncertain this estimate is.
                </p>
              </div>
              
              <div className="pl-4 border-l-2 border-blue-200">
                <h4 className="font-medium">2. Update Step</h4>
                <p className="text-sm">
                  When a new measurement arrives, the filter compares it to the predicted state
                  and updates the estimate. The Kalman gain determines how much to trust the prediction versus the measurement.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-2">Applications</h3>
              <p className="mb-3">
                The Kalman filter is used in numerous fields where estimating states from noisy data is important:
              </p>
              
              <ul className="list-disc pl-5 space-y-1">
                <li>Navigation systems (GPS, inertial navigation)</li>
                <li>Robotics and autonomous vehicles</li>
                <li>Aerospace (spacecraft orientation and tracking)</li>
                <li>Economics and finance (forecasting)</li>
                <li>Signal processing and control systems</li>
                <li>Computer vision (object tracking)</li>
                <li>Sensor fusion (combining data from multiple sensors)</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Mathematical Foundation</h3>
            <p>
              The Kalman filter is optimal for linear systems with Gaussian noise. It can be viewed as a Bayesian 
              estimator where the prior (prediction) and likelihood (measurement) are both Gaussian distributions.
              The posterior (updated estimate) is then also Gaussian with reduced uncertainty.
            </p>
          </div>
        </div>
      </div>
      
      <footer className="p-4 bg-gray-100 text-center text-gray-600">
        <p>Kalman Filter Visualization • Created with React and Vite</p>
      </footer>
    </div>
  )
}

export default App