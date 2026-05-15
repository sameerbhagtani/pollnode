# PollNode

PollNode is a real-time polling platform built with the MERN stack, Clerk authentication, Socket.IO, React Router, and Tailwind CSS v4. It supports public and authenticated polls, live analytics, anonymous response tracking, and publishable results in a clean dark-first interface.

The app is split into a Vite React client and an Express + MongoDB API server. Polls can be created from the dashboard, shared through a public link, answered in real time, and analyzed after responses are collected or published.

This project is part of my [ChaiCode Web Dev Cohort 2026 Archive](https://github.com/sameerbhagtani/web-dev-cohort-2026). Checkout my entire journey there!

## Live URL

https://pollnode.sameerbhagtani.dev

## Features

- Create polls with a title, description, expiry date, and multiple questions.
- Mark each question as required or optional.
- Choose whether responses are anonymous or require authentication.
- View polls through a public route with live response handling.
- Prevent duplicate submissions with authenticated user records or anonymous cookies.
- Track live analytics with Socket.IO updates.
- Publish results when you are ready to expose analytics to participants.
- Distinguish between active, expired, published, and unpublished poll states in the UI.
- Use Clerk hosted sign-in and sign-up flows with modal buttons.
- Keep the app responsive and dark by default.

## Tech Stack

Frontend:

- React 19
- TypeScript
- Vite
- React Router
- Clerk React
- Axios
- React Hook Form
- Zod
- Socket.IO client
- Recharts
- Tailwind CSS v4

Backend:

- Node.js
- Express 5
- TypeScript
- MongoDB with Mongoose
- Clerk Express middleware
- Socket.IO
- Cookie parser
- CORS

## Local Setup

### Prerequisites

- Node.js 20 or newer
- MongoDB running locally or a MongoDB Atlas connection string
- Clerk application keys
- Docker if you want to use the provided MongoDB compose file

### Environment Variables

Create a `.env` file in `server/` (`.env.example` is given for reference):

```bash
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://user:password@localhost:27017/pollnode_db?authSource=admin
CLIENT_URL=http://localhost:5173
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

Create a `.env` file in `client/` (`.env.example` is given for reference):

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_SERVER_URL=http://localhost:3000
```

### Install Dependencies

Install the server and client packages separately:

```bash
cd server
npm install

cd ../client
npm install
```

### Start MongoDB with Docker

If you want a local database container, run:

```bash
cd server
npm run db:up
```

You can stop it with `npm run db:down` or reset the volume with `npm run db:reset`.

### Run the App Locally

Start the API server:

```bash
cd server
npm run dev
```

Start the client in a second terminal:

```bash
cd client
npm run dev
```

The default local URLs are:

- Client: http://localhost:5173
- Server: http://localhost:3000

## Application Flow

### Authentication Sync

The client wraps the app in `ClerkProvider`, reads the Clerk session, and syncs authenticated users with the backend through `GET /api/auth/me`. The server stores a matching user record keyed by `clerkUserId`.

### Create a Poll

An authenticated user opens the dashboard, creates a new poll, defines the questions, selects anonymous or authenticated access, and sets an expiry date. The poll is saved with its questions and shown in the dashboard immediately.

### Visit a Public Poll

The public poll page loads the poll by ID and checks its state:

- If the poll is published, the public route shows the analytics dashboard.
- If the poll requires authentication and the visitor is signed out, the page shows a sign-in prompt.
- If the backend returns the authenticated-poll 403 case, the page shows a dedicated login message and Clerk modal sign-in button.
- If the poll has expired, the page shows an expired state and does not allow new responses.
- If the poll is active, the visitor can submit responses.

### Submit Responses

The response form filters out unanswered optional questions, submits only valid answers, and relies on backend validation for required question rules. Anonymous polls use a signed cookie token for duplicate prevention. Authenticated polls bind the response to the Clerk user record.

### Live Analytics

Analytics listens for Socket.IO updates and refreshes the dashboard automatically when responses are recorded or when a poll is published.

## API Routes

Base server routes:

- `GET /api/ping` - health check
- `GET /api/auth/me` - sync the current Clerk user into MongoDB and return the local user record

Poll routes:

- `GET /api/polls` - list the current user's polls, protected by auth
- `POST /api/polls` - create a poll, protected by auth
- `GET /api/polls/:pollId` - fetch a poll and its questions by ID
- `PATCH /api/polls/:pollId/publish` - publish a poll, protected by auth

Response routes:

- `POST /api/polls/:pollId/responses` - submit answers for a poll

Analytics routes:

- `GET /api/polls/:pollId/analytics` - fetch poll analytics

Key API behavior:

- Poll access checks allow owners to view unpublished polls.
- Anonymous polls can be answered without login.
- Authenticated polls require a signed-in Clerk user.
- Expired polls cannot accept new responses.
- Published polls expose analytics through the public route.

## Socket Events

Client to server:

- `poll:join` - join a poll room for real-time updates

Server to client:

- `poll:publish` - emitted when a poll is published
- `poll:analytics:update` - emitted when analytics should refresh after a response is recorded

Socket rooms use the pattern `poll:<pollId>` so listeners only receive events for the poll they are viewing.

## Frontend Pages

Routes and their purpose:

- `/` - Home page with product overview and sign-in or sign-up entry points
- `/dashboard` - authenticated dashboard listing the user's polls
- `/polls/new` - authenticated create poll form
- `/polls/:pollId` - public poll page, response form, expired state, or public analytics view
- `/polls/:pollId/analytics` - authenticated analytics page for the poll owner
- `/not-found` - fallback 404 page

Shared UI building blocks include the header, buttons, cards, input controls, poll cards, and the Socket.IO hook.

## Database Schemas

### User

Collection: `users`

- `clerkUserId` - unique Clerk user ID
- `isAdmin` - optional admin flag
- timestamps for creation and updates

### Poll

Collection: `polls`

- `creator` - reference to the owning user
- `title` - poll title
- `description` - optional description
- `responseAccess` - `anonymous` or `authenticated`
- `expiresAt` - expiry date
- `publishedAt` - null until published
- timestamps for creation and updates

Indexes:

- `creator + createdAt` for dashboard lookups
- `expiresAt` for expiry-based filtering

### Question

Collection: `questions`

- `poll` - reference to the parent poll
- `text` - question text
- `options` - at least two answer options
- `isRequired` - whether the question must be answered
- `order` - display order within the poll
- timestamps for creation and updates

Index:

- `poll + order` unique for stable question ordering

### Response

Collection: `responses`

- `poll` - reference to the poll
- `respondent` - reference to the authenticated user, or null
- `anonymousTokenHash` - hashed anonymous cookie token, or null
- `answers` - array of question and selected option pairs
- timestamps for creation and updates

Indexes:

- `poll + createdAt` for analytics queries
- `poll + respondent` unique for authenticated duplicate protection
- `poll + anonymousTokenHash` unique for anonymous duplicate protection
