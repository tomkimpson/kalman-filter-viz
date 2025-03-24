import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const KalmanFilterVisualization = () => {
  // State for Kalman filter parameters
  const [processNoise, setProcessNoise] = useState(0.01);
  const [measurementNoise, setMeasurementNoise] = useState(0.1);
  const [showPrediction, setShowPrediction] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [showEstimate, setShowEstimate] = useState(true);
  const [showTruth, setShowTruth] = useState(true);
  const [data, setData] = useState([]);
  
  // Generate data using Kalman filter
  useEffect(() => {
    // Random data generation with specific seed for reproducibility
    const seedRandom = (seed) => {
      return () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };
    };
    
    const random1 = seedRandom(42);
    const random2 = seedRandom(24);
    
    // Gaussian random number generator
    const gaussian = (mean, stdDev, random) => {
      const u1 = random();
      const u2 = random();
      const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      return z0 * stdDev + mean;
    };
    
    // True state generation (e.g., position)
    const generateTrueState = (t) => {
      // Sinusoidal motion with linear trend
      return 10 * Math.sin(t / 10) + t / 30;
    };
    
    // Generate noisy measurements
    const generateMeasurement = (trueState, random) => {
      return trueState + gaussian(0, Math.sqrt(measurementNoise), random);
    };
    
    // Kalman filter implementation
    const kalmanFilter = (z, x_prev, p_prev) => {
      // Prediction step
      const x_pred = x_prev;  // Simple constant velocity model
      const p_pred = p_prev + processNoise;
      
      // Update step
      const k = p_pred / (p_pred + measurementNoise);  // Kalman gain
      const x_est = x_pred + k * (z - x_pred);
      const p_est = (1 - k) * p_pred;
      
      return { x_est, p_est, x_pred };
    };
    
    // Initial state
    let x_est = 0;
    let p_est = 1;
    
    // Generate data points
    const newData = [];
    for (let t = 0; t < 100; t++) {
      const trueState = generateTrueState(t);
      const measurement = generateMeasurement(trueState, random1);
      
      // Apply Kalman filter
      const { x_est: new_x_est, p_est: new_p_est, x_pred } = kalmanFilter(measurement, x_est, p_est);
      x_est = new_x_est;
      p_est = new_p_est;
      
      newData.push({
        time: t,
        trueState,
        measurement,
        estimate: x_est,
        prediction: x_pred,
      });
    }
    
    setData(newData);
  }, [processNoise, measurementNoise]);
  
  return (
    <div className="flex flex-col space-y-4 p-4 bg-gray-50 rounded-lg w-full">
      <h2 className="text-xl font-bold text-center">Kalman Filter Visualization</h2>
      
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <div className="w-full md:w-3/4 bg-white p-4 rounded-lg shadow">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" label={{ value: 'Time Step', position: 'bottom' }} />
              <YAxis label={{ value: 'State', angle: -90, position: 'left' }} />
              <Tooltip />
              <Legend verticalAlign="top" />
              {showTruth && <Line type="monotone" dataKey="trueState" stroke="#4CAF50" name="True State" dot={false} />}
              {showMeasurements && <Line type="monotone" dataKey="measurement" stroke="#F44336" name="Measurements" dot={{ r: 1 }} />}
              {showEstimate && <Line type="monotone" dataKey="estimate" stroke="#2196F3" name="Kalman Estimate" strokeWidth={2} dot={false} />}
              {showPrediction && <Line type="monotone" dataKey="prediction" stroke="#9C27B0" name="Prediction" strokeDasharray="5 5" dot={false} />}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold mb-4">Filter Parameters</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Process Noise (Q)</label>
              <input
                type="range"
                min="0.001"
                max="1"
                step="0.001"
                value={processNoise}
                onChange={(e) => setProcessNoise(parseFloat(e.target.value))}
                className="w-full mt-1"
              />
              <div className="text-right text-xs">{processNoise.toFixed(3)}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Measurement Noise (R)</label>
              <input
                type="range"
                min="0.001"
                max="1"
                step="0.001"
                value={measurementNoise}
                onChange={(e) => setMeasurementNoise(parseFloat(e.target.value))}
                className="w-full mt-1"
              />
              <div className="text-right text-xs">{measurementNoise.toFixed(3)}</div>
            </div>
            
            <div className="space-y-2 mt-6">
              <h4 className="font-medium">Display Options</h4>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showTruth"
                  checked={showTruth}
                  onChange={() => setShowTruth(!showTruth)}
                  className="mr-2"
                />
                <label htmlFor="showTruth" className="text-sm">True State</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showMeasurements"
                  checked={showMeasurements}
                  onChange={() => setShowMeasurements(!showMeasurements)}
                  className="mr-2"
                />
                <label htmlFor="showMeasurements" className="text-sm">Measurements</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showEstimate"
                  checked={showEstimate}
                  onChange={() => setShowEstimate(!showEstimate)}
                  className="mr-2"
                />
                <label htmlFor="showEstimate" className="text-sm">Kalman Estimate</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showPrediction"
                  checked={showPrediction}
                  onChange={() => setShowPrediction(!showPrediction)}
                  className="mr-2"
                />
                <label htmlFor="showPrediction" className="text-sm">Prediction</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-bold mb-2">How Kalman Filter Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-blue-600">Prediction Step</h4>
            <p className="text-sm mt-1">
              The filter predicts the current state based on the previous state and a system model.
              <br/><br/>
              <strong>State Prediction:</strong> x̂ₖ⁻ = Fₖx̂ₖ₋₁ + Bₖuₖ
              <br/>
              <strong>Covariance Prediction:</strong> Pₖ⁻ = FₖPₖ₋₁Fₖᵀ + Qₖ
            </p>
          </div>
          <div>
            <h4 className="font-medium text-blue-600">Update Step</h4>
            <p className="text-sm mt-1">
              The filter updates the prediction using measurements to get a better estimate.
              <br/><br/>
              <strong>Kalman Gain:</strong> Kₖ = Pₖ⁻Hₖᵀ(HₖPₖ⁻Hₖᵀ + Rₖ)⁻¹
              <br/>
              <strong>State Update:</strong> x̂ₖ = x̂ₖ⁻ + Kₖ(zₖ - Hₖx̂ₖ⁻)
              <br/>
              <strong>Covariance Update:</strong> Pₖ = (I - KₖHₖ)Pₖ⁻
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium text-blue-600">Key Concepts</h4>
          <ul className="list-disc pl-5 text-sm mt-1">
            <li><strong>Process Noise (Q):</strong> Uncertainty in the system model. Higher values make the filter more responsive but noisier.</li>
            <li><strong>Measurement Noise (R):</strong> Uncertainty in the measurements. Higher values make the filter trust measurements less.</li>
            <li><strong>Kalman Gain (K):</strong> Determines how much to trust the prediction vs. the measurement.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default KalmanFilterVisualization;
