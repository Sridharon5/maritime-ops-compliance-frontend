# Maritime Ops Compliance — Frontend

React + TypeScript SPA for the Maritime Operations & Compliance assessment app: admin dashboards, maintenance and drill management, and crew “My Work” flows.

## Tech stack

- **React** + **TypeScript**
- **Vite** (dev server and build)
- **Tailwind CSS** v4 (via `@tailwindcss/vite`)
- **Recharts** (compliance chart)
- **Bootstrap Icons** (navbar/tab icons)

## Prerequisites

- Node.js 18+
- npm
- Backend API running (see `../backend/README.md`)

## Environment

The API base URL defaults to `http://localhost:4000/api` if unset.

| Variable       | Description                          |
|----------------|--------------------------------------|
| `VITE_API_URL` | Full base URL to the API (no trailing slash issues — paths are appended in code). Example: `http://localhost:4000/api` |

For production builds, see `.env.production` for an example override.

## Scripts

From this directory:

```bash
npm install
npm run dev      # http://localhost:5173 (typical Vite port)
npm run build    # typecheck + production bundle
npm run preview  # serve the built app locally
```

From the **repository root**, you can use the root `package.json` scripts (e.g. `npm run dev:frontend`) if configured there.

## Project layout (high level)

| Path                         | Role |
|------------------------------|------|
| `src/App.tsx`                | Shell: role/tab routing |
| `src/api.ts`                 | Fetch wrappers; sends `x-user-role: admin` on create calls |
| `src/hooks/useMaritimeData.ts` | State, filters, pagination, mutations |
| `src/components/`           | Dashboard, panels, tables, dialogs |
| `src/types.ts`               | Shared domain types |
| `src/constants.ts`           | Tabs, forms defaults, UI style tokens |

## Related docs

- Root overview and full-stack setup: [`../README.md`](../README.md)
- Business flow and API details: [`../docs/`](../docs/)
