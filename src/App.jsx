import React, { useState } from 'react';
import WireCalculatorForm from './components/WireCalculatorForm';
import WireResultsDisplay from './components/WireResultsDisplay';
import { calculateWireSpecification } from './engine/wireCalculator';
import './styles/App.css';

function App() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleCalculate = (formData) => {
    try {
      setError(null);

      // Calculate wire specification
      const specification = calculateWireSpecification(formData);

      setResults(specification);

    } catch (err) {
      setError({
        type: 'calculation',
        message: err.message || 'An error occurred during calculation'
      });
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-top">
            <a href="https://overlandn.com" className="back-to-main">← Back to main page</a>
          </div>
          <h1>Wire Gauge Calculator</h1>
          <p className="tagline">Professional wire sizing for RV, camper, and off-road electrical systems</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {error && (
            <div className={`alert alert-error`}>
              <h3>⚠️ Error</h3>
              <p>{error.message}</p>
            </div>
          )}

          {!results ? (
            <WireCalculatorForm onCalculate={handleCalculate} />
          ) : (
            <WireResultsDisplay results={results} onReset={handleReset} />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Built for overlanders and off-road enthusiasts. All calculations based on NEC and ABYC standards.</p>
        <p className="disclaimer">Always consult a professional electrician for complex installations. Improper wiring can cause fires.</p>
      </footer>
    </div>
  );
}

export default App;
