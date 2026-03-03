# Whizrobo Full-Stack Integration

This project should run as 3 services in one repo:

1. `project-frontend` (React + Vite)
2. `project-backend` (Node + Express API)
3. `project-rag-python` (Flask RAG service)

## Important Architecture

- Do not move Python code into React files.
- Keep Python as its own service, but inside this same repo.
- Request flow:
  - React -> `/api/rag/ask` (Express)
  - Express -> Flask endpoint (`RAG_FLASK_URL`)

## Folder Setup

Create this folder and place your full Flask app there:

```text
whizrobo-project/
  project-frontend/
  project-backend/
  project-rag-python/   <- put your Flask code here
```

## Backend Environment

In `project-backend/.env` set:

```env
RAG_FLASK_URL=http://127.0.0.1:5000/api/query
```

If your Flask route is different, update this URL only.

## Frontend Environment

In `project-frontend/.env` set:

```env
VITE_DEV_API_PROXY=http://localhost:5001
```

React now calls relative `/api` routes and Vite proxies in local dev.

## Run Locally

Open 3 terminals:

1. Flask service
```powershell
cd project-rag-python
python app.py
```

2. Backend API
```powershell
cd project-backend
npm install
npm run dev
```

3. Frontend
```powershell
cd project-frontend
npm install
npm run dev
```

## One-Command Start/Stop (Windows PowerShell)

From repo root:

```powershell
.\start-services.ps1
```

This starts Flask (`5000`), backend (`5001`), and frontend (`5173`) in background and writes logs to `.run/logs`.

To stop:

```powershell
.\stop-services.ps1
```

If you want to stop old tracked services first and then restart:

```powershell
.\start-services.ps1 -Clean
```

## Production Recommendation

- Serve frontend and backend under same domain (or reverse proxy via Nginx).
- Keep Flask internal/private network, not directly exposed to browser.
- Configure only backend `RAG_FLASK_URL` per environment.
- Set strict `CORS_ALLOWED_ORIGINS` (backend) and `CORS_ORIGINS` (Flask), never `*` for internet-facing deployments.
- Use a strong `JWT_SECRET` (32+ chars) and HTTPS so secure auth cookies are enforced.
- Run Flask with Gunicorn, for example:
  `gunicorn --chdir project-rag-python/backend -w 2 -b 0.0.0.0:5000 wsgi:app`
