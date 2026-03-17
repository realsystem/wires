import React from 'react';
import './FuseRecommendation.css';

const FuseRecommendation = ({ fuse }) => {
  const { recommended, min, max, loadCurrent, wireAmpacity, warning } = fuse;

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
                <span className="sizing-label">125% of Load:</span>
                <span className="sizing-value">{min}A (continuous load rule)</span>
              </div>
              <div className="sizing-item">
                <span className="sizing-label">Wire Ampacity:</span>
                <span className="sizing-value">{wireAmpacity}A (max protection)</span>
              </div>
            </div>
          </div>

          <div className="fuse-warnings">
            <p className="warning-item">⚠️ Install inline fuse within 18" of battery positive terminal</p>
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
