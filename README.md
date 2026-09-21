# Timesheet Frontend

React + Vite frontend application for the Timesheet system.

The application is deployed on a VPS using:

- React
- Vite
- Docker
- Nginx
- Traefik
- HTTPS / Let's Encrypt

---

## Production URLs

### Frontend

```text
https://timesheet.dinnusmart.com
```

### Backend API

```text
https://timesheet-api.dinnusmart.com/api
```

---

# 1. Project Structure

```text
timesheet-frontend/
│
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── types/
│   └── ...
│
├── .env.production
├── .gitignore
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── package.json
├── package-lock.json
├── vite.config.ts
└── index.html
```

---

# 2. Environment Variables

Create:

```text
.env.production
```

with:

```env
VITE_API_URL=https://timesheet-api.dinnusmart.com/api
```

The frontend API configuration:

```ts
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";
```

will use the production value during the Vite build.

---

# 3. Important Vite Behavior

Vite environment variables are embedded into the application during:

```bash
npm run build
```

Therefore, after changing:

```env
VITE_API_URL=...
```

you must rebuild the Docker image.

```bash
docker compose build --no-cache
docker compose up -d
```

Changing `.env.production` without rebuilding the frontend container will not update the already-built JavaScript files.

---

# 4. Local Development

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build locally:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

# 5. Test API URL Locally

During production configuration, the frontend should call:

```text
https://timesheet-api.dinnusmart.com/api
```

For login:

```text
POST https://timesheet-api.dinnusmart.com/api/auth/login
```

It should NOT call:

```text
http://localhost:3000/api/auth/login
```

when running in production.

---

# 6. Dockerfile

The production Dockerfile uses a multi-stage build.

```dockerfile
# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

# 7. Nginx Configuration

The application uses Nginx to serve the Vite production files.

`nginx.conf`:

```nginx
server {
    listen 80;

    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        try_files $uri =404;
        access_log off;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

The following line is important for React Router:

```nginx
try_files $uri $uri/ /index.html;
```

It allows routes such as:

```text
/login
/dashboard
/employees
/timesheets
/reports
```

to work correctly after refreshing the page.

---

# 8. Docker Compose

Production `docker-compose.yml`:

```yaml
services:
  frontend:
    build: .
    container_name: timesheet-frontend
    restart: unless-stopped

    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.timesheet-frontend.rule=Host(`timesheet.dinnusmart.com`)"
      - "traefik.http.routers.timesheet-frontend.entrypoints=websecure"
      - "traefik.http.routers.timesheet-frontend.tls=true"
      - "traefik.http.routers.timesheet-frontend.tls.certresolver=letsencrypt"
      - "traefik.http.services.timesheet-frontend.loadbalancer.server.port=80"
```

There is intentionally no:

```yaml
ports:
```

because Traefik handles external HTTP/HTTPS traffic.

---

# 9. Docker Ignore

Recommended `.dockerignore`:

```text
node_modules
dist
.git
.gitignore
.env
.env.local
npm-debug.log
```

---

# 10. VPS Project Location

The frontend is deployed under:

```text
/docker/timesheet_frontend/timesheet-frontend
```

Go to the project:

```bash
cd /docker/timesheet_frontend/timesheet-frontend
```

---

# 11. Clone Repository on VPS

Create the directory:

```bash
mkdir -p /docker/timesheet_frontend
```

Go to it:

```bash
cd /docker/timesheet_frontend
```

Clone:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL timesheet-frontend
```

Enter project:

```bash
cd timesheet-frontend
```

Check files:

```bash
ls -lah
```

---

# 12. Production Environment File on VPS

If `.env.production` is not committed to GitHub:

```bash
nano .env.production
```

Add:

```env
VITE_API_URL=https://timesheet-api.dinnusmart.com/api
```

Save the file.

Verify without displaying secrets:

```bash
grep '^VITE_API_URL=' .env.production
```

Expected:

```text
VITE_API_URL=https://timesheet-api.dinnusmart.com/api
```

---

# 13. Build Frontend Docker Image

From the frontend directory:

```bash
docker compose build
```

For a completely fresh build:

```bash
docker compose build --no-cache
```

---

# 14. Start Frontend

```bash
docker compose up -d
```

Build and start together:

```bash
docker compose up -d --build
```

Force recreation:

```bash
docker compose up -d --build --force-recreate
```

---

# 15. Check Container

```bash
docker ps
```

Expected:

```text
timesheet-frontend
```

Check only Timesheet containers:

```bash
docker ps --filter "name=timesheet"
```

Expected:

```text
timesheet-frontend
timesheet-api
timesheet-mysql
```

---

# 16. Frontend Logs

View last 100 lines:

```bash
docker logs timesheet-frontend --tail 100
```

Follow logs:

```bash
docker logs -f timesheet-frontend
```

Stop following:

```text
Ctrl + C
```

---

# 17. Check Nginx Files

Check the container:

```bash
docker exec -it timesheet-frontend sh
```

Check website files:

```bash
ls -lah /usr/share/nginx/html
```

Expected:

```text
index.html
assets/
```

Check Nginx configuration:

```bash
cat /etc/nginx/conf.d/default.conf
```

Exit:

```bash
exit
```

---

# 18. Check Frontend Through Nginx

Inside the VPS:

```bash
docker exec timesheet-frontend wget -qO- http://localhost
```

You should receive the HTML content of the React application.

---

# 19. DNS Configuration

Create an A record:

```text
Type:   A
Name:   timesheet
Value:  YOUR_VPS_IP
TTL:    300
```

This should resolve:

```text
timesheet.dinnusmart.com
```

to your VPS.

Check DNS:

```bash
getent hosts timesheet.dinnusmart.com
```

---

# 20. Production Website

Open:

```text
https://timesheet.dinnusmart.com
```

Traefik handles:

```text
HTTPS :443
```

and forwards the request to:

```text
timesheet-frontend:80
```

---

# 21. Traefik Logs

Check Traefik:

```bash
docker ps --filter "name=traefik"
```

View logs:

```bash
docker logs traefik-oo2z-traefik-1 --tail 100
```

Follow:

```bash
docker logs -f traefik-oo2z-traefik-1
```

---

# 22. Test HTTPS

From VPS:

```bash
curl -I https://timesheet.dinnusmart.com
```

A successful response may look like:

```text
HTTP/2 200
```

or another valid HTTP response from the frontend.

---

# 23. Test Backend API

Backend:

```text
https://timesheet-api.dinnusmart.com/api
```

Test:

```bash
curl -I https://timesheet-api.dinnusmart.com/api
```

A `404` for `/api` itself does not necessarily mean the backend is broken if there is no route defined specifically for `/api`.

Test an actual API endpoint instead.

---

# 24. Browser Network Testing

Open:

```text
https://timesheet.dinnusmart.com
```

Press:

```text
F12
```

Open:

```text
Network
```

Perform login.

The request should be:

```text
https://timesheet-api.dinnusmart.com/api/auth/login
```

Example:

```text
POST /api/auth/login
```

The frontend should NOT request:

```text
http://localhost:3000/api/auth/login
```

---

# 25. CORS

The production frontend origin is:

```text
https://timesheet.dinnusmart.com
```

The backend origin is:

```text
https://timesheet-api.dinnusmart.com
```

The backend must allow requests from the frontend.

Recommended production CORS origin:

```text
https://timesheet.dinnusmart.com
```

If the backend currently uses:

```text
Access-Control-Allow-Origin: *
```

the frontend may work, but restricting CORS to the actual frontend domain is preferable for production.

---

# 26. Deploy New Frontend Changes

SSH into VPS.

```bash
cd /docker/timesheet_frontend/timesheet-frontend
```

Check Git:

```bash
git status
```

Pull latest changes:

```bash
git pull origin main
```

Rebuild:

```bash
docker compose build --no-cache
```

Deploy:

```bash
docker compose up -d
```

Or:

```bash
docker compose up -d --build
```

Check:

```bash
docker ps
```

Check logs:

```bash
docker logs timesheet-frontend --tail 100
```

---

# 27. Important: Frontend Environment Changes

If you change:

```env
VITE_API_URL=...
```

run:

```bash
docker compose build --no-cache
docker compose up -d
```

A simple:

```bash
docker compose restart
```

is NOT enough.

The Vite value is already embedded into the generated JavaScript during the build.

---

# 28. Restart Frontend

```bash
docker compose restart
```

Or:

```bash
docker restart timesheet-frontend
```

---

# 29. Stop Frontend

```bash
docker compose stop
```

Start again:

```bash
docker compose start
```

---

# 30. Remove Frontend Container

```bash
docker compose down
```

This removes the frontend container/network created by Compose.

It does not remove your source code.

---

# 31. Git Workflow

Check status:

```bash
git status
```

Check branch:

```bash
git branch
```

Pull changes:

```bash
git pull origin main
```

View recent commits:

```bash
git log --oneline -10
```

---

# 32. Production Deployment Workflow

Use this workflow whenever you deploy frontend changes:

```bash
cd /docker/timesheet_frontend/timesheet-frontend

git pull origin main

docker compose build --no-cache

docker compose up -d

docker ps

docker logs timesheet-frontend --tail 100
```

Then test:

```bash
curl -I https://timesheet.dinnusmart.com
```

Finally open:

```text
https://timesheet.dinnusmart.com
```

---

# 33. Troubleshooting

## Frontend shows 502 Bad Gateway

Check:

```bash
docker ps
```

Then:

```bash
docker logs timesheet-frontend --tail 100
```

Check Traefik:

```bash
docker logs traefik-oo2z-traefik-1 --tail 100
```

Check the container:

```bash
docker inspect timesheet-frontend
```

---

## Frontend shows 404 after refreshing a React route

Check `nginx.conf`.

Make sure this exists:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Then rebuild:

```bash
docker compose build --no-cache
docker compose up -d
```

---

## Frontend is calling localhost

Check:

```text
.env.production
```

It should contain:

```env
VITE_API_URL=https://timesheet-api.dinnusmart.com/api
```

Then rebuild:

```bash
docker compose build --no-cache
docker compose up -d
```

---

## API requests show CORS errors

Check the browser console.

Verify the backend allows:

```text
https://timesheet.dinnusmart.com
```

Then check backend logs:

```bash
docker logs timesheet-api --tail 100
```

---

## Login gives 401

Check the API request in Chrome:

```text
F12 → Network → auth/login
```

Verify:

```text
Request URL:
https://timesheet-api.dinnusmart.com/api/auth/login
```

Then check backend logs:

```bash
docker logs timesheet-api --tail 100
```

---

## New frontend code is not appearing

Rebuild without cache:

```bash
docker compose build --no-cache
docker compose up -d
```

Then perform a hard refresh:

```text
Ctrl + Shift + R
```

---

# 34. Docker Resource Checks

Disk usage:

```bash
docker system df
```

VPS disk:

```bash
df -h
```

Memory:

```bash
free -h
```

Container resource usage:

```bash
docker stats
```

Timesheet containers only:

```bash
docker stats timesheet-frontend timesheet-api timesheet-mysql
```

---

# 35. Do Not Use Database Commands Here

The frontend does not connect directly to MySQL.

The correct architecture is:

```text
React Frontend
      |
      | HTTPS API
      ↓
Timesheet API
      |
      | Docker internal network
      ↓
Timesheet MySQL
```

The frontend should never contain:

```text
DB_HOST
DB_USER
DB_PASSWORD
MYSQL_ROOT_PASSWORD
```

Only the backend connects to MySQL.

---

# 36. Production Architecture

```text
                         Internet
                            |
                            |
             https://timesheet.dinnusmart.com
                            |
                            ↓
                         Traefik
                            |
                            ↓
                 timesheet-frontend
                       Nginx :80
                            |
                            |
                    Browser JavaScript
                            |
                            | HTTPS
                            ↓
          https://timesheet-api.dinnusmart.com/api
                            |
                            ↓
                         Traefik
                            |
                            ↓
                    timesheet-api
                       Port 3000
                            |
                            | Docker network
                            ↓
                    timesheet-mysql
                       Port 3306
                            |
                            ↓
                     timesheet_db
```

---

# 37. VPS Directory Structure

Recommended:

```text
/docker/
│
├── timesheet_backend/
│   └── timesheet-backend/
│       ├── Dockerfile
│       ├── docker-compose.yml
│       ├── .env.production
│       └── ...
│
└── timesheet_frontend/
    └── timesheet-frontend/
        ├── Dockerfile
        ├── docker-compose.yml
        ├── nginx.conf
        ├── .env.production
        ├── .dockerignore
        ├── package.json
        ├── package-lock.json
        ├── src/
        └── ...
```

---

# 38. Quick Commands

### Go to project

```bash
cd /docker/timesheet_frontend/timesheet-frontend
```

### Check container

```bash
docker ps --filter "name=timesheet-frontend"
```

### Build

```bash
docker compose build --no-cache
```

### Deploy

```bash
docker compose up -d --build
```

### Restart

```bash
docker compose restart
```

### Logs

```bash
docker logs timesheet-frontend --tail 100
```

### Live logs

```bash
docker logs -f timesheet-frontend
```

### Check website

```bash
curl -I https://timesheet.dinnusmart.com
```

### Check DNS

```bash
getent hosts timesheet.dinnusmart.com
```

### Check backend

```bash
curl -I https://timesheet-api.dinnusmart.com/api
```

### Git update

```bash
git pull origin main
```

---

# 39. Emergency Checklist

If the frontend stops working:

```bash
cd /docker/timesheet_frontend/timesheet-frontend

docker ps

docker logs timesheet-frontend --tail 100

docker logs traefik-oo2z-traefik-1 --tail 100

curl -I https://timesheet.dinnusmart.com
```

Check backend separately:

```bash
docker logs timesheet-api --tail 100
```

Check MySQL separately:

```bash
docker logs timesheet-mysql --tail 100
```

Do not immediately remove containers or Docker volumes.

First identify whether the problem is:

```text
DNS
 ↓
Traefik
 ↓
Frontend/Nginx
 ↓
Browser/API URL
 ↓
CORS
 ↓
Backend
 ↓
MySQL
```

---

# 40. Final Production Checklist

Before considering deployment complete:

- [ ] React application builds successfully
- [ ] `.env.production` contains the production API URL
- [ ] Docker image builds successfully
- [ ] `timesheet-frontend` container is running
- [ ] Nginx serves `index.html`
- [ ] `timesheet.dinnusmart.com` DNS points to VPS
- [ ] Traefik routes the domain
- [ ] HTTPS certificate is working
- [ ] Frontend loads successfully
- [ ] Login request goes to `timesheet-api.dinnusmart.com`
- [ ] Backend API is running
- [ ] CORS allows the frontend origin
- [ ] Authentication works
- [ ] React Router refresh works
- [ ] Existing Timesheet MySQL database remains unchanged

---

# Production URLs Summary

```text
Frontend:
https://timesheet.dinnusmart.com

Backend:
https://timesheet-api.dinnusmart.com/api

Login API:
https://timesheet-api.dinnusmart.com/api/auth/login
```

The frontend communicates with the backend over HTTPS. The frontend never connects directly to MySQL.
