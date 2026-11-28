/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend origin, e.g. http://localhost:3000 (no trailing /api). */
  readonly VITE_API_URL?: string;
  /** Sent as `x-api-key` to the backend's public routes (register, login, verify…). */
  readonly VITE_PUBLIC_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
