import './App.css'
import KalmanFilterVisualization from './components/KalmanFilterVisualization'
import KalmanIteration from './components/KalmanIteration'
import Footnote from './components/Footnote'
import { MathJax, MathJaxContext } from 'better-react-mathjax';
const config = {
  loader: { load: ["input/tex", "output/svg"] },
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
  },
};


function App() {
  return (
    <MathJaxContext config={config}>
    <div className="App min-h-screen flex flex-col bg-gray-50 font-serif">
      <header className="p-6 bg-[#002147] text-white shadow-md">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-left">Kalman Filtering</h1>
          <p className="mt-2 text-blue-100 text-left">A pedagogical, interactive visualization of Bayesian estimation</p>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">

                
        {/* Additional explanatory text */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 text-left">Key Concepts</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-blue-700">How It Works</h3>
                <p className="text-gray-700 text-left">
                  The Kalman filter is a recursive algorithm that estimates the hidden state of a dynamic system from a series 
                  of noisy measurements. 

                  <div className="my-1"></div>  {/* Add this line for extra spacing */}


                  In a Bayesian framework, the Kalman filter calculates the marginalised <Footnote id="1"> Marginalised over all the other states, i.e. we are not calculating the joint distribution <MathJax inline>{"\\( p(\\mathbf{x}_{1:T} | \\mathbf{y}_{1:T})\\)"}</MathJax></Footnote> posterior <MathJax inline>{"\\( p(\\mathbf{x}_k | \\mathbf{y}_{1:k})\\)"}</MathJax>. 
                  <div className="my-1"></div>  {/* Add this line for extra spacing */}

                  It has two steps:
                </p>
                
                <div className="rounded-lg bg-blue-50 p-4 border-l-4 border-blue-500">
                  <h4 className="font-medium text-blue-800">1. Prediction Step</h4>
                  <p className="text-gray-700 mt-1 text-left">
                    The filter predicts the current state based on the previous state using a dynamical model, <MathJax inline>{"\\( p(\\mathbf{x}_k | \\mathbf{x}_{k-1})\\)"}</MathJax>. 
                  </p>
                </div>
                
                <div className="rounded-lg bg-blue-50 p-4 border-l-4 border-blue-500">
                  <h4 className="font-medium text-blue-800">2. Update Step</h4>
                  <p className="text-gray-700 mt-1 text-left">
                    When a new measurement arrives, the filter compares it to the predicted state
                    and updates the estimate, <MathJax inline>{"\\( p(\\mathbf{y}_k | \\mathbf{x}_{k})\\)"}</MathJax>. 
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center space-y-4">
                <img 
                  src="/kalman-filter-viz/images/state_space.png" 
                  alt="State Space"
                  className="w-full h-auto max-w-md rounded-lg"
                />
                <p className="text-gray-700 text-sm text-center">
                <MathJax>{"\\[ p(\\mathbf{x}_k | \\mathbf{y}_{1:k}) \\propto \\underbrace {p(\\mathbf{y}_k | \\mathbf{x}_{1:k})}_{\\text{update}} \\int d\\mathbf{x}_{k-1} \\, \\underbrace{p(\\mathbf{x}_k | \\mathbf{x}_{k-1})}_{\\text{predict}} \\, \\underbrace{p(\\mathbf{x}_{k-1} | \\mathbf{y}_{1:k-1})}_{\\text{prior}}. \\]"} </MathJax>                  
                </p>
              </div>
            </div>
                    {/* Main visualization section with card styling */}
          <div className="p-6">
            <KalmanIteration />
          </div>
 

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-700">Applications</h3>
              <p className="text-gray-700 text-left">
                The Kalman filter is used in numerous fields where estimating states from noisy data is important:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                <div className="bg-gray-50 p-3 rounded-lg flex items-center space-x-3">
                  <div className="bg-blue-100 rounded-full p-2 text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                    </svg>
                  </div>
                  <a 
                    href="https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=%22kalman+filter%22+%22navigation%22&btnG="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Navigation Systems
                  </a>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg flex items-center space-x-3">
                  <div className="bg-blue-100 rounded-full p-2 text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                    </svg>
                  </div>
                  <a 
                    href="https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=%22kalman+filter%22+%22robotics%22&btnG="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Robotics
                  </a>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg flex items-center space-x-3">
                  <div className="bg-blue-100 rounded-full p-2 text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <a 
                    href="https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=%22kalman+filter%22+%22aerospace%22&btnG="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Aerospace
                  </a>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg flex items-center space-x-3">
                  <div className="bg-blue-100 rounded-full p-2 text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <a 
                    href="https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=%22kalman+filter%22+%22finance%22&btnG="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Finance
                  </a>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg flex items-center space-x-3">
                  <div className="bg-blue-100 rounded-full p-2 text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </div>
                  <a 
                    href="https://scholar.google.com/scholar?q=%22kalman+filter%22+%22computer+vision%22&hl=en&as_sdt=0,5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Computer Vision
                  </a>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg flex items-center space-x-3">
                  <div className="bg-blue-100 rounded-full p-2 text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                    </svg>
                  </div>
                  <a 
                    href="https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=%22kalman+filter%22+%22signal+processing%22&btnG="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Signal Processing
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Main visualization section with card styling */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10">
          <div className="p-6">
            <KalmanFilterVisualization />
          </div>
        </div>




        {/* Final text section with card styling */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10">
          <div className="p-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-700 text-left">Gaussianity and Optimality</h3>
              <p className="text-gray-700 text-left">
                The Kalman filter is the optimal estimator for linear systems. By "optimal" we mean that it minimises the mean-squared error between the estimated state and the true state,
                <MathJax>{"\\[  f^*(Y) = \\arg\\min_f \\mathbb{E} \\left[(X - f(Y))^2 \\right] = \\mathbb{E}[X | Y] \\]"}</MathJax> cf. our previous statement that the Kalman filter calculates the posterior <MathJax inline>{"\\( p(\\mathbf{x}_k | \\mathbf{y}_{1:k})\\)"}</MathJax>.
                <div className="my-1"></div>  {/* Add this line for extra spacing */}

                Note that <a href="https://arxiv.org/abs/2405.00058v1" target="_blank" rel="noopener noreferrer">
                Gaussianity is not required for MMSE optimality
                </a>; Gaussianity matters only if you care about fully characterizing the posterior distribution (not just the mean). 
                <div className="my-1"></div>  {/* Add this line for extra spacing */}

                For non-linear systems, one must use variants of the Kalman filter such as the <a href="https://en.wikipedia.org/wiki/Extended_Kalman_filter" target="_blank" rel="noopener noreferrer">
                Extened Kalman Filter
                </a> (EKF) or the <a href="https://ieeexplore.ieee.org/document/882463" target="_blank" rel="noopener noreferrer">
                Unscented Kalman Filter
                </a> (UKF). These algorithms are not optimal in the above sense, but tend to work well in practice and are widely used. Indeed, the stochastic pendulum example above uses the EKF!

              </p>
            </div>
          </div>
        </div>







      </main>
      
      {/* <footer className="bg-gray-800 text-gray-300 p-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-white font-bold text-lg mb-2">Kalman Filter Visualization</h3>
              <p className="text-gray-400">Created at University of Melbourne & OzGrav</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition">
                <span>About</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <span>Resources</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
    </MathJaxContext>
  )
}

export default App







