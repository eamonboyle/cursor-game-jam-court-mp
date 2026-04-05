/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ROOM_WS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
