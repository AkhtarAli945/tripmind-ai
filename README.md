# TripMind AI — Multi-Agent AI Travel Planner SaaS

A production-ready full-stack application with 8 LangGraph AI agents that plan flights, hotels, itineraries, and budgets in seconds.

---

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, React Query, Socket.io-client, Recharts  
**Backend:** Node.js, Express, MongoDB, JWT, Socket.io, Passport  
**AI:** LangGraph, LangChain, OpenAI GPT-4o  
**DevOps:** Docker, Docker Compose, Nginx  

---

## Project Structure

```
tripmind-ai/
├── backend/
│   ├── src/
│   │   ├── agents/          # 8 LangGraph AI agents
│   │   │   ├── orchestrator.js
│   │   │   ├── supervisorAgent.js
│   │   │   ├── flightAgent.js
│   │   │   ├── hotelAgent.js
│   │   │   ├── itineraryAgent.js
│   │   │   ├── budgetAgent.js
│   │   │   ├── activityAgent.js
│   │   │   ├── localGuideAgent.js
│   │   │   └── finalPlannerAgent.js
│   │   ├── config/          # DB, Passport config
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth, error handling
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # Express routers
│   │   ├── sockets/         # Socket.io events
│   │   └── utils/           # Logger, JWT, errors
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # AuthContext
│   │   ├── hooks/           # useSocket
│   │   ├── pages/           # All app pages
│   │   └── services/        # API service
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker/
│   └── docker-compose.yml
└── README.md
```

---

## Quick Start

### 1. Clone and install

```bash
# Backend
cd backend
cp .env.example .env
# Fill in your API keys in .env
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### 2. Required API Keys (in backend/.env)

| Key | Source |
|-----|--------|
| `OPENAI_API_KEY` | https://platform.openai.com |
| `MONGODB_URI` | MongoDB Atlas or local |
| `JWT_SECRET` | Any random string (32+ chars) |
| `GOOGLE_CLIENT_ID` | Google Cloud Console (optional) |
| `TAVILY_API_KEY` | https://tavily.com (optional) |

### 3. Docker (full stack)

```bash
cd docker
docker-compose up --build
```

- Frontend: http://localhost:3000  
- Backend API: http://localhost:5000  
- MongoDB: localhost:27017  

---

## AI Agent Pipeline

```
User Query
    │
    ▼
Supervisor Agent  ──► Parses destination, dates, budget, travelers
    │
    ├──► Flight Agent     ──► Finds 3 best flight options
    └──► Hotel Agent      ──► Finds 3 best hotels
              │
              ▼
        Itinerary Agent   ──► Day-by-day schedule
              │
              ▼
        Budget Agent      ──► Allocates budget across categories
              │
              ▼
        Activity Agent    ──► Top 6 attractions & experiences
              │
              ▼
        Local Guide Agent ──► Weather, safety, transport tips
              │
              ▼
        Final Planner     ──► Merges everything into travel package
```

All agents stream status updates to the frontend via **Socket.io** in real-time.

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| GET | `/api/auth/google` | Google OAuth |

### Trips
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trips` | Get all trips |
| POST | `/api/trips` | Create trip |
| GET | `/api/trips/:id` | Get trip |
| PUT | `/api/trips/:id` | Update trip |
| DELETE | `/api/trips/:id` | Delete trip |
| GET | `/api/trips/:id/details` | Full trip details |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/message` | Send message & run agents |
| GET | `/api/chat/history/:sessionId` | Get chat history |

---

## Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join:session` | Client → Server | Join planning session |
| `agent:start` | Server → Client | Agents started |
| `agent:update` | Server → Client | Single agent status update |
| `agent:complete` | Server → Client | All agents done, trip ready |
| `agent:error` | Server → Client | Agent pipeline error |

---

## MongoDB Collections

- **users** — Auth, preferences, payment methods
- **trips** — Trip metadata, status, refs to all sub-documents
- **flights** — Flight options per trip
- **hotels** — Hotel options per trip
- **activities** — Activities per trip
- **itineraries** — Day-by-day schedule items
- **budgets** — Budget allocation and tracking
- **messages** — Chat history per session

---

## Deployment

### Backend (Render / Railway)
1. Set environment variables from `.env.example`
2. Build command: `npm install`
3. Start command: `npm start`

### Frontend (Vercel / Netlify)
1. Set `VITE_API_URL` if not using proxy
2. Build command: `npm run build`
3. Output directory: `dist`

---

## Features

- ✅ 8-agent LangGraph pipeline
- ✅ Real-time agent status via Socket.io
- ✅ JWT + Google OAuth authentication
- ✅ Full trip management (CRUD)
- ✅ Budget breakdown with donut chart (Recharts)
- ✅ Day-by-day itinerary timeline
- ✅ Flights & Hotels comparison
- ✅ Dark purple/black UI matching Figma design
- ✅ Fully responsive (mobile + desktop)
- ✅ Docker + Nginx production setup
- ✅ Rate limiting & security headers

---

## License

MIT — Built by TripMind AI Team
