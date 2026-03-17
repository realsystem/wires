#!/bin/bash

# Wire Gauge Calculator Deployment to overlandn.com/wires
#
# This project deploys to GitHub Pages, then nginx redirects overlandn.com/wires
# to the GitHub Pages URL.

echo "==================================="
echo "Wire Gauge Calculator Deployment"
echo "==================================="
echo ""

# Step 1: Build the project
echo "Step 1: Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✓ Build successful"
echo ""

# Step 2: Instructions for GitHub
echo "Step 2: Push to GitHub"
echo "-----------------------------------"
echo "1. Commit and push to main branch:"
echo "   git add ."
echo "   git commit -m 'Deploy update'"
echo "   git push origin main"
echo ""
echo "2. GitHub Actions will automatically deploy to GitHub Pages"
echo "   Monitor at: https://github.com/YOUR_USERNAME/wires/actions"
echo ""

# Step 3: Nginx configuration
echo "Step 3: Nginx Configuration"
echo "-----------------------------------"
echo "Add this to your nginx config for overlandn.com:"
echo ""
cat << 'EOF'
    location /wires {
        return 301 https://YOUR_GITHUB_USERNAME.github.io/wires$request_uri;
    }
EOF
echo ""
echo "Then reload nginx:"
echo "   sudo systemctl reload nginx"
echo ""

# Step 4: GitHub Pages setup
echo "Step 4: GitHub Pages Setup (First-time only)"
echo "-----------------------------------"
echo "1. Go to: https://github.com/YOUR_USERNAME/wires/settings/pages"
echo "2. Source: GitHub Actions"
echo "3. Ensure the deploy workflow has run successfully"
echo ""

echo "==================================="
echo "Deployment preparation complete!"
echo "==================================="
