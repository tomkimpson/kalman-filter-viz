import React, { useState, useEffect } from 'react';

const KalmanGaussianDiagram = () => {
  // State for the diagram parameters
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  
  // Parameters for Gaussians
  const priorMean = 5;
  const priorVariance = 2;
  const measurementMean = 7;
  const measurementVariance = 1.5;
  const posteriorMean = 6.2;  // This would be calculated by the Kalman filter
  const posteriorVariance = 0.8;  // This would be calculated by the Kalman filter
  
  // Function to generate a Gaussian curve
  const gaussian = (x, mean, variance) => {
    return Math.exp(-0.5 * Math.pow((x - mean) / Math.sqrt(variance), 2)) / (Math.sqrt(2 * Math.PI * variance));
  };
  
  // Function to generate path data for the Gaussian curve
  const generateGaussianPath = (mean, variance, color, xOffset = 0, yOffset = 0, scale = 1) => {
    const points = [];
    for (let x = mean - 4 * Math.sqrt(variance); x <= mean + 4 * Math.sqrt(variance); x += 0.1) {
      const y = gaussian(x, mean, variance);
      points.push({ x, y });
    }
    
    // Generate SVG path
    if (points.length === 0) return '';
    
    let path = `M ${xOffset + points[0].x * scale} ${yOffset - points[0].y * 50 * scale}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${xOffset + points[i].x * scale} ${yOffset - points[i].y * 50 * scale}`;
    }
    
    return (
      <>
        <path d={path} fill="none" stroke={color} strokeWidth="3" />
        <path d={`${path} L ${xOffset + points[points.length-1].x * scale} ${yOffset} L ${xOffset + points[0].x * scale} ${yOffset} Z`} 
              fill={color} fillOpacity="0.2" stroke="none" />
      </>
    );
  };
  
  // Animation effect
  useEffect(() => {
    let animationFrame;
    
    const animate = () => {
      setTime(prevTime => {
        const newTime = (prevTime + 0.01) % 1;
        return newTime;
      });
      animationFrame = requestAnimationFrame(animate);
    };
    
    if (playing) {
      animationFrame = requestAnimationFrame(animate);
    }
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [playing]);
  
  // Calculate positions for animation
  const animatedPriorMean = priorMean;
  const animatedMeasurementMean = measurementMean;
  
  // Interpolate for posterior based on animation time
  const animatedPosteriorMean = priorMean + (posteriorMean - priorMean) * time;
  const animatedPosteriorVariance = priorVariance + (posteriorVariance - priorVariance) * time;

  // Function to render a legend item
  const LegendItem = ({ color, label }) => (
    <div className="flex items-center mr-4">
      <div className="w-4 h-4 mr-1" style={{ backgroundColor: color }}></div>
      <span className="text-sm">{label}</span>
    </div>
  );
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-2">Gaussian Uncertainty Propagation</h3>
      
      <div className="flex justify-between mb-2">
        <button 
          onClick={() => setPlaying(!playing)} 
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {playing ? 'Pause' : 'Play Animation'}
        </button>
        
        <div className="flex">
          <LegendItem color="#3B82F6" label="Prior" />
          <LegendItem color="#EF4444" label="Measurement" />
          <LegendItem color="#10B981" label="Posterior" />
        </div>
      </div>
      
      <div className="relative">
        <svg viewBox="0 0 500 220" className="w-full h-auto">
          {/* Coordinate axes */}
          <line x1="50" y1="150" x2="450" y2="150" stroke="#666" strokeWidth="1" />
          <line x1="50" y1="30" x2="50" y2="150" stroke="#666" strokeWidth="1" />
          
          {/* X-axis label */}
          <text x="250" y="180" textAnchor="middle" fill="#666">State</text>
          
          {/* Y-axis label */}
          <text x="20" y="90" textAnchor="middle" fill="#666" transform="rotate(-90, 20, 90)">Probability Density</text>
          
          {/* Prior Gaussian */}
          {generateGaussianPath(animatedPriorMean, priorVariance, "#3B82F6", 50, 150, 30)}
          
          {/* Measurement Gaussian */}
          {generateGaussianPath(animatedMeasurementMean, measurementVariance, "#EF4444", 50, 150, 30)}
          
          {/* Posterior Gaussian */}
          {generateGaussianPath(animatedPosteriorMean, animatedPosteriorVariance, "#10B981", 50, 150, 30)}
          
          {/* State labels */}
          <text x={50 + animatedPriorMean * 30} y="165" textAnchor="middle" fill="#3B82F6" fontSize="12">Prior</text>
          <text x={50 + animatedMeasurementMean * 30} y="165" textAnchor="middle" fill="#EF4444" fontSize="12">Measurement</text>
          <text x={50 + animatedPosteriorMean * 30} y="165" textAnchor="middle" fill="#10B981" fontSize="12">Posterior</text>
        </svg>
        
        <div className="mt-4 text-sm">
          <p className="mb-2"><strong>What this shows:</strong> The Kalman filter combines the prior state estimate (blue) with a new measurement (red) to produce an optimal posterior estimate (green).</p>
          <p className="mb-2"><strong>Prior:</strong> Our prediction before measurement (wider = more uncertainty)</p>
          <p className="mb-2"><strong>Measurement:</strong> New observation with its own uncertainty</p>
          <p><strong>Posterior:</strong> Optimally combined estimate with reduced uncertainty</p>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded">
        <h4 className="font-bold mb-1">Bayes' Rule in the Kalman Filter:</h4>
        <p className="text-sm">
          Posterior ∝ Prior × Likelihood
        </p>
        <p className="text-xs mt-1 text-gray-600">
          The posterior probability is proportional to the prior probability multiplied by the likelihood of the measurement.
        </p>
      </div>
    </div>
  );
};

export default KalmanGaussianDiagram;