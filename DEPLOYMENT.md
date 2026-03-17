# Deployment

## Local Development

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # Run tests
```

## Docker

```bash
make dev           # Development (http://localhost:3000)
make build         # Build production image
make run           # Production (http://localhost:8080)
make test          # Run tests in Docker
```

## Deploy to overlandn.com/wires

Push to `main` branch auto-deploys via GitHub Actions:

```bash
git push origin main
```

### Initial Setup

1. Enable GitHub Pages: Settings → Pages → Source: **GitHub Actions**
2. Add nginx redirect:
   ```nginx
   location /wires {
       return 301 https://realsystem.github.io/wires$request_uri;
   }
   ```
3. Reload: `sudo systemctl reload nginx`
