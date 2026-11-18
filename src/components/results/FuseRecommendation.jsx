import React from 'react';
import './FuseRecommendation.css';

const FuseRecommendation = ({ fuse }) => {
  const { recommended, min, max, loadCurrent, wireAmpacity, warning, fuseRatio = 1.25 } = fuse;

  return (
    <div className="card fuse-recommendation-card">
      <h3>Circuit Protection</h3>

      {recommended ? (
        <>
          <div className="fuse-display">
            <div className="fuse-badge">
              {recommended}A
            </div>
            <p className="fuse-label">Recommended Fuse/Breaker</p>
          </div>

          <div className="fuse-sizing">
            <h4>Sizing Calculations</h4>
            <div className="sizing-grid">
              <div className="sizing-item">
                <span className="sizing-label">Load Current:</span>
                <span className="sizing-value">{loadCurrent.toFixed(1)}A</span>
              </div>
              <div className="sizing-item">
                <span className="sizing-label">{Math.round(fuseRatio * 100)}% of Load:</span>
                <span className="sizing-value">{min}A {fuseRatio > 1 ? '(continuous load rule)' : '(intermittent load)'}</span>
              </div>
              <div className="sizing-item">
                <span className="sizing-label">Wire Ampacity:</span>
                <span className="sizing-value">{wireAmpacity}A (max protection)</span>
              </div>
            </div>
          </div>

          <div className="fuse-warnings">
            <p className="warning-item">⚠️ Install the fuse as close to the battery positive terminal as possible (ABYC E-11: within 7")</p>
            <p className="warning-item">⚠️ Use marine-grade ANL or MRBF fuse for high current (&gt;50A)</p>
          </div>
        </>
      ) : (
        <div className="fuse-error">
          <p className="error-message">⚠️ {warning}</p>
          <div className="fuse-range">
            <p>Required fuse range: {min}A - {max}A</p>
            <p>No standard fuse size available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuseRecommendation;
