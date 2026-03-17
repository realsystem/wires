import React from 'react';
import './WireComparison.css';

const WireComparison = ({ alternatives, input }) => {
  return (
    <div className="card wire-comparison-card">
      <h3>📊 Wire Size Comparison</h3>

      <div className="comparison-table">
        <table>
          <thead>
            <tr>
              <th>Gauge</th>
              <th>Voltage Drop</th>
              <th>Ampacity</th>
              <th>Cost Factor</th>
            </tr>
          </thead>
          <tbody>
            {alternatives.map((alt) => (
              <tr key={alt.gauge} className={alt.isRecommended ? 'recommended-row' : ''}>
                <td className="gauge-col">
                  {alt.isRecommended && <span className="star">⭐ </span>}
                  {alt.gauge} AWG
                </td>
                <td className={`drop-col ${alt.meetsVoltageDrop ? 'success' : 'fail'}`}>
                  {alt.voltageDropPercent.toFixed(1)}%
                  <span className="status-icon">{alt.meetsVoltageDrop ? ' ✓' : ' ✗'}</span>
                </td>
                <td className={`ampacity-col ${alt.meetsAmpacity ? 'success' : 'fail'}`}>
                  {alt.ampacity}A
                  <span className="status-icon">{alt.meetsAmpacity ? ' ✓' : ' ✗'}</span>
                </td>
                <td className="cost-col">
                  {alt.relativeCost.toFixed(1)}x
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="comparison-legend">
        <p><span className="legend-item">⭐</span> = Recommended (best value)</p>
        <p><span className="legend-item">✓</span> = Acceptable</p>
        <p><span className="legend-item">✗</span> = Exceeds limits</p>
      </div>
    </div>
  );
};

export default WireComparison;
