import React from 'react';
import './InstallationGuidance.css';

const InstallationGuidance = ({ guidance }) => {
  const regularGuidance = guidance.filter(item => !item.type);
  const warnings = guidance.filter(item => item.type === 'warning');

  return (
    <div className="card installation-guidance-card">
      <h3>Installation Best Practices</h3>

      <div className="guidance-list">
        {regularGuidance.map((item, index) => (
          <div key={index} className="guidance-item">
            <span className="guidance-icon">{item.icon}</span>
            <span className="guidance-text">{item.text}</span>
          </div>
        ))}
      </div>

      {warnings.length > 0 && (
        <div className="warnings-section">
          <h4>⚠️ Important Warnings</h4>
          <div className="guidance-list warnings">
            {warnings.map((item, index) => (
              <div key={index} className="guidance-item warning">
                <span className="guidance-icon">{item.icon}</span>
                <span className="guidance-text">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="safety-note">
        <p><strong>Safety First:</strong> Improper wiring can cause fires. When in doubt, consult a professional electrician or automotive electrical specialist.</p>
      </div>
    </div>
  );
};

export default InstallationGuidance;
