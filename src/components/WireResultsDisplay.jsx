import React from 'react';
import WireRecommendation from './results/WireRecommendation';
import VoltageDropAnalysis from './results/VoltageDropAnalysis';
import FuseRecommendation from './results/FuseRecommendation';
import WireComparison from './results/WireComparison';
import InstallationGuidance from './results/InstallationGuidance';
import './WireResultsDisplay.css';

const WireResultsDisplay = ({ results, onReset }) => {
  const { input, recommendation, fuse, alternatives, guidance } = results;

  return (
    <div className="results-container">
      {/* Header with Reset Button */}
      <div className="results-header">
        <div>
          <h2>Wire Specification Results</h2>
          <p className="results-summary">
            {input.current.toFixed(1)}A @ {input.systemVoltage}V, {input.wireLength}{input.lengthUnit} {input.lengthType}
          </p>
        </div>
        <button onClick={onReset} className="btn btn-secondary">
          ← New Calculation
        </button>
      </div>

      {/* Warning if requirements not met */}
      {!recommendation.meetsRequirements && (
        <div className="alert alert-error">
          <h3>⚠️ Warning</h3>
          <p>{recommendation.warning}</p>
        </div>
      )}

      {/* Results Grid */}
      <div className="results-grid">
        {/* Primary Recommendation */}
        <WireRecommendation recommendation={recommendation} input={input} />

        {/* Voltage Drop Analysis */}
        <VoltageDropAnalysis recommendation={recommendation} input={input} />

        {/* Fuse Recommendation */}
        <FuseRecommendation fuse={fuse} />

        {/* Wire Size Comparison */}
        <WireComparison alternatives={alternatives} input={input} />

        {/* Installation Guidance */}
        <InstallationGuidance guidance={guidance} />
      </div>
    </div>
  );
};

export default WireResultsDisplay;
