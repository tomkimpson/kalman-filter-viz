import React from 'react';

const KalmanSimpleGaussian = () => {
  // Function to generate a Gaussian curve
  const gaussian = (x, mean, variance) => {
    return Math.exp(-0.5 * Math.pow((x - mean) / Math.sqrt(variance), 2)) / (Math.sqrt(2 * Math.PI * variance));
  };
  
  // Function to generate path data for a Gaussian curve
  const generateGaussianPath = (mean, variance, color, yScale = 100) => {
    const points = [];
    // Generate points for the Gaussian curve
    for (let x = mean - 4 * Math.sqrt(variance); x <= mean + 4 * Math.sqrt(variance); x += 0.1) {
      const y = gaussian(x, mean, variance);
      points.push({ x, y });
    }
    
    // Generate SVG path
    if (points.length === 0) return null;
    
    let path = `M ${points[0].x} ${150 - points[0].y * yScale}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${150 - points[i].y * yScale}`;
    }
    
    return (
      <>
        <path d={path} fill="none" stroke={color} strokeWidth="3" />
        <path 
          d={`${path} L ${points[points.length-1].x} 150 L ${points[0].x} 150 Z`} 
          fill={color} 
          fillOpacity="0.2" 
          stroke="none" 
        />
      </>
    );
  };

  // Parameters for the three Gaussians
  const priorParams = { mean: 20, variance: 9, color: "#3B82F6" }; // Blue
  const measurementParams = { mean: 40, variance: 4, color: "#EF4444" }; // Red
  const posteriorParams = { mean: 32, variance: 2.5, color: "#10B981" }; // Green

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-2">Kalman Filter: Combining Gaussians</h3>
      
      <div className="overflow-x-auto">
        <svg viewBox="0 0 60 200" className="w-full h-auto">
          {/* Coordinate axes */}
          <line x1="5" y1="150" x2="55" y2="150" stroke="#666" strokeWidth="1" /> {/* x-axis */}
          <line x1="5" y1="150" x2="5" y2="30" stroke="#666" strokeWidth="1" /> {/* y-axis */}
          
          {/* X-axis label */}
          <text x="30" y="170" textAnchor="middle" fill="#666" fontSize="3">State Value</text>
          
          {/* Y-axis label */}
          <text x="3" y="90" textAnchor="middle" fill="#666" fontSize="3" transform="rotate(-90, 3, 90)">Probability Density</text>
          
          {/* Prior Gaussian (wider, less certain) */}
          {generateGaussianPath(priorParams.mean, priorParams.variance, priorParams.color)}
          
          {/* Measurement Gaussian (medium width) */}
          {generateGaussianPath(measurementParams.mean, measurementParams.variance, measurementParams.color)}
          
          {/* Posterior Gaussian (narrower, more certain) */}
          {generateGaussianPath(posteriorParams.mean, posteriorParams.variance, posteriorParams.color)}
          
          {/* Labels for means */}
          <text x={priorParams.mean} y="155" fontSize="2.5" textAnchor="middle" fill={priorParams.color}>Prior</text>
          <text x={measurementParams.mean} y="155" fontSize="2.5" textAnchor="middle" fill={measurementParams.color}>Measurement</text>
          <text x={posteriorParams.mean} y="155" fontSize="2.5" textAnchor="middle" fill={posteriorParams.color}>Posterior</text>
          
          {/* Annotations */}
          <text x={priorParams.mean} y="30" fontSize="2.5" textAnchor="middle" fill={priorParams.color}>
            Wide = High Uncertainty
          </text>
          <text x={posteriorParams.mean} y="20" fontSize="2.5" textAnchor="middle" fill={posteriorParams.color}>
            Narrow = Low Uncertainty
          </text>
          
          {/* Arrows showing the combination */}
          <path d={`M ${priorParams.mean + 4} 50 Q ${(priorParams.mean + posteriorParams.mean)/2} 40 ${posteriorParams.mean - 4} 50`} 
                fill="none" stroke="#6B7280" strokeWidth="0.5" markerEnd="url(#arrowhead)" />
          <path d={`M ${measurementParams.mean - 4} 50 Q ${(measurementParams.mean + posteriorParams.mean)/2} 40 ${posteriorParams.mean + 4} 50`} 
                fill="none" stroke="#6B7280" strokeWidth="0.5" markerEnd="url(#arrowhead)" />
          
          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="4"
              markerHeight="3"
              refX="2"
              refY="1.5"
              orient="auto"
            >
              <polygon points="0 0, 4 1.5, 0 3" fill="#6B7280" />
            </marker>
          </defs>
        </svg>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="text-blue-500">
          <div className="font-bold">Prior</div>
          <p className="text-xs">Initial belief state with higher uncertainty</p>
        </div>
        
        <div className="text-green-600">
          <div className="font-bold">Posterior</div>
          <p className="text-xs">Combined estimate with reduced uncertainty</p>
        </div>
        
        <div className="text-red-500">
          <div className="font-bold">Measurement</div>
          <p className="text-xs">New observation with its own uncertainty</p>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <h4 className="font-bold">Key Insight:</h4>
        <p>The Kalman filter optimally combines the prior state estimate with new measurements.
           The posterior distribution has lower uncertainty (narrower curve) than either input alone.</p>
        <p className="mt-2 text-xs text-gray-600">
          Mathematically, when combining Gaussian distributions, the result is another Gaussian
          with a mean weighted by the relative certainties of the inputs.
        </p>
      </div>
    </div>
  );
};

export default KalmanSimpleGaussian;