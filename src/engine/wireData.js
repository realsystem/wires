/**
 * AWG Wire Data and Constants
 * Based on NEC Table 310.15(B)(16) and industry standards
 */

// Copper wire resistance in ohms per 1000 feet at 75°C
// Ampacity ratings for copper conductors in free air
export const AWG_COPPER_DATA = {
  '4/0': {
    resistance: 0.0500,
    ampacity60C: 195,
    ampacity75C: 230,
    ampacity90C: 260,
    diameter: 0.460,
    diameterMm: 11.68,
    label: '4/0 AWG'
  },
  '3/0': {
    resistance: 0.0630,
    ampacity60C: 165,
    ampacity75C: 200,
    ampacity90C: 225,
    diameter: 0.410,
    diameterMm: 10.41,
    label: '3/0 AWG'
  },
  '2/0': {
    resistance: 0.0795,
    ampacity60C: 145,
    ampacity75C: 175,
    ampacity90C: 195,
    diameter: 0.365,
    diameterMm: 9.27,
    label: '2/0 AWG'
  },
  '1/0': {
    resistance: 0.100,
    ampacity60C: 125,
    ampacity75C: 150,
    ampacity90C: 170,
    diameter: 0.325,
    diameterMm: 8.25,
    label: '1/0 AWG'
  },
  '1': {
    resistance: 0.126,
    ampacity60C: 110,
    ampacity75C: 130,
    ampacity90C: 145,
    diameter: 0.289,
    diameterMm: 7.35,
    label: '1 AWG'
  },
  '2': {
    resistance: 0.159,
    ampacity60C: 95,
    ampacity75C: 115,
    ampacity90C: 130,
    diameter: 0.258,
    diameterMm: 6.54,
    label: '2 AWG'
  },
  '4': {
    resistance: 0.253,
    ampacity60C: 70,
    ampacity75C: 85,
    ampacity90C: 95,
    diameter: 0.204,
    diameterMm: 5.19,
    label: '4 AWG'
  },
  '6': {
    resistance: 0.403,
    ampacity60C: 55,
    ampacity75C: 65,
    ampacity90C: 75,
    diameter: 0.162,
    diameterMm: 4.11,
    label: '6 AWG'
  },
  '8': {
    resistance: 0.641,
    ampacity60C: 40,
    ampacity75C: 50,
    ampacity90C: 55,
    diameter: 0.128,
    diameterMm: 3.26,
    label: '8 AWG'
  },
  '10': {
    resistance: 1.02,
    ampacity60C: 30,
    ampacity75C: 35,
    ampacity90C: 40,
    diameter: 0.102,
    diameterMm: 2.59,
    label: '10 AWG'
  },
  '12': {
    resistance: 1.62,
    ampacity60C: 25,
    ampacity75C: 25,
    ampacity90C: 30,
    diameter: 0.081,
    diameterMm: 2.05,
    label: '12 AWG'
  },
  '14': {
    resistance: 2.58,
    ampacity60C: 20,
    ampacity75C: 20,
    ampacity90C: 25,
    diameter: 0.064,
    diameterMm: 1.63,
    label: '14 AWG'
  },
  '16': {
    resistance: 4.09,
    ampacity60C: 18,
    ampacity75C: 18,
    ampacity90C: 18,
    diameter: 0.051,
    diameterMm: 1.29,
    label: '16 AWG'
  },
  '18': {
    resistance: 6.51,
    ampacity60C: 16,
    ampacity75C: 16,
    ampacity90C: 16,
    diameter: 0.040,
    diameterMm: 1.02,
    label: '18 AWG'
  }
};

// AWG sizes ordered from largest to smallest
export const AWG_SIZES_ORDERED = ['4/0', '3/0', '2/0', '1/0', '1', '2', '4', '6', '8', '10', '12', '14', '16', '18'];

// Standard fuse/breaker sizes (amps)
export const STANDARD_FUSE_SIZES = [
  5, 7.5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
  60, 70, 80, 100, 125, 150, 175, 200, 225, 250,
  300, 350, 400
];

// Temperature derating factors for ambient temperatures above 86°F (30°C)
// Based on NEC Table 310.15(B)(2)(a)
export const TEMP_DERATING_FACTORS = {
  75: { // 75°C rated wire
    86: 1.00,
    95: 0.94,
    104: 0.88,
    113: 0.82,
    122: 0.75,
    131: 0.67,
    140: 0.58,
    149: 0.47,
    158: 0.33,
    167: 0.00
  },
  90: { // 90°C rated wire
    86: 1.00,
    95: 0.96,
    104: 0.91,
    113: 0.87,
    122: 0.82,
    131: 0.76,
    140: 0.71,
    149: 0.65,
    158: 0.58,
    167: 0.50,
    176: 0.41,
    185: 0.29,
    194: 0.00
  }
};

// Use case presets for common RV/off-road applications
export const USE_CASE_PRESETS = {
  ledLightBar: {
    name: 'LED Light Bar',
    description: '50" LED light bar (typical draw)',
    voltage: 12,
    current: 15,
    wireLength: 25,
    lengthType: 'one-way',
    voltageDropPercent: 3,
    unit: 'ft'
  },
  travelFridge: {
    name: '12V Travel Fridge',
    description: 'Portable fridge/freezer (continuous draw)',
    voltage: 12,
    current: 5,
    wireLength: 10,
    lengthType: 'one-way',
    voltageDropPercent: 2,
    unit: 'ft'
  },
  winch: {
    name: 'Electric Winch',
    description: '9500lb winch (continuous rating)',
    voltage: 12,
    current: 200,
    wireLength: 8,
    lengthType: 'one-way',
    voltageDropPercent: 3,
    unit: 'ft'
  },
  solar: {
    name: 'Solar Panel',
    description: '200W solar panel charging',
    voltage: 12,
    current: 12,
    wireLength: 30,
    lengthType: 'one-way',
    voltageDropPercent: 2,
    unit: 'ft'
  },
  inverter: {
    name: '2000W Inverter',
    description: 'Pure sine wave inverter',
    voltage: 12,
    current: 170,
    wireLength: 6,
    lengthType: 'one-way',
    voltageDropPercent: 2,
    unit: 'ft'
  },
  auxLights: {
    name: 'Auxiliary Lights',
    description: 'Rock lights, camp lights',
    voltage: 12,
    current: 10,
    wireLength: 20,
    lengthType: 'one-way',
    voltageDropPercent: 3,
    unit: 'ft'
  }
};

// Wire type specifications
export const WIRE_TYPES = {
  copper: {
    name: 'Copper',
    resistanceFactor: 1.0,
    recommended: true,
    notes: 'Standard for automotive and marine applications'
  },
  aluminum: {
    name: 'Aluminum/CCA',
    resistanceFactor: 1.6,
    recommended: false,
    notes: 'NOT recommended for automotive use - higher resistance and corrosion risk'
  }
};

// Installation method derating
export const INSTALLATION_DERATING = {
  'free-air': {
    name: 'Free Air',
    factor: 1.0,
    description: 'Wire run in open air or loosely bundled'
  },
  'conduit': {
    name: 'Conduit/Bundled',
    factor: 0.8,
    description: 'Wire in conduit or tightly bundled (4+ conductors)'
  },
  'engine-bay': {
    name: 'Engine Bay',
    factor: 0.7,
    description: 'High temperature environment (150°F+)'
  }
};

// Convert feet to meters and vice versa
export const FEET_TO_METERS = 0.3048;
export const METERS_TO_FEET = 3.28084;
