/**
 * Wire Gauge Calculator Engine
 * Calculations based on NEC standards and Ohm's law
 */

import {
  AWG_COPPER_DATA,
  AWG_SIZES_ORDERED,
  STANDARD_FUSE_SIZES,
  TEMP_DERATING_FACTORS,
  INSTALLATION_DERATING,
  FEET_TO_METERS,
  METERS_TO_FEET
} from './wireData.js';

/**
 * Convert watts to amps
 */
export function wattsToAmps(watts, voltage) {
  if (!watts || !voltage) return 0;
  return watts / voltage;
}

/**
 * Convert wire length based on unit
 */
export function convertLength(length, fromUnit, toUnit) {
  if (fromUnit === toUnit) return length;
  if (fromUnit === 'ft' && toUnit === 'm') return length * FEET_TO_METERS;
  if (fromUnit === 'm' && toUnit === 'ft') return length * METERS_TO_FEET;
  return length;
}

/**
 * Get temperature derating factor
 */
function getTempDeratingFactor(ambientTempF, wireRating) {
  const rating = wireRating === 90 ? 90 : 75;
  const factors = TEMP_DERATING_FACTORS[rating];

  if (ambientTempF <= 86) return 1.0;

  // Find closest temperature in table
  const temps = Object.keys(factors).map(Number).sort((a, b) => a - b);
  const closestTemp = temps.reduce((prev, curr) =>
    Math.abs(curr - ambientTempF) < Math.abs(prev - ambientTempF) ? curr : prev
  );

  return factors[closestTemp];
}

/**
 * Get ampacity for a wire gauge with derating applied
 */
export function getAmpacity(gauge, options = {}) {
  const {
    tempRating = 75,
    ambientTemp = 77,
    installMethod = 'free-air'
  } = options;

  const wireData = AWG_COPPER_DATA[gauge];
  if (!wireData) return 0;

  // Get base ampacity for temperature rating
  const baseAmpacity = wireData[`ampacity${tempRating}C`];

  // Apply temperature derating
  let derated = baseAmpacity;
  if (ambientTemp > 86) {
    const tempFactor = getTempDeratingFactor(ambientTemp, tempRating);
    derated *= tempFactor;
  }

  // Apply installation method derating
  const installFactor = INSTALLATION_DERATING[installMethod]?.factor || 1.0;
  derated *= installFactor;

  return Math.floor(derated);
}

/**
 * Calculate voltage drop for a given wire gauge and parameters
 * Formula: Vdrop = 2 × I × R × L / 1000
 * (Factor of 2 accounts for round-trip: positive + negative wire)
 */
export function calculateVoltageDrop(current, wireLengthFeet, wireGauge, options = {}) {
  const { lengthType = 'one-way' } = options;

  const wireData = AWG_COPPER_DATA[wireGauge];
  if (!wireData) return 0;

  const resistance = wireData.resistance; // ohms per 1000 ft

  // Calculate total wire length (round-trip if one-way specified)
  const totalLength = lengthType === 'one-way' ? wireLengthFeet * 2 : wireLengthFeet;

  // Voltage drop = current × resistance × (length / 1000)
  const voltageDrop = current * resistance * (totalLength / 1000);

  return voltageDrop;
}

/**
 * Recommend wire gauge based on requirements
 */
export function recommendWireGauge(systemVoltage, current, wireLengthFeet, maxDropPercent, options = {}) {
  const maxDropVoltage = systemVoltage * (maxDropPercent / 100);

  // Try each wire size from smallest to largest
  for (let i = AWG_SIZES_ORDERED.length - 1; i >= 0; i--) {
    const gauge = AWG_SIZES_ORDERED[i];
    const voltageDrop = calculateVoltageDrop(current, wireLengthFeet, gauge, options);
    const ampacity = getAmpacity(gauge, options);

    // Wire must meet BOTH criteria:
    // 1. Voltage drop within acceptable range
    // 2. Current within 80% of ampacity (safety margin)
    const maxSafeCurrent = ampacity * 0.8;

    if (voltageDrop <= maxDropVoltage && current <= maxSafeCurrent) {
      return {
        gauge,
        voltageDrop,
        voltageDropPercent: (voltageDrop / systemVoltage) * 100,
        ampacity,
        maxSafeCurrent,
        voltageAtLoad: systemVoltage - voltageDrop,
        powerLoss: voltageDrop * current,
        meetsRequirements: true
      };
    }
  }

  // If no wire meets requirements, return largest size with warning
  const gauge = '4/0';
  const voltageDrop = calculateVoltageDrop(current, wireLengthFeet, gauge, options);
  const ampacity = getAmpacity(gauge, options);

  return {
    gauge,
    voltageDrop,
    voltageDropPercent: (voltageDrop / systemVoltage) * 100,
    ampacity,
    maxSafeCurrent: ampacity * 0.8,
    voltageAtLoad: systemVoltage - voltageDrop,
    powerLoss: voltageDrop * current,
    meetsRequirements: false,
    warning: 'Load exceeds safe wiring capacity. Consider splitting circuit, relocating battery, or upgrading to 24V system.'
  };
}

/**
 * Recommend fuse/breaker size
 * Fuse protects the wire, not the load
 */
export function recommendFuseSize(current, wireGauge, options = {}) {
  const ampacity = getAmpacity(wireGauge, options);

  // Minimum fuse: 125% of continuous load (NEC requirement)
  const minFuse = Math.ceil(current * 1.25);

  // Maximum fuse: Cannot exceed wire ampacity
  const maxFuse = ampacity;

  // Find smallest standard fuse size >= minFuse and <= maxFuse
  const recommended = STANDARD_FUSE_SIZES.find(size => size >= minFuse && size <= maxFuse);

  if (!recommended) {
    return {
      recommended: null,
      min: minFuse,
      max: maxFuse,
      warning: 'No standard fuse size fits requirements. Consult a professional electrician.'
    };
  }

  return {
    recommended,
    min: minFuse,
    max: maxFuse,
    loadCurrent: current,
    wireAmpacity: ampacity,
    warning: null
  };
}

/**
 * Get alternative wire size options for comparison
 */
export function getAlternativeWireSizes(systemVoltage, current, wireLengthFeet, maxDropPercent, recommendedGauge, options = {}) {
  const recommendedIndex = AWG_SIZES_ORDERED.indexOf(recommendedGauge);
  const alternatives = [];

  // Get 2 sizes larger and 2 sizes smaller than recommended
  for (let offset = -2; offset <= 2; offset++) {
    const index = recommendedIndex + offset;
    if (index < 0 || index >= AWG_SIZES_ORDERED.length) continue;

    const gauge = AWG_SIZES_ORDERED[index];
    const voltageDrop = calculateVoltageDrop(current, wireLengthFeet, gauge, options);
    const voltageDropPercent = (voltageDrop / systemVoltage) * 100;
    const ampacity = getAmpacity(gauge, options);
    const maxSafeCurrent = ampacity * 0.8;

    const meetsVoltageDrop = voltageDropPercent <= maxDropPercent;
    const meetsAmpacity = current <= maxSafeCurrent;

    // Rough cost factor (larger wire = more expensive)
    const wireData = AWG_COPPER_DATA[gauge];
    const relativeCost = wireData.diameter / AWG_COPPER_DATA[recommendedGauge].diameter;

    alternatives.push({
      gauge,
      voltageDrop,
      voltageDropPercent,
      ampacity,
      meetsVoltageDrop,
      meetsAmpacity,
      meetsRequirements: meetsVoltageDrop && meetsAmpacity,
      isRecommended: gauge === recommendedGauge,
      relativeCost
    });
  }

  return alternatives.sort((a, b) => {
    const aIndex = AWG_SIZES_ORDERED.indexOf(a.gauge);
    const bIndex = AWG_SIZES_ORDERED.indexOf(b.gauge);
    return aIndex - bIndex;
  });
}

/**
 * Generate installation guidance based on parameters
 */
export function generateInstallationGuidance(current, wireGauge, wireLengthFeet, systemVoltage, fuse) {
  const guidance = [];

  // Wire type recommendation
  guidance.push({
    icon: '',
    text: 'Use marine-grade tinned copper wire for corrosion resistance'
  });

  // Fuse placement
  if (fuse && fuse.recommended) {
    guidance.push({
      icon: '',
      text: `Install ${fuse.recommended}A fuse within 18" of battery positive terminal`
    });
  }

  // Terminal recommendations
  guidance.push({
    icon: '',
    text: 'Use insulated ring terminals with heat-shrink adhesive liner'
  });

  // Wire protection
  guidance.push({
    icon: '',
    text: 'Protect wire through firewall and sharp edges with grommets'
  });

  // Wire securing
  guidance.push({
    icon: '',
    text: 'Secure wire every 18" with UV-resistant zip ties or clamps'
  });

  // High current warnings
  if (current > 100) {
    guidance.push({
      icon: '⚠️',
      text: 'High-current installation - Consider professional installation',
      type: 'warning'
    });
  }

  if (current > 50) {
    guidance.push({
      icon: '⚠️',
      text: 'Consider battery relocation or auxiliary battery for shorter wire runs',
      type: 'warning'
    });
  }

  // Long run warnings
  if (wireLengthFeet > 50) {
    guidance.push({
      icon: '⚠️',
      text: 'Very long wire run - Consider upgrading to 24V system to reduce current',
      type: 'warning'
    });
  }

  // Grounding
  guidance.push({
    icon: '',
    text: 'Use same gauge wire for both positive AND negative (ground) runs'
  });

  return guidance;
}

/**
 * Calculate complete wire specification
 */
export function calculateWireSpecification(input) {
  const {
    systemVoltage,
    current: inputCurrent,
    watts,
    wireLength,
    lengthUnit = 'ft',
    lengthType = 'one-way',
    voltageDropPercent = 3,
    tempRating = 75,
    ambientTemp = 77,
    installMethod = 'free-air'
  } = input;

  // Determine current
  const current = watts ? wattsToAmps(watts, systemVoltage) : inputCurrent;

  // Convert length to feet for calculations
  const wireLengthFeet = lengthUnit === 'm' ? convertLength(wireLength, 'm', 'ft') : wireLength;

  // Calculation options
  const options = {
    lengthType,
    tempRating,
    ambientTemp,
    installMethod
  };

  // Get wire recommendation
  const recommendation = recommendWireGauge(
    systemVoltage,
    current,
    wireLengthFeet,
    voltageDropPercent,
    options
  );

  // Get fuse recommendation
  const fuse = recommendFuseSize(current, recommendation.gauge, options);

  // Get alternative wire sizes
  const alternatives = getAlternativeWireSizes(
    systemVoltage,
    current,
    wireLengthFeet,
    voltageDropPercent,
    recommendation.gauge,
    options
  );

  // Get installation guidance
  const guidance = generateInstallationGuidance(
    current,
    recommendation.gauge,
    wireLengthFeet,
    systemVoltage,
    fuse
  );

  // Get wire data
  const wireData = AWG_COPPER_DATA[recommendation.gauge];

  return {
    input: {
      systemVoltage,
      current,
      watts,
      wireLength,
      lengthUnit,
      lengthType,
      wireLengthFeet,
      voltageDropPercent,
      tempRating,
      ambientTemp,
      installMethod
    },
    recommendation: {
      ...recommendation,
      wireData
    },
    fuse,
    alternatives,
    guidance
  };
}
