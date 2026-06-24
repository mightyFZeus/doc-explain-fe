# Doc Explain Frontend

Next.js frontend for Doc Explain.

## Local Development

```bash
npm install
npm run dev
```

The API base URL is set in `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Backend Routes Used

- `GET /health`
- `POST /auth/register`
- `POST /document/upload`
- `POST /document/search`

The login, password reset, and email verification screens are scaffolded so the routes are ready as the backend expands.
