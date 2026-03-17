# Docker Setup for Wire Gauge Calculator

## Overview

The Wire Gauge Calculator includes a complete Docker setup for both development and production environments.

## Architecture

### Production Build (Multi-stage)
1. **Stage 1 (Builder)**: Node.js 20 Alpine - builds the React app
2. **Stage 2 (Server)**: Nginx Alpine - serves static files

### Development Build
- Node.js 20 Alpine with volume mounting
- Hot reload enabled
- Source code changes reflect immediately

## Quick Commands

```bash
make help          # Show all available commands
make dev           # Development mode (http://localhost:3000)
make build         # Build production image
make run           # Run production (http://localhost:8080)
make test          # Run tests in Docker
make stop          # Stop containers
make clean         # Remove everything
```

## Usage Examples

### Development Workflow

```bash
# Start development server with hot reload
make dev

# In another terminal, watch logs
make logs-dev

# Run tests
make test

# Stop when done
make stop
```

### Production Testing

```bash
# Build and run production image
make build
make run

# Verify at http://localhost:8080

# Check logs
make logs

# Open shell in container (debugging)
make shell

# Stop
make stop
```

### Complete Rebuild

```bash
# Clean everything and rebuild
make rebuild
```

## Port Mapping

- **Development**: `3000:3000` (Vite dev server)
- **Production**: `8080:80` (Nginx)

## Environment Variables

Development mode sets:
- `NODE_ENV=development`

Production inherits from build-time environment.

## Volume Mounting

Development mode mounts:
- `.:/app` - Source code (hot reload)
- `/app/node_modules` - Anonymous volume (prevents host override)

## Nginx Configuration

Production uses custom `nginx.conf`:
- Gzip compression enabled
- Security headers set
- Static asset caching (1 year)
- SPA fallback routing
- Health check endpoint

## Docker Compose Profiles

- **Default**: Production service only
- **dev**: Development service (activated with `--profile dev`)

## Healthcheck

Production container includes health check:
- Interval: 30 seconds
- Timeout: 3 seconds
- Start period: 5 seconds
- Retries: 3

## Troubleshooting

### Container won't start
```bash
# Check logs
make logs

# Rebuild from scratch
make clean
make build
make run
```

### Port already in use
```bash
# Stop all containers
make stop

# Or modify ports in docker-compose.yml
```

### Development changes not reflected
```bash
# Ensure you're using dev mode
make dev

# Not production mode
make run  # This won't have hot reload
```

### Run tests without Docker
```bash
npm install
npm test
```

## CI/CD Integration

The Dockerfile is optimized for CI/CD:
- Multi-stage build (minimal final image size)
- Layer caching (faster rebuilds)
- No dev dependencies in production
- Health check for orchestration

## Performance

### Image Sizes
- **Production**: ~50MB (nginx:alpine + static files)
- **Builder stage**: ~400MB (includes Node.js + build tools)
- **Development**: ~400MB (Node.js with dev server)

### Build Times
- **First build**: ~1-2 minutes (downloads layers, installs deps)
- **Subsequent builds**: ~10-30 seconds (layer caching)
- **Development startup**: ~10-20 seconds (npm install)

## Security

Production image includes:
- Non-root user (nginx default)
- Security headers (X-Frame-Options, X-XSS-Protection, etc.)
- No build tools in final image
- No source code in final image (only dist/)
- .git directory blocked

## Best Practices

1. **Development**: Always use `make dev` for hot reload
2. **Testing**: Use `make test` to run in isolated environment
3. **Production**: Test with `make build && make run` before deploying
4. **Cleanup**: Run `make clean` periodically to free disk space
5. **Logs**: Monitor with `make logs` or `make logs-dev`

## Advanced Usage

### Custom docker-compose override

Create `docker-compose.override.yml` (gitignored):

```yaml
services:
  wire-calculator:
    ports:
      - "9000:80"  # Custom port
```

### Running specific npm commands

```bash
# In development container
docker exec -it wire-calculator-dev npm run build

# In production container
docker exec -it wire-calculator sh -c "ls -la /usr/share/nginx/html"
```

### Debugging

```bash
# Shell access
make shell

# Or for dev container
docker exec -it wire-calculator-dev sh

# View nginx config
docker exec -it wire-calculator cat /etc/nginx/conf.d/default.conf
```

## Network

Both containers use a bridge network `wire-network` for isolation and potential multi-container setups.

## Comparison with npm commands

| Task | Docker | npm |
|------|--------|-----|
| Development | `make dev` | `npm run dev` |
| Build | `make build` | `npm run build` |
| Test | `make test` | `npm test` |
| Production | `make run` | `npm run preview` |

Docker provides:
- ✓ Isolated environment
- ✓ Consistent across machines
- ✓ Production-like nginx setup
- ✓ No local Node.js required

npm provides:
- ✓ Faster startup
- ✓ Direct file system access
- ✓ Easier debugging
- ✓ Native performance
