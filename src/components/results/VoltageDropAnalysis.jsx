import React from 'react';
import './VoltageDropAnalysis.css';

const VoltageDropAnalysis = ({ recommendation, input }) => {
  const { voltageDrop, voltageDropPercent, voltageAtLoad, powerLoss } = recommendation;
  const maxDropVoltage = input.systemVoltage * (input.voltageDropPercent / 100);
  const dropRatio = (voltageDropPercent / input.voltageDropPercent) * 100;

  // Determine status
  let status = 'success';
  if (voltageDropPercent > input.voltageDropPercent) {
    status = 'error';
  } else if (voltageDropPercent > input.voltageDropPercent * 0.8) {
    status = 'warning';
  }

  return (
    <div className="card voltage-drop-card">
      <h3>⚡ Voltage Drop Analysis</h3>

      <div className="drop-summary">
        <div className="drop-main">
          <span className="drop-label">Actual Drop:</span>
          <span className={`drop-value drop-${status}`}>
            {voltageDrop.toFixed(2)}V ({voltageDropPercent.toFixed(1)}%)
          </span>
        </div>
        <div className="drop-allowable">
          <span className="drop-label">Allowable:</span>
          <span className="drop-value">
            {maxDropVoltage.toFixed(2)}V ({input.voltageDropPercent}% limit)
          </span>
        </div>
      </div>

      <div className="voltage-levels">
        <h4>Voltage at Load</h4>
        <div className="voltage-flow">
          <div className="voltage-item">
            <span className="voltage-label">Wire Input:</span>
            <span className="voltage-value">{input.systemVoltage.toFixed(2)}V</span>
          </div>
          <div className="voltage-arrow">→</div>
          <div className="voltage-item">
            <span className="voltage-label">Device Gets:</span>
            <span className="voltage-value">{voltageAtLoad.toFixed(2)}V</span>
          </div>
        </div>
        <p className="power-loss">Power Loss: {powerLoss.toFixed(1)}W in wire resistance</p>
      </div>

      <div className="drop-progress">
        <div className="progress-bar">
          <div
            className={`progress-fill progress-${status}`}
            style={{ width: `${Math.min(dropRatio, 100)}%` }}
          />
        </div>
        <div className="progress-labels">
          <span>0%</span>
          <span>{voltageDropPercent.toFixed(1)}%</span>
          <span>{input.voltageDropPercent}%</span>
        </div>
      </div>

      {status === 'success' && voltageDropPercent < 2 && (
        <p className="drop-note success">✓ Excellent - minimal power loss</p>
      )}
      {status === 'success' && voltageDropPercent >= 2 && voltageDropPercent <= 3 && (
        <p className="drop-note success">✓ Good - acceptable for most applications</p>
      )}
      {status === 'warning' && (
        <p className="drop-note warning">⚠️ Marginal - consider next size up for critical loads</p>
      )}
      {status === 'error' && (
        <p className="drop-note error">❌ Exceeds limit - use recommended wire size</p>
      )}
    </div>
  );
};

export default VoltageDropAnalysis;
