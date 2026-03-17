# Wire Gauge Calculator - Deployment Guide

## Quick Start

```bash
# Install dependencies
npm install

# Development
npm run dev        # Start dev server at http://localhost:5173

# Build
npm run build      # Build for production to ./dist

# Test
npm test          # Run calculation tests
```

## Deployment to overlandn.com/wires

The wire calculator deploys to GitHub Pages and is accessible via overlandn.com/wires through nginx redirect.

### Initial Setup (One-time)

1. **Create GitHub Repository**
   ```bash
   cd /Users/segorov/Projects/wires
   git init
   git add .
   git commit -m "Initial commit: Wire Gauge Calculator"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/wires.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to: `https://github.com/YOUR_USERNAME/wires/settings/pages`
   - Source: **GitHub Actions**
   - Save

3. **Configure nginx on overlandn.com**
   Add to your nginx configuration:
   ```nginx
   location /wires {
       return 301 https://YOUR_GITHUB_USERNAME.github.io/wires$request_uri;
   }
   ```

   Then reload:
   ```bash
   sudo systemctl reload nginx
   ```

### Regular Deployments

Every push to `main` branch automatically deploys:

```bash
# Make changes
git add .
git commit -m "Your commit message"
git push origin main
```

Monitor deployment at: `https://github.com/YOUR_USERNAME/wires/actions`

### Using Deploy Script

```bash
./deploy-overlandn.sh
```

This will:
1. Build the project locally
2. Show instructions for pushing to GitHub
3. Display nginx configuration reminder

## File Structure

```
/Users/segorov/Projects/wires/
├── src/
│   ├── App.jsx                          # Main app component
│   ├── main.jsx                         # Entry point
│   ├── components/
│   │   ├── WireCalculatorForm.jsx       # Input form with presets
│   │   ├── WireResultsDisplay.jsx       # Results container
│   │   └── results/
│   │       ├── WireRecommendation.jsx   # Wire gauge recommendation
│   │       ├── VoltageDropAnalysis.jsx  # Voltage drop details
│   │       ├── FuseRecommendation.jsx   # Fuse sizing
│   │       ├── WireComparison.jsx       # Alternative wire sizes
│   │       └── InstallationGuidance.jsx # Best practices
│   ├── engine/
│   │   ├── wireData.js                  # AWG tables and constants
│   │   └── wireCalculator.js            # Calculation logic
│   └── styles/
│       ├── global.css                   # CSS variables and base
│       ├── App.css                      # App layout
│       └── [component].css              # Component styles
├── tests/
│   └── wireCalculator.test.js           # Calculation tests
├── .github/
│   └── workflows/
│       └── deploy.yml                   # GitHub Actions deployment
├── package.json                         # Dependencies and scripts
├── vite.config.js                       # Vite build configuration
├── index.html                           # HTML entry point
└── deploy-overlandn.sh                  # Deployment helper script
```

## URLs

- **Production**: https://overlandn.com/wires
- **GitHub Pages**: https://YOUR_USERNAME.github.io/wires
- **Development**: http://localhost:5173

## Technology

- **React** 18.3.1
- **Vite** 5.3.1
- **Node.js** 20.x (required)
- **Vanilla CSS** with CSS variables

## Troubleshooting

### Build fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### GitHub Pages not updating
1. Check Actions tab: https://github.com/YOUR_USERNAME/wires/actions
2. Ensure GitHub Pages is set to "GitHub Actions" source
3. Verify the workflow completed successfully

### nginx redirect not working
```bash
# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
```

## Verification Checklist

After deployment, verify:
- [ ] https://overlandn.com/wires loads correctly
- [ ] All presets work (LED, Fridge, Winch, Solar, Inverter, Aux Lights)
- [ ] Unit toggle (ft/m) works
- [ ] Voltage drop slider updates properly
- [ ] Results display all sections
- [ ] Mobile responsive (test on phone)
- [ ] Advanced options expand/collapse
- [ ] Back button returns to overlandn.com
