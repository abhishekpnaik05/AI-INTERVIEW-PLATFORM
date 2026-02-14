## AI Interview Platform Backend

Node.js + Express backend for an AI Interview Preparation Platform, using MongoDB via Mongoose.

### Getting started

- **Install dependencies**:

```bash
npm install
```

- **Configure environment**:

1. Copy `.env.example` to `.env`.
2. Update `MONGODB_URI`, `CORS_ORIGIN`, and other values as needed.

- **Run in development**:

```bash
npm run dev
```

- **Run in production**:

```bash
npm start
```

### Structure

- `index.js`: Express app entry point (CORS, security, routes, error handling).
- `config/db.js`: Mongoose MongoDB connection.
- `controllers/`: Request handlers (auth, interview sessions).
- `routes/`: Route definitions, including `/health` for health checks.
- `models/`: Mongoose models (`User`, `InterviewSession`).
- `middleware/`: Error handler, 404 handler, async wrapper.
- `utils/`: Logger and `ApiError` helper.

