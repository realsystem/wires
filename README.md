# Wire Gauge Calculator

Professional wire sizing calculator for RV, camper, and off-road electrical systems.

## Features

- **Dual Input Modes**: Enter current (amps) or device power (watts)
- **Flexible Length Units**: Feet or meters with one-way/round-trip calculation
- **Both 12V and 24V** systems supported
- **Quick Presets**: LED lights, fridge, inverter, solar, winch, aux lights
- **Advanced Options**: Temperature derating, wire type, installation method
- **Comprehensive Results**:
  - Wire gauge recommendation with ampacity
  - Voltage drop analysis with visual progress
  - Fuse/breaker sizing
  - Wire size comparison table
  - Installation best practices

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

Deploy to overlandn.com/wires:

```bash
# Build and deploy
./deploy-overlandn.sh
```

## Technology Stack

- **React** 18 - UI framework
- **Vite** 5 - Build tool
- **Vanilla CSS** - Styling with CSS variables

## Calculations

All calculations based on:
- **NEC** (National Electrical Code) Table 310.15(B)(16)
- **ABYC** E-11 (AC & DC Electrical Systems on Boats)
- Industry-standard voltage drop formula: `Vdrop = 2 × I × R × L / 1000`

## Wire Data

Includes AWG wire specifications:
- 18 AWG → 4/0 AWG
- Resistance (ohms per 1000 ft)
- Ampacity ratings at 60°C, 75°C, 90°C
- Temperature derating factors
- Installation method derating

## Use Cases

Optimized for common RV/off-road scenarios:
- Auxiliary lighting (10-20A, long runs)
- Travel fridges (5A continuous)
- Electric winches (200A continuous)
- Solar panels (5-40A, variable lengths)
- Inverters (40-170A, short runs)

## Safety Notes

- Always consult a professional electrician for complex installations
- Improper wiring can cause fires
- Install fuses within 18" of battery
- Use marine-grade tinned copper wire
- Protect wires through sharp edges and high-heat areas

## License

Private - Built for overlandn.com
