import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

const config = {
  loader: { load: ["input/tex", "output/svg"] },
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
  },
  svg: {
    fontCache: 'global'
  },
  startup: {
    typeset: false  // Disable initial typesetting to allow manual control
  }
};

function KalmanIteration() {
  // State to track the current step in the Kalman filter process
  const [currentStep, setCurrentStep] = useState(0);
  const [key, setKey] = useState(0); // Add a key to force re-rendering
  
  // Define the steps in the Kalman filter process
  const steps = [
    { id: 0, title: "Initial Prior Distribution", description: <span>Start with a prior probability distribution <MathJax inline>{"\\(p(x_0)\\)"}</MathJax></span>},
    { id: 1, title: "Prediction Step", description: <span>Predict what the next distribution is going to be, obtaining <MathJax inline>{"\\(p(x_1|x_0)\\)"}</MathJax></span>},
    { id: 2, title: "Measurement", description: <span>Take a measurement, obtaining measurement distribution <MathJax inline>{"\\(p(y_1|x_1)\\)"}</MathJax></span>},
    { id: 3, title: "Posterior Update", description: <span>Combine prediction and measurement to get a new posterior <MathJax inline>{"\\(p(x_1|y_1)\\)"}</MathJax></span>},
    { id: 4, title: "Cycle Completion", description: <span>The posterior becomes the new prior <MathJax inline>{"\\(p(x_1)\\)"}</MathJax> for the next iteration</span> }
  ];
  
  // Create persistent MathJax elements for line names to avoid recreation on render
  // These are defined outside of the render cycle to maintain consistency
  const lineNameComponents = {
    prior: <MathJax inline key="prior">{"\\(\\text{Prior }p(x_0)\\)"}</MathJax>,
    predicted: <MathJax inline key="predicted">{"\\(\\text{Predicted }p(x_1|x_0)\\)"}</MathJax>,
    measurement: <MathJax inline key="measurement">{"\\(\\text{Measurement }p(y_1|x_1)\\)"}</MathJax>,
    posterior: <MathJax inline key="posterior">{"\\(\\text{Posterior }p(x_1|y_1)\\)"}</MathJax>,
    nextPrior: <MathJax inline key="nextPrior">{"\\(\\text{New Prior }p(x_1)\\)"}</MathJax>
  };
  
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
  
  // Trigger MathJax typesetting after state changes
  useEffect(() => {
    // Allow a brief delay for the DOM to update before typesetting
    const timer = setTimeout(() => {
      if (window.MathJax) {
        window.MathJax.typesetPromise && window.MathJax.typesetPromise();
      }
    }, 200);
    
    return () => clearTimeout(timer);
  }, [currentStep, key]);
  
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
    // Force re-render to trigger MathJax processing
    setKey(prevKey => prevKey + 1);
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
    // Force re-render to trigger MathJax processing
    setKey(prevKey => prevKey + 1);
  };
  
  return (
    <MathJaxContext config={config}>
      <div key={key} className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">      
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-left">{steps[currentStep].title}</h2>
          <p className="text-gray-700 text-left">{steps[currentStep].description}</p>
        </div>
        
        <div className="relative mb-2" style={{ height: '32px' }}>
          {/* Navigation arrows positioned above the graph */}
          <div className="absolute top-0 right-0 flex space-x-2 z-20">
            <button 
              onClick={handlePrevStep}
              type="button"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer border-none text-base"
              aria-label="Previous step"
            >
              ←
            </button>
            <button 
              onClick={handleNextStep}
              type="button"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer border-none text-base"
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
                  name={lineNameComponents.prior}
                  stroke="#8884d8" 
                  dot={false} 
                  isAnimationActive={false}
                />
              )}
              {currentStep >= 1 && currentStep < 4 && (
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  name={lineNameComponents.predicted}
                  stroke="#82ca9d" 
                  dot={false} 
                  isAnimationActive={false}
                />
              )}
              {currentStep >= 2 && currentStep < 4 && (
                <Line 
                  type="monotone" 
                  dataKey="measurement" 
                  name={lineNameComponents.measurement}
                  stroke="#ff7300" 
                  dot={false} 
                  isAnimationActive={false}
                />
              )}
              {currentStep >= 3 && (
                <Line 
                  type="monotone" 
                  dataKey="posterior" 
                  name={lineNameComponents.posterior}
                  stroke="#ff0000" 
                  dot={false} 
                  isAnimationActive={false}
                />
              )}
              {currentStep >= 4 && (
                <Line 
                  type="monotone" 
                  dataKey="nextPrior" 
                  name={lineNameComponents.nextPrior}
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
          <h3 className="font-semibold mb-2 text-left">The Bayesian Nature of Kalman Filtering:</h3>
          <p className="mb-2 text-left">
            Kalman filtering is fundamentally a Bayesian process, where each step updates our belief about the state of the system:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-left">
            <li>We start with a <span className="font-medium text-purple-700">prior distribution</span> <MathJax inline>{"\\( p(x_0) \\)"}</MathJax> representing our current belief about the state. </li>
            <li>We use a <span className="font-medium text-green-700">prediction model</span> to forecast how the state will evolve, <MathJax inline>{"\\( p(x_1|x_0) \\)"}</MathJax>.</li>
            <li>We obtain a <span className="font-medium text-orange-700">measurement</span> and calculate the likelihood <MathJax inline>{"\\( p(y_1|x_1) \\)"}</MathJax>. </li>
            <li>We combine the prediction with the measurement to compute a <span className="font-medium text-red-700">posterior distribution</span> <MathJax inline>{"\\( p(x_1|y_1) \\)"}</MathJax>.</li>
            <li>The posterior becomes our <span className="font-medium text-purple-700">new prior</span> <MathJax inline>{"\\( p(x_1) \\)"}</MathJax> for the next iteration, completing the cycle.</li>
          </ol>
        </div>
      </div>
    </MathJaxContext>
  );
}

export default KalmanIteration;