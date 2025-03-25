import React from 'react';

const KalmanSequentialDiagram = () => {
  // Function to generate a Gaussian curve
  const gaussian = (x, mean, variance) => {
    return Math.exp(-0.5 * Math.pow((x - mean) / Math.sqrt(variance), 2)) / (Math.sqrt(2 * Math.PI * variance));
  };
  
  // Function to generate path data for a Gaussian curve
  const generateGaussianPath = (mean, variance, xOffset, yOffset, scale = 1, fillOpacity = 0.2) => {
    const points = [];
    for (let x = mean - 3 * Math.sqrt(variance); x <= mean + 3 * Math.sqrt(variance); x += 0.1) {
      const y = gaussian(x, mean, variance);
      points.push({ x, y });
    }
    
    // Generate SVG path
    if (points.length === 0) return null;
    
    let path = `M ${xOffset + points[0].x * scale} ${yOffset - points[0].y * 50 * scale}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${xOffset + points[i].x * scale} ${yOffset - points[i].y * 50 * scale}`;
    }
    
    return (
      <>
        <path d={path} fill="none" stroke="currentColor" strokeWidth="2" />
        <path 
          d={`${path} L ${xOffset + points[points.length-1].x * scale} ${yOffset} L ${xOffset + points[0].x * scale} ${yOffset} Z`} 
          fill="currentColor" 
          fillOpacity={fillOpacity} 
          stroke="none" 
        />
      </>
    );
  };

  // Define time steps and Gaussian parameters
  const timeSteps = 3;
  const timeSpacing = 150;
  const stateScale = 15;
  
  // Parameters for the Gaussians at each step
  const gaussians = [
    // Time step 1
    { 
      predict: { mean: 5, variance: 2.5 },
      measurement: { mean: 6, variance: 1.5 },
      update: { mean: 5.6, variance: 1.0 }
    },
    // Time step 2
    { 
      predict: { mean: 6.2, variance: 1.8 },
      measurement: { mean: 7, variance: 1.5 },
      update: { mean: 6.7, variance: 0.9 }
    },
    // Time step 3
    { 
      predict: { mean: 7.1, variance: 1.5 },
      measurement: { mean: 6.5, variance: 1.2 },
      update: { mean: 6.7, variance: 0.8 }
    }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-2">Kalman Filter: Sequential Uncertainty Propagation</h3>
      
      <div className="overflow-x-auto">
        <svg viewBox="0 0 500 280" className="w-full h-auto min-w-full">
          {/* Timeline axis */}
          <line x1="50" y1="200" x2="450" y2="200" stroke="#666" strokeWidth="1" />
          
          {/* Timeline labels */}
          {[...Array(timeSteps)].map((_, i) => (
            <React.Fragment key={i}>
              <line 
                x1={75 + i * timeSpacing} 
                y1="195" 
                x2={75 + i * timeSpacing} 
                y2="205" 
                stroke="#666" 
                strokeWidth="1" 
              />
              <text 
                x={75 + i * timeSpacing} 
                y="220" 
                textAnchor="middle" 
                fontSize="12"
                fill="#666"
              >
                t{i+1}
              </text>
            </React.Fragment>
          ))}
          
          <text x="250" y="245" textAnchor="middle" fill="#666" fontSize="14">Time</text>
          
          {/* State axis label */}
          <text x="20" y="120" textAnchor="middle" fill="#666" fontSize="14" transform="rotate(-90, 20, 120)">State</text>
          
          {/* Gaussians at each time step */}
          {gaussians.map((step, i) => {
            const xCenter = 75 + i * timeSpacing;
            
            return (
              <React.Fragment key={i}>
                {/* Predict step Gaussian */}
                <g className="text-blue-500">
                  {generateGaussianPath(step.predict.mean, step.predict.variance, xCenter, 200, stateScale)}
                </g>
                
                {/* Measurement Gaussian (smaller and offset slightly) */}
                <g className="text-red-500" transform={`translate(0, -30)`}>
                  {generateGaussianPath(step.measurement.mean, step.measurement.variance, xCenter, 200, stateScale, 0.15)}
                </g>
                
                {/* Update step Gaussian */}
                <g className="text-green-600">
                  {generateGaussianPath(step.update.mean, step.update.variance, xCenter, 140, stateScale)}
                </g>
                
                {/* Labels for means */}
                <text x={xCenter + step.predict.mean * stateScale} y="210" fontSize="10" textAnchor="middle" fill="#3B82F6">x̂ₜ⁻</text>
                <text x={xCenter + step.measurement.mean * stateScale} y="155" fontSize="10" textAnchor="middle" fill="#EF4444">zₜ</text>
                <text x={xCenter + step.update.mean * stateScale} y="125" fontSize="10" textAnchor="middle" fill="#10B981">x̂ₜ</text>
                
                {/* Process arrows */}
                {i < timeSteps - 1 && (
                  <path 
                    d={`M ${xCenter + step.update.mean * stateScale} 140 
                        C ${xCenter + 60} 140, 
                          ${xCenter + 90} 200, 
                          ${xCenter + timeSpacing + gaussians[i+1].predict.mean * stateScale} 200`} 
                    fill="none" 
                    stroke="#6B7280" 
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    markerEnd="url(#arrowhead)"
                  />
                )}
                
                {/* Update arrows */}
                <line 
                  x1={xCenter} 
                  y1="200" 
                  x2={xCenter} 
                  y2="140" 
                  stroke="#6B7280" 
                  strokeWidth="1.5" 
                  strokeDasharray="none"
                  markerEnd="url(#arrowhead)"
                />
              </React.Fragment>
            );
          })}
          
          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" />
            </marker>
          </defs>
          
          {/* Legend */}
          <rect x="330" y="20" width="150" height="80" rx="4" fill="white" stroke="#e5e7eb" />
          <text x="340" y="40" fontSize="12" fontWeight="bold">Legend</text>
          
          <circle cx="350" cy="55" r="4" fill="#3B82F6" />
          <text x="360" y="58" fontSize="10">Prior/Prediction (x̂ₜ⁻)</text>
          
          <circle cx="350" cy="75" r="4" fill="#EF4444" />
          <text x="360" y="78" fontSize="10">Measurement (zₜ)</text>
          
          <circle cx="350" cy="95" r="4" fill="#10B981" />
          <text x="360" y="98" fontSize="10">Posterior/Update (x̂ₜ)</text>
        </svg>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="text-sm">
          <h4 className="font-bold mb-1">Prediction Step</h4>
          <p>The filter predicts the state at the next time step based on the system model.</p>
          <p className="text-xs text-gray-600 mt-1">This prediction includes increased uncertainty (wider distribution).</p>
        </div>
        
        <div className="text-sm">
          <h4 className="font-bold mb-1">Update Step</h4>
          <p>When a measurement arrives, it's combined with the prediction to form the posterior estimate.</p>
          <p className="text-xs text-gray-600 mt-1">The result is a more certain estimate (narrower distribution).</p>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <h4 className="font-bold mb-1">Key Insight:</h4>
        <p>Notice how the uncertainty (width of the distribution) grows during prediction steps and shrinks during update steps. 
           The Kalman filter balances between model predictions and noisy measurements to maintain optimal estimates.</p>
      </div>
    </div>
  );
};

export default KalmanSequentialDiagram;