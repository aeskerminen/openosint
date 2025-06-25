# OpenOSINT

OpenOSINT is an open-source platform for uploading, managing, and visualizing geolocated datapoints with image and metadata support. It is designed for OSINT (Open Source Intelligence) workflows, enabling users to upload images, annotate them with metadata, and explore them on an interactive map.

## Features

- **Frontend**: Modern React + TypeScript SPA with Vite, Redux, and Leaflet for map visualization.
- **Backend**: Node.js/Express API with MongoDB for data storage and Redis for job/status messaging.
- **Worker**: Python-based Redis worker for processing ML inference jobs.
- **End-to-End Testing**: Playwright for automated UI testing.
- **Containerized**: All services orchestrated via Docker Compose, including Nginx for HTTPS reverse proxy.

## Architecture

```
[User] ⇄ [Nginx HTTPS] ⇄ [Frontend (React)] ⇄ [Backend (Express API)] ⇄ [MongoDB, Redis, Python Worker]
```

- **Frontend**: `/openosint-frontend`  
  React app for uploading, browsing, and mapping datapoints.
- **Backend**: `/openosint-backend`  
  REST API for datapoint CRUD, file uploads, and job management.
- **Worker**: `/redis-worker`  
  Listens for jobs on Redis, runs ML inference, updates statuses.
- **Testing**: `/playwright`  
  Automated browser tests for the full stack.

## Quick Start

1. **Clone the repository**
2. **Generate certs to certs folder**
2. **Run all services**:
   ```bash
   docker-compose up --build
   ```
3. **Access the app**:  
   - Frontend: https://localhost  
   - API: https://localhost/api

## Usage

- Upload images with metadata (name, description, time, location)
- Browse and search datapoints
- Visualize datapoints on an interactive map
- Monitor ML job status in real time

## Contributing

Contributions are welcome! Please open issues or submit pull requests for new features, bug fixes, or improvements.

1. Fork the repo and clone your fork
2. Create a new branch for your feature or fix
3. Make your changes and add tests if applicable
4. Open a pull request describing your changes

## Technologies

- React, TypeScript, Vite, Redux, Leaflet
- Node.js, Express, MongoDB, Redis, Socket.IO
- Python (worker), Playwright (testing)
- Docker, Nginx

## License

MIT
