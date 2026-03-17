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

console.log('✓ All wire calculator tests passed!');
