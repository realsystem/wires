import React, { useState } from 'react';
import { USE_CASE_PRESETS } from '../engine/wireData';
import './WireCalculatorForm.css';

const WireCalculatorForm = ({ onCalculate }) => {
  const [formData, setFormData] = useState({
    systemVoltage: 12,
    inputMode: 'amps', // 'amps' or 'watts'
    current: 15,
    watts: '',
    wireLength: 25,
    lengthUnit: 'ft',
    lengthType: 'one-way',
    voltageDropPercent: 3,
    // Advanced
    tempRating: 75,
    ambientTemp: 77,
    installMethod: 'free-air'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handlePresetClick = (presetKey) => {
    const preset = USE_CASE_PRESETS[presetKey];
    setFormData(prev => ({
      ...prev,
      systemVoltage: preset.voltage,
      inputMode: 'amps',
      current: preset.current,
      watts: '',
      wireLength: preset.wireLength,
      lengthUnit: preset.unit,
      lengthType: preset.lengthType,
      voltageDropPercent: preset.voltageDropPercent
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate(formData);
  };

  // Calculate what the voltage drop percentage means in real voltage
  const voltageDropV = (formData.systemVoltage * formData.voltageDropPercent / 100).toFixed(2);

  return (
    <div className="calculator-form-container">
      <div className="card">
        <h2>Wire Size Calculator</h2>

        {/* Use Case Presets */}
        <div className="presets-section">
          <h4>Quick Presets</h4>
          <div className="preset-buttons">
            <button
              type="button"
              className="preset-btn"
              onClick={() => handlePresetClick('ledLightBar')}
              title={USE_CASE_PRESETS.ledLightBar.description}
            >
              💡 LED Light Bar
            </button>
            <button
              type="button"
              className="preset-btn"
              onClick={() => handlePresetClick('travelFridge')}
              title={USE_CASE_PRESETS.travelFridge.description}
            >
              ❄️ Travel Fridge
            </button>
            <button
              type="button"
              className="preset-btn"
              onClick={() => handlePresetClick('winch')}
              title={USE_CASE_PRESETS.winch.description}
            >
              ⚙️ Winch
            </button>
            <button
              type="button"
              className="preset-btn"
              onClick={() => handlePresetClick('solar')}
              title={USE_CASE_PRESETS.solar.description}
            >
              ☀️ Solar Panel
            </button>
            <button
              type="button"
              className="preset-btn"
              onClick={() => handlePresetClick('inverter')}
              title={USE_CASE_PRESETS.inverter.description}
            >
              🔌 Inverter
            </button>
            <button
              type="button"
              className="preset-btn"
              onClick={() => handlePresetClick('auxLights')}
              title={USE_CASE_PRESETS.auxLights.description}
            >
              🔦 Aux Lights
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="calculator-form">
          {/* System Voltage */}
          <div className="form-group">
            <label>System Voltage</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="systemVoltage"
                  value="12"
                  checked={formData.systemVoltage === 12}
                  onChange={() => setFormData(prev => ({ ...prev, systemVoltage: 12 }))}
                />
                <span>12V</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="systemVoltage"
                  value="24"
                  checked={formData.systemVoltage === 24}
                  onChange={() => setFormData(prev => ({ ...prev, systemVoltage: 24 }))}
                />
                <span>24V</span>
              </label>
            </div>
          </div>

          {/* Load Input Mode Toggle */}
          <div className="form-group">
            <label>Load Specification</label>
            <div className="toggle-group">
              <button
                type="button"
                className={`toggle-btn ${formData.inputMode === 'amps' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, inputMode: 'amps', watts: '' }))}
              >
                Current (Amps)
              </button>
              <button
                type="button"
                className={`toggle-btn ${formData.inputMode === 'watts' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, inputMode: 'watts', current: '' }))}
              >
                Power (Watts)
              </button>
            </div>
          </div>

          {/* Current or Watts Input */}
          {formData.inputMode === 'amps' ? (
            <div className="form-group">
              <label htmlFor="current">Current Draw</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  id="current"
                  name="current"
                  value={formData.current}
                  onChange={handleChange}
                  min="0.1"
                  max="500"
                  step="0.1"
                  required
                />
                <span className="unit">Amps</span>
              </div>
              <p className="help-text">Continuous current draw of your device</p>
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="watts">Power Rating</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  id="watts"
                  name="watts"
                  value={formData.watts}
                  onChange={handleChange}
                  min="1"
                  max="6000"
                  step="1"
                  required
                />
                <span className="unit">Watts</span>
              </div>
              <p className="help-text">
                Power rating of your device (will convert to amps: {formData.watts ? (formData.watts / formData.systemVoltage).toFixed(1) : '0'}A @ {formData.systemVoltage}V)
              </p>
            </div>
          )}

          {/* Wire Length */}
          <div className="form-group">
            <label htmlFor="wireLength">Wire Run Length</label>
            <div className="input-with-controls">
              <div className="input-with-unit">
                <input
                  type="number"
                  id="wireLength"
                  name="wireLength"
                  value={formData.wireLength}
                  onChange={handleChange}
                  min="1"
                  max="200"
                  step="0.5"
                  required
                />
                <div className="unit-toggle">
                  <button
                    type="button"
                    className={`unit-btn ${formData.lengthUnit === 'ft' ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, lengthUnit: 'ft' }))}
                  >
                    ft
                  </button>
                  <button
                    type="button"
                    className={`unit-btn ${formData.lengthUnit === 'm' ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, lengthUnit: 'm' }))}
                  >
                    m
                  </button>
                </div>
              </div>
            </div>
            <div className="length-type-toggle">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.lengthType === 'one-way'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    lengthType: e.target.checked ? 'one-way' : 'round-trip'
                  }))}
                />
                <span>One-way (positive wire only - will calculate return path)</span>
              </label>
            </div>
          </div>

          {/* Voltage Drop Percentage */}
          <div className="form-group">
            <label htmlFor="voltageDropPercent">
              Acceptable Voltage Drop: {formData.voltageDropPercent}% ({voltageDropV}V)
            </label>
            <div className="slider-container">
              <input
                type="range"
                id="voltageDropPercent"
                name="voltageDropPercent"
                value={formData.voltageDropPercent}
                onChange={handleChange}
                min="1"
                max="5"
                step="0.5"
                className="slider"
              />
              <div className="slider-labels">
                <span>1% (Critical)</span>
                <span>3% (Standard)</span>
                <span>5% (Max)</span>
              </div>
            </div>
            <p className="help-text">Industry standard is 3% for most applications, 2% for critical loads</p>
          </div>

          {/* Advanced Options */}
          <div className="advanced-section">
            <button
              type="button"
              className="advanced-toggle"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? '▼' : '▶'} Advanced Options
            </button>

            {showAdvanced && (
              <div className="advanced-fields">
                <div className="form-group">
                  <label htmlFor="tempRating">Wire Temperature Rating</label>
                  <select
                    id="tempRating"
                    name="tempRating"
                    value={formData.tempRating}
                    onChange={handleChange}
                  >
                    <option value="60">60°C (140°F)</option>
                    <option value="75">75°C (167°F) - Standard</option>
                    <option value="90">90°C (194°F) - High temp</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="ambientTemp">Ambient Temperature</label>
                  <div className="input-with-unit">
                    <input
                      type="number"
                      id="ambientTemp"
                      name="ambientTemp"
                      value={formData.ambientTemp}
                      onChange={handleChange}
                      min="30"
                      max="150"
                      step="1"
                    />
                    <span className="unit">°F</span>
                  </div>
                  <p className="help-text">Engine bay installations typically 120-150°F</p>
                </div>

                <div className="form-group">
                  <label htmlFor="installMethod">Installation Method</label>
                  <select
                    id="installMethod"
                    name="installMethod"
                    value={formData.installMethod}
                    onChange={handleChange}
                  >
                    <option value="free-air">Free Air (open routing)</option>
                    <option value="conduit">Conduit/Bundled (4+ wires)</option>
                    <option value="engine-bay">Engine Bay (high heat)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary btn-calculate">
            Calculate Wire Size
          </button>
        </form>
      </div>
    </div>
  );
};

export default WireCalculatorForm;
