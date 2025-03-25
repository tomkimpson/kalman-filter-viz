import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as math from 'mathjs';
import { MathJax, MathJaxContext } from 'better-react-mathjax';



const config = {
  loader: { load: ["input/tex", "output/svg"] },
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
  },
};





const KalmanFilterVisualization = () => {
  // State for Kalman filter parameters
  const [processNoise, setProcessNoise] = useState(0.05);
  const [measurementNoise, setMeasurementNoise] = useState(0.2);
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [showEstimate, setShowEstimate] = useState(true);
  const [showTruth, setShowTruth] = useState(true);
  const [showTrueAngle, setShowTrueAngle] = useState(true);
  const [data, setData] = useState([]);
  const [currentTimeStep, setCurrentTimeStep] = useState(0);
  const animationRef = useRef(null);
  
  // Physical parameters
  const g = 9.81;  // Gravitational acceleration (m/s^2)
  const dt = 0.01;  // Time step (s)
  const simulationEndTime = 5.0;  // Seconds


  // Generate pendulum data and apply Kalman filter
  useEffect(() => {
    // Helper for random number generation
    const seedRandom = (seed) => {
      return () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };
    };
    
    const random1 = seedRandom(42);
    const random2 = seedRandom(24);
    
    // Gaussian random number generator
    const gaussian = (mean, σ, random) => {
      const u1 = random();
      const u2 = random();
      const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      return z0 * σ + mean;
    };
    
    // Function to propagate the pendulum system
    const propagatePendulum = (state, dt, σp) => {
      const [angle, angularVelocity] = state;
      
      // Add process noise to angular velocity
      const angularAcceleration = -g* Math.sin(angle) 

      // 2) Euler-Maruyama noise term: sigma * sqrt(dt) * N(0,1)
      const noiseTerm = gaussian(0, σp * Math.sqrt(dt), random1)


      // Euler integration (simple but sufficient for demonstration)
      const newAngularVelocity = angularVelocity + angularAcceleration * dt + noiseTerm;
      const newAngle = angle + angularVelocity * dt;
      
      return [newAngle, newAngularVelocity];
    };
    
    // Function to generate noisy measurement (only horizontal component)
    const generateMeasurement = (angle, σm) => {
      // Horizontal component: x = sin(angle)
      const trueX = Math.sin(angle);
      return trueX + gaussian(0, σm, random2);
    };
    
    // Kalman filter implementation for pendulum system
    const kalmanFilter = (measurement, x_prev, P_prev) => {
      // State vector: [angle, angular velocity]
      // Measurement: horizontal position
      
      // System matrices
      // State transition matrix (linearized pendulum dynamics)
      const F = [
        [1, dt],
        [-g * Math.cos(x_prev[0]) * dt, 1]  // Updated F-matrix
      ];
      
      // Measurement matrix (linearized measurement model)
      const H = [Math.cos(x_prev[0]), 0];  // Derivative of sin(θ) wrt [θ, ω]
      
      // Process noise covariance matrix (updated Q-matrix)
      const Q = [
        [(1/3) * processNoise * dt * dt * dt, (1/2) * processNoise * dt * dt],
        [(1/2) * processNoise * dt * dt, processNoise * dt]
      ];
      
      // Measurement noise covariance
      const R = measurementNoise;
      
      // Prediction step
      // Predicted state
      const x_pred = [
        x_prev[0] + x_prev[1] * dt,
        x_prev[1] - g * Math.sin(x_prev[0]) * dt
      ];
      
      // Predicted error covariance
      const P_pred = math.add(
        math.multiply(F, math.multiply(P_prev, math.transpose(F))), 
        Q
      );

      // Expected measurement
      const z_pred = Math.sin(x_pred[0]);
      
      // Measurement residual
      const y = measurement - z_pred;
      
      // Innovation covariance
      const S = math.add(
        math.multiply(H, math.multiply(P_pred, math.transpose(H))), 
        R
      );
      
      // Kalman gain
      const K = math.multiply(
        math.multiply(P_pred, math.transpose(H)),
        math.inv(S)
      );
      

      // Update step
      // Updated state estimate
      const x_est = [
        x_pred[0] + K[0] * y,
        x_pred[1] + K[1] * y
      ];
      
      const P_est = math.subtract(P_pred, math.multiply(math.multiply(K, H),P_pred))
      
      return {x_est, P_est, x_pred, P_pred};
    };
    
    // Initial state
    const initialAngle = 1.0;  
    const initialAngularVelocity = -0.1; 
    
    let trueState = [initialAngle, initialAngularVelocity];
    let x_est = [initialAngle, initialAngularVelocity];  // Initial state estimate
    let P_est = [[10.0, 0], [0, 10.0]];  // Initial error covariance
    
    // Generate data points
    const newData = [];


    
    for (let t = 0; t * dt < simulationEndTime; t++) {
      // True system propagation
      trueState = propagatePendulum(trueState, dt, Math.sqrt(processNoise));
      const [trueAngle, trueAngularVelocity] = trueState;
      
      // Generate noisy measurement of horizontal position
      const measurement_y = generateMeasurement(trueAngle, Math.sqrt(measurementNoise));
      
      // Apply Kalman filter
      const {x_est: new_x_est, P_est: new_P_est, x_pred, P_pred} = kalmanFilter(measurement_y, x_est, P_est);
      x_est = new_x_est;
      P_est = new_P_est;
      
      // Convert angle to horizontal position for visualization
      const trueX = Math.sin(trueAngle);
      const estimatedX = Math.sin(x_est[0]);
      
      // Pendulum positions for animation
      const trueY = -Math.cos(trueAngle);
      const estimatedY = -Math.cos(x_est[0]);
      
      newData.push({
        time: t * dt,
        trueX,
        measurement_y,
        estimatedX,
        trueAngle,
        estimatedAngle: x_est[0],
        trueY,
        estimatedY,
        uncertainty: Math.sqrt(P_est[0][0]),  // Standard deviation of angle estimate
      });
    }
    
    setData(newData);
    setCurrentTimeStep(0);
  }, [processNoise, measurementNoise]);

  
  return (
    <MathJaxContext config={config}>
    <div className="flex flex-col space-y-4 p-4 bg-gray-50 rounded-lg w-full">
      <h2 className="text-xl font-bold text-left">Interactive example: the noisy pendulum</h2>    
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <div className="w-full md:w-3/4 bg-white p-4 rounded-lg shadow">
          <div className="mb-6">
            {/* <h3 className="text-lg font-bold mb-2">Angle (θ) vs. Time</h3> */}
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                syncId="pendulumCharts"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  tick={false}
                  tickLine={false}
                  axisLine={true}
                  domain={['dataMin', 'dataMax']}
                />
                <YAxis 
                  label={{ 
                    value: "θ", 
                    angle: 0, 
                    position: 'left',
                  }}
                  domain={[-2.1, 2.1]}
                  ticks={[-1, -0.5, 0, 0.5, 1]}
                  tickFormatter={(value) => value.toFixed(1)}
                  allowDataOverflow={true}
                />
                <Tooltip formatter={(value) => value.toFixed(3)} labelFormatter={(value) => `Time: ${value}s`} />
                <Legend verticalAlign="top" />
                {showTrueAngle && <Line type="monotone" dataKey="trueAngle" stroke="#4CAF50" name="True Angle" dot={false} />}
                {showEstimate && <Line type="monotone" dataKey="estimatedAngle" stroke="#2196F3" name="Kalman Estimate" strokeWidth={2} dot={false} />}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            {/* <h3 className="text-lg font-bold mb-2">Horizontal Position vs. Time</h3> */}
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                syncId="pendulumCharts"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  label={{ value: 'Time (s)', position: 'bottom' }} 
                  domain={['dataMin', 'dataMax']}
                />
                <YAxis 
                  label={{ value: 'z', angle: 0, position: 'left' }} 
                  domain={[-1, 1]}
                  ticks={[-1, -0.5, 0, 0.5, 1]}
                />
                <Tooltip formatter={(value) => value.toFixed(3)} labelFormatter={(value) => `Time: ${value}s`} />
                <Legend verticalAlign="top" />
                {showTruth && <Line type="monotone" dataKey="trueX" stroke="#4CAF50" name="True Position" dot={false} />}
                {showMeasurements && <Line type="monotone" dataKey="measurement_y" stroke="#F44336" name="Measurements" dot={{ r: 1 }} />}
                {showEstimate && <Line type="monotone" dataKey="estimatedX" stroke="#2196F3" name="Kalman Estimates" strokeWidth={2} dot={false} />}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold mb-4">Filter Parameters</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Process Noise (Q)</label>
              <input
                type="range"
                min="0.001"
                max="5.0"
                step="0.1"
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
                max="0.5"
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
                  id="showTrueAngle"
                  checked={showTrueAngle}
                  onChange={() => setShowTrueAngle(!showTrueAngle)}
                  className="mr-2"
                />
                <label htmlFor="showTrueAngle" className="text-sm">True Angle</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showTruth"
                  checked={showTruth}
                  onChange={() => setShowTruth(!showTruth)}
                  className="mr-2"
                />
                <label htmlFor="showTruth" className="text-sm">True Position</label>
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
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-bold mb-2 text-left"> Stochastic Pendulum Model</h3>
        <p className="text-sm mt-1 text-left">
        Lets demonstrate the application of the Kalman filter to a noisy pendulum system. This system is based on examples 3.7 and 5.1 in         <a href="https://www.cambridge.org/core/books/bayesian-filtering-and-smoothing/C372FB31C5D9A100F8476C1B23721A67" target="_blank" rel="noopener noreferrer">Bayesian Filtering and Smoothing</a>
        by S. Särkkä.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-blue-600 text-left">Dynamical Model</h4>
            <p className="text-sm mt-1">
              To demo the filter we consider a pendulum system. The pendulum dynamics are described by:
              The pendulum dynamics are described by:
              <MathJax>{"\\[ \\frac{d^2\\theta}{dt^2} = -g\\sin(\\theta) + w(t) \\]"} </MathJax>
              <span className="block text-left">where</span>
              <MathJax>{"\\[ \\theta: \\text{ angle from vertical} \\]"}</MathJax>
              <MathJax>{"\\[ g: \\text{ gravity } (9.81 \\text{ m/s}^2) \\]"}</MathJax>
              <MathJax>{"\\[ w(t): \\text{ random (white) process noise} \\]"}</MathJax>
            </p>
          </div>
          <div>
            <h4 className="font-medium text-blue-600">Measurement Model</h4>
            <p className="text-sm mt-1">
              Suppose we only observe the horizontal component of the pendulum:
              <MathJax>{"\\[ z = \\sin(\\theta) + v(t) \\]"}</MathJax>
              <span className="block text-left">where</span>
              <MathJax>{"\\[ z: \\text{ measured horizontal position} \\]"}</MathJax>
              <MathJax>{"\\[ v(t): \\text{ random (white) measurement noise} \\]"}</MathJax>
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm mt-1 text-left">
            Please see the <a href="https://github.com/UniMelb-NSGW/SlowKalmanFilter/blob/main/notebooks/NoisyPendulum.ipynb">Jupyter notebook</a> for the additional information and accompanying Python code.
          </p>
        </div>
      </div>
    </div>
    </MathJaxContext>
  );
};

export default KalmanFilterVisualization;