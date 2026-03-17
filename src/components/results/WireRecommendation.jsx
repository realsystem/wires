import React from 'react';
import './WireRecommendation.css';

const WireRecommendation = ({ recommendation, input }) => {
  const { gauge, wireData, ampacity, maxSafeCurrent, meetsRequirements } = recommendation;
  const utilizationPercent = (input.current / maxSafeCurrent * 100).toFixed(0);

  return (
    <div className="card wire-recommendation-card">
      <h3>🔌 Recommended Wire Gauge</h3>

      <div className="gauge-display">
        <div className={`gauge-badge ${meetsRequirements ? 'success' : 'warning'}`}>
          {wireData.label}
        </div>
      </div>

      <div className="recommendation-status">
        {meetsRequirements ? (
          <>
            <p className="status-success">✓ Meets voltage drop requirement ({recommendation.voltageDropPercent.toFixed(1)}%)</p>
            <p className="status-success">✓ Ampacity: {ampacity}A (Load: {input.current.toFixed(1)}A - {utilizationPercent}% capacity)</p>
          </>
        ) : (
          <p className="status-warning">⚠️ See warnings above - consult professional</p>
        )}
      </div>

      <div className="wire-specs">
        <h4>Wire Specifications</h4>
        <div className="spec-grid">
          <div className="spec-item">
            <span className="spec-label">Diameter:</span>
            <span className="spec-value">{wireData.diameter}" ({wireData.diameterMm}mm)</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Resistance:</span>
            <span className="spec-value">{wireData.resistance} Ω/1000ft</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Rated Ampacity:</span>
            <span className="spec-value">{ampacity}A @ {input.tempRating}°C</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Safe Max Current:</span>
            <span className="spec-value">{maxSafeCurrent.toFixed(0)}A (80% derating)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WireRecommendation;
