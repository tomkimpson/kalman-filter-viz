import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function KalmanIteration() {
  // State to track the current step in the Kalman filter process
  const [currentStep, setCurrentStep] = useState(0);
  
  // Define the steps in the Kalman filter process
  const steps = [
    { id: 0, title: "Initial Prior Distribution", description: "Start with a prior probability distribution p(x₀)" },
    { id: 1, title: "Prediction Step", description: "Predict what the next distribution is going to be, obtaining p(x₁|x₀)" },
    { id: 2, title: "Measurement", description: "Take a measurement, obtaining measurement distribution p(y₁|x₁)" },
    { id: 3, title: "Posterior Update", description: "Combine prediction and measurement to get a new posterior p(x₁|y₁)" },
    { id: 4, title: "Cycle Completion", description: "The posterior becomes the new prior p(x₁) for the next iteration" }
  ];
  
  // Generate x values for the plot
  const xValues = Array.from({ length: 100 }, (_, i) => i / 10 - 5);
  
  // Function to calculate Gaussian PDF
  const gaussian = (x, mean, variance) => {
    return (1 / Math.sqrt(2 * Math.PI * variance)) * 
           Math.exp(-Math.pow(x - mean, 2) / (2 * variance));
  };
  
  // Initial parameters
  const priorMean = 0;
  const priorVariance = 1;
  
  // Prediction parameters (the system dynamics apply some change)
  const predictedMean = priorMean + 0.5; // Model predicts a shift
  const predictedVariance = priorVariance + 0.3; // Increased uncertainty
  
  // Measurement parameters
  const measurementMean = 1.2; // Measurement suggests the true value is around 1.2
  const measurementVariance = 0.5; // Measurement has some uncertainty
  
  // Calculate posterior (updated belief after measurement)
  // Using Bayesian update formula for Gaussian distributions
  const posteriorVariance = 1 / ((1 / predictedVariance) + (1 / measurementVariance));
  const posteriorMean = posteriorVariance * ((predictedMean / predictedVariance) + (measurementMean / measurementVariance));
  
  // For the next iteration (cycle completion step)
  // The posterior becomes the new prior
  const nextPriorMean = posteriorMean;
  const nextPriorVariance = posteriorVariance;
  
  // Prepare data for the chart based on current step
  const generateChartData = () => {
    return xValues.map(x => {
      const priorPDF = gaussian(x, priorMean, priorVariance);
      
      let predictedPDF = 0;
      let measurementPDF = 0;
      let posteriorPDF = 0;
      let nextPriorPDF = 0;
      
      if (currentStep >= 1) {
        predictedPDF = gaussian(x, predictedMean, predictedVariance);
      }
      
      if (currentStep >= 2) {
        measurementPDF = gaussian(x, measurementMean, measurementVariance);
      }
      
      if (currentStep >= 3) {
        posteriorPDF = gaussian(x, posteriorMean, posteriorVariance);
      }
      
      if (currentStep >= 4) {
        nextPriorPDF = gaussian(x, nextPriorMean, nextPriorVariance);
      }
      
      // Final step only shows the posterior (which becomes the new prior)
      if (currentStep === 4) {
        return {
          x,
          posterior: posteriorPDF,
          nextPrior: nextPriorPDF
        };
      } else {
        return {
          x,
          prior: currentStep < 4 ? priorPDF : null,
          predicted: currentStep >= 1 ? predictedPDF : null,
          measurement: currentStep >= 2 ? measurementPDF : null,
          posterior: currentStep >= 3 ? posteriorPDF : null
        };
      }
    });
  };
  
  const chartData = generateChartData();
  
  // Go to next step in the Kalman filter process
  const handleNextStep = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Loop back to the start, treating posterior as the new prior
      setCurrentStep(0);
    }
    console.log("Next clicked, moving to step:", (currentStep < steps.length - 1) ? currentStep + 1 : 0);
  };
  
  // Go to previous step
  const handlePrevStep = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      // Go to the last step if we're at the beginning
      setCurrentStep(steps.length - 1);
    }
    console.log("Previous clicked, moving to step:", (currentStep > 0) ? currentStep - 1 : steps.length - 1);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Kalman Filter Visualization</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{steps[currentStep].title}</h2>
        <p className="text-gray-700">{steps[currentStep].description}</p>
      </div>
      
      <div className="relative mb-2" style={{ height: '32px' }}>
        {/* Navigation arrows positioned above the graph */}
        <div className="absolute top-0 right-0 flex space-x-2 z-20">
          <button 
            onClick={handlePrevStep}
            type="button"
            style={{ 
              width: '2rem', 
              height: '2rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              borderRadius: '9999px', 
              backgroundColor: '#e5e7eb',
              cursor: 'pointer',
              border: 'none',
              fontSize: '1rem'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#d1d5db'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#e5e7eb'}
            aria-label="Previous step"
          >
            ←
          </button>
          <button 
            onClick={handleNextStep}
            type="button"
            style={{ 
              width: '2rem', 
              height: '2rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              borderRadius: '9999px', 
              backgroundColor: '#e5e7eb',
              cursor: 'pointer',
              border: 'none',
              fontSize: '1rem'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#d1d5db'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#e5e7eb'}
            aria-label="Next step"
          >
            →
          </button>
        </div>
      </div>
      
      <div className="h-64 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="x" 
              label={{ value: 'x', position: 'insideBottomRight', offset: -5 }} 
              domain={[-5, 5]}
            />
            <YAxis 
              label={{ value: 'p(x)', angle: -90, position: 'insideLeft' }}
              domain={[0, 0.5]}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <Tooltip formatter={(value) => value ? value.toFixed(4) : 'N/A'} />
            <Legend />
            {currentStep < 4 && (
              <Line 
                type="monotone" 
                dataKey="prior" 
                name="Prior p(x₀)" 
                stroke="#8884d8" 
                dot={false} 
                isAnimationActive={false}
              />
            )}
            {currentStep >= 1 && currentStep < 4 && (
              <Line 
                type="monotone" 
                dataKey="predicted" 
                name="Predicted p(x₁|x₀)" 
                stroke="#82ca9d" 
                dot={false} 
                isAnimationActive={false}
              />
            )}
            {currentStep >= 2 && currentStep < 4 && (
              <Line 
                type="monotone" 
                dataKey="measurement" 
                name="Measurement p(y₁|x₁)" 
                stroke="#ff7300" 
                dot={false} 
                isAnimationActive={false}
              />
            )}
            {currentStep >= 3 && (
              <Line 
                type="monotone" 
                dataKey="posterior" 
                name="Posterior p(x₁|y₁)" 
                stroke="#ff0000" 
                dot={false} 
                isAnimationActive={false}
              />
            )}
            {currentStep >= 4 && (
              <Line 
                type="monotone" 
                dataKey="nextPrior" 
                name="New Prior p(x₁)" 
                stroke="#8884d8" 
                strokeDasharray="5 5"
                dot={false} 
                isAnimationActive={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="text-gray-700 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">The Bayesian Nature of Kalman Filtering:</h3>
        <p className="mb-2">
          Kalman filtering is fundamentally a Bayesian process, where each step updates our belief about the state of the system:
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>We start with a <span className="font-medium text-purple-700">prior distribution</span> p(x₀) representing our current belief about the state.</li>
          <li>We use a <span className="font-medium text-green-700">prediction model</span> to forecast how the state will evolve, giving p(x₁|x₀).</li>
          <li>We obtain <span className="font-medium text-orange-700">measurement data</span> p(y₁|x₁) with its own uncertainty.</li>
          <li>We combine the prediction with the measurement to compute a <span className="font-medium text-red-700">posterior distribution</span> p(x₁|y₁).</li>
          <li>The posterior becomes our <span className="font-medium text-purple-700">new prior</span> p(x₁) for the next iteration, completing the cycle.</li>
        </ol>
        <p className="mt-2">
          This iterative cycle of predict-measure-update embodies the Bayesian approach of continuously refining our knowledge as new information becomes available. Each completed cycle improves our estimate based on all previous measurements.
        </p>
      </div>
    </div>
  );
}

export default KalmanIteration;