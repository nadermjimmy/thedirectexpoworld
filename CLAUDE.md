# Project: Immersive App with Google Meet

## Stack
- Front end: React + Vite + React Three Fiber / Three.js; WebXR via @react-three/xr
- Back end: NestJS (REST API in apps/api)
- Admin: React app in apps/admin
- Meet: Composio Google Meet MCP (server `googlemeet-composio`); app code in packages/meet
- Tests: Vitest for unit (tests/unit), Playwright for E2E (tests/e2e)
- Infra: Docker Compose locally; CI in infra/ci

## How to work
- 3D / WebXR / scene work → use the aframe-webxr and react-three-fiber skills.
- New full-stack feature → run: Feature Forge → Architecture Designer →
  Fullstack Guardian → Test Master → DevOps Engineer.
- Every feature ships with unit tests (Test Master) AND an E2E path (webapp-testing).
- Meet actions (create/schedule/transcripts) → use the googlemeet-composio MCP tools.
- Never commit secrets; COMPOSIO_API_KEY and Google OAuth creds live in .env (gitignored).
