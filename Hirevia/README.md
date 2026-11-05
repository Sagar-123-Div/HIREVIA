# Hirevia frontend

## Run locally

1. Start MongoDB, then start the API from `backend` with `npm run dev`. The backend
   reads `MONGODB_URI`, `JWT_SECRET`, `PORT` and `CLIENT_URL` from its `.env` file.
2. Start the frontend from `Hirevia` with `npm run dev`.

The frontend uses `http://localhost:5000` for the API during development. To use
a different backend, create `Hirevia/.env` from `.env.example` and set
`VITE_API_BASE_URL` to the backend origin (without `/api`). Production builds
continue to use the configured hosted API unless this variable is supplied.

The API will not accept requests until its MongoDB connection is established.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
