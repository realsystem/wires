/**
 * Wire Calculator Tests
 * Run with: npm test
 */

import { test } from 'node:test';
import assert from 'node:assert';
import {
  wattsToAmps,
  convertLength,
  getAmpacity,
  calculateVoltageDrop,
  recommendWireGauge,
  recommendFuseSize,
  calculateWireSpecification
} from '../src/engine/wireCalculator.js';
import { safeSupportUrl } from '../src/utils/supportUrl.js';
import { USE_CASE_PRESETS } from '../src/engine/wireData.js';

// Test: Watts to Amps conversion
test('wattsToAmps converts correctly', () => {
  assert.strictEqual(wattsToAmps(120, 12), 10);
  assert.strictEqual(wattsToAmps(2000, 12), 166.66666666666666);
  assert.strictEqual(wattsToAmps(0, 12), 0);
});

// Test: Length conversion
test('convertLength converts between feet and meters', () => {
  assert.strictEqual(convertLength(10, 'ft', 'ft'), 10);
  assert.strictEqual(convertLength(10, 'm', 'm'), 10);
  const ftToM = convertLength(10, 'ft', 'm');
  assert.ok(Math.abs(ftToM - 3.048) < 0.001);
  const mToFt = convertLength(10, 'm', 'ft');
  assert.ok(Math.abs(mToFt - 32.8084) < 0.001);
});

// Test: Ampacity calculation
test('getAmpacity returns correct base ampacity', () => {
  const amp10awg = getAmpacity('10', { tempRating: 75 });
  assert.strictEqual(amp10awg, 35);

  const amp8awg = getAmpacity('8', { tempRating: 75 });
  assert.strictEqual(amp8awg, 50);
});

// Test: Voltage drop calculation
test('calculateVoltageDrop calculates correctly', () => {
  // 15A at 25ft one-way with 10 AWG
  const drop = calculateVoltageDrop(15, 25, '10', { lengthType: 'one-way' });
  // Expected: 15 * 1.02 * (50 / 1000) = 0.765V
  assert.ok(Math.abs(drop - 0.765) < 0.001);
});

// Test: LED Light Bar preset
test('LED Light Bar (15A, 25ft, 12V) recommends appropriate wire', () => {
  const result = recommendWireGauge(12, 15, 25, 3, { lengthType: 'one-way' });
  // 15A at 25ft one-way (50ft round-trip) needs 6 AWG to stay under 3% drop
  assert.strictEqual(result.gauge, '6');
  assert.ok(result.meetsRequirements);
  assert.ok(result.voltageDropPercent <= 3);
});

// Test: 12V Fridge preset
test('12V Fridge (5A, 10ft, 12V) recommends appropriate wire', () => {
  const result = recommendWireGauge(12, 5, 10, 2, { lengthType: 'one-way' });
  assert.ok(result.meetsRequirements);
  assert.ok(result.voltageDropPercent <= 2);
});

// Test: 2000W Inverter preset
test('2000W Inverter (170A, 6ft, 12V) recommends large wire', () => {
  const result = recommendWireGauge(12, 170, 6, 2, { lengthType: 'one-way' });
  // Should recommend 2/0 or larger
  const validGauges = ['4/0', '3/0', '2/0', '1/0'];
  assert.ok(validGauges.includes(result.gauge));
});

// Test: Winch preset
test('Winch (200A, 8ft, 12V) recommends very large wire', () => {
  const result = recommendWireGauge(12, 200, 8, 3, { lengthType: 'one-way' });
  // Should recommend 3/0 or larger
  const validGauges = ['4/0', '3/0', '2/0'];
  assert.ok(validGauges.includes(result.gauge));
});

// Test: Solar Panel preset
test('Solar Panel (12A, 30ft, 12V) recommends appropriate wire', () => {
  const result = recommendWireGauge(12, 12, 30, 2, { lengthType: 'one-way' });
  assert.ok(result.meetsRequirements);
  assert.ok(result.voltageDropPercent <= 2);
});

// Test: Fuse sizing
test('recommendFuseSize provides appropriate fuse for 15A load', () => {
  const result = recommendFuseSize(15, '10', { tempRating: 75 });
  assert.ok(result.recommended);
  assert.ok(result.recommended >= 15 * 1.25); // At least 125% of load
  assert.ok(result.recommended <= 35); // Not more than wire ampacity
});

// Test: Complete specification calculation
test('calculateWireSpecification returns complete results', () => {
  const input = {
    systemVoltage: 12,
    current: 15,
    wireLength: 25,
    lengthUnit: 'ft',
    lengthType: 'one-way',
    voltageDropPercent: 3
  };

  const result = calculateWireSpecification(input);

  assert.ok(result.input);
  assert.ok(result.recommendation);
  assert.ok(result.fuse);
  assert.ok(result.alternatives);
  assert.ok(result.guidance);

  assert.strictEqual(result.recommendation.gauge, '6');
  assert.ok(result.fuse.recommended);
  assert.ok(Array.isArray(result.alternatives));
  assert.ok(result.alternatives.length > 0);
  assert.ok(Array.isArray(result.guidance));
  assert.ok(result.guidance.length > 0);
});

// Test: Watts input mode
test('calculateWireSpecification handles watts input', () => {
  const input = {
    systemVoltage: 12,
    watts: 180, // 15A @ 12V
    wireLength: 25,
    lengthUnit: 'ft',
    lengthType: 'one-way',
    voltageDropPercent: 3
  };

  const result = calculateWireSpecification(input);
  assert.strictEqual(result.input.current, 15);
  assert.strictEqual(result.recommendation.gauge, '6');
});

// Test: 24V system
test('24V system calculates correctly', () => {
  const result = recommendWireGauge(24, 15, 25, 3, { lengthType: 'one-way' });
  // Same current but higher voltage = same voltage drop percentage
  // but different absolute voltage drop
  assert.ok(result.meetsRequirements);
});

// Regression: a recommended wire must always come with a usable standard fuse
test('every recommendation that meets requirements has a standard fuse', () => {
  for (const volts of [12, 24]) {
    for (let amps = 1; amps <= 200; amps += 0.5) {
      const r = calculateWireSpecification({
        systemVoltage: volts, current: amps, wireLength: 3, voltageDropPercent: 5
      });
      if (r.recommendation.meetsRequirements) {
        assert.ok(r.fuse.recommended, `${amps}A @ ${volts}V on ${r.recommendation.gauge} AWG has no fuse`);
      }
    }
  }
});

// Regression: fuse must protect the wire and the load
test('fuse stays between load x ratio and wire ampacity', () => {
  const r = calculateWireSpecification({
    systemVoltage: 12, current: 52, wireLength: 3, voltageDropPercent: 5
  });
  assert.ok(r.fuse.recommended >= 52 * 1.25);
  assert.ok(r.fuse.recommended <= r.fuse.wireAmpacity);
});

// Regression: <select> values arrive as strings
test('string tempRating from the form behaves like the number', () => {
  const base = { systemVoltage: 12, current: 20, wireLength: 10, ambientTemp: 104 };
  const asString = calculateWireSpecification({ ...base, tempRating: '90' });
  const asNumber = calculateWireSpecification({ ...base, tempRating: 90 });
  assert.strictEqual(asString.recommendation.ampacity, asNumber.recommendation.ampacity);
  assert.strictEqual(getAmpacity('10', { tempRating: '90', ambientTemp: 104 }),
    getAmpacity('10', { tempRating: 90, ambientTemp: 104 }));
});

test('90C wire derates less than 75C wire, 60C more', () => {
  const at = (tempRating) => getAmpacity('10', { tempRating, ambientTemp: 104 });
  assert.ok(at(90) > at(75));
  assert.ok(at(75) > at(60));
});

// Temperature bands round up: 90F is in the 87-95F band
test('ambient temperature just above 86F is derated', () => {
  assert.ok(getAmpacity('10', { ambientTemp: 90 }) < getAmpacity('10', { ambientTemp: 77 }));
});

test('engine bay does not double-count heat', () => {
  const free = getAmpacity('4', { installMethod: 'free-air' });
  assert.strictEqual(getAmpacity('4', { installMethod: 'engine-bay' }), Math.floor(free * 0.8));
});

// Winch preset is intermittent and must produce a clean, fused result
test('winch preset is a valid recommendation with a fuse', () => {
  const p = USE_CASE_PRESETS.winch;
  const r = calculateWireSpecification({
    systemVoltage: p.voltage, current: p.current, wireLength: p.wireLength,
    lengthType: p.lengthType, voltageDropPercent: p.voltageDropPercent, loadDuty: p.loadDuty
  });
  assert.ok(r.recommendation.meetsRequirements);
  assert.ok(r.fuse.recommended);
  assert.ok(r.guidance.some(g => /Intermittent load/.test(g.text)));
});

test('all presets produce a recommendation that meets requirements', () => {
  for (const [name, p] of Object.entries(USE_CASE_PRESETS)) {
    const r = calculateWireSpecification({
      systemVoltage: p.voltage, current: p.current, wireLength: p.wireLength,
      lengthType: p.lengthType, voltageDropPercent: p.voltageDropPercent, loadDuty: p.loadDuty
    });
    assert.ok(r.recommendation.meetsRequirements, name);
    assert.ok(r.fuse.recommended, name);
  }
});

test('invalid input throws a readable error', () => {
  assert.throws(() => calculateWireSpecification({ systemVoltage: 12, current: NaN, wireLength: 10 }), /greater than zero/);
  assert.throws(() => calculateWireSpecification({ systemVoltage: 12, current: 10, wireLength: 0 }), /Wire length/);
});

test('cost factor scales with copper cross-section', () => {
  const r = calculateWireSpecification({ systemVoltage: 12, current: 15, wireLength: 25, voltageDropPercent: 3 });
  const rec = r.alternatives.find(a => a.isRecommended);
  const larger = r.alternatives.find(a => a.gauge === '4');
  assert.strictEqual(rec.relativeCost, 1);
  assert.ok(larger.relativeCost > 1.5); // (0.204/0.162)^2 ~ 1.59
});

// Support button link
test('support link accepts only plain https URLs', () => {
  assert.strictEqual(safeSupportUrl('https://buymeacoffee.com/someone'), 'https://buymeacoffee.com/someone');
  assert.strictEqual(safeSupportUrl('buymeacoffee.com/example'), 'https://buymeacoffee.com/example');
  assert.strictEqual(safeSupportUrl('  https://buymeacoffee.com/example  '), 'https://buymeacoffee.com/example');
  for (const bad of ['', undefined, null, 'javascript:alert(1)', 'http://example.com', 'data:text/html,x', 'https://localhost', 'not a url']) {
    assert.strictEqual(safeSupportUrl(bad), null, String(bad));
  }
});

console.log('✓ All wire calculator tests passed!');
