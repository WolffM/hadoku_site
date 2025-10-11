# Child Repo Refactor Guide: API Handlers

**Last Updated:** October 11, 2025

This guide outlines how to refactor a child repository (e.g., `hadoku-task`) to export framework-agnostic API handlers. This allows the parent application (`hadoku_site`) to consume the business logic and adapt it for any environment (local Express, production Cloudflare Worker, etc.), promoting a clean separation of concerns.

## 1. Directory Structure

Create a new `api/` directory in the root of your child repository. This will house all server-side logic, completely separate from your frontend `src/` code.

```
hadoku-task/
├── src/                  # React frontend code
└── api/                  # NEW: Framework-agnostic API logic
    ├── handlers.ts       # Business logic (getTasks, createTask, etc.)
    ├── storage.ts        # Defines the Storage interface
    ├── types.ts          # Core types (Task, AuthContext)
    ├── index.ts          # Main export file for the package
    └── tsconfig.api.json # TypeScript config for the API
```

## 2. Core Types (`api/types.ts`)

Define the core data structures for your application. These types will be shared between the server and the frontend.

```typescript
// api/types.ts
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export type UserType = 'public' | 'friend' | 'admin';

export interface AuthContext {
  userType: UserType;
}
```

## 3. Storage Interface (`api/storage.ts`)

Define the contract for data persistence. The handlers will code against this interface, and the parent application will provide the concrete implementation (e.g., GitHub API, Cloudflare KV, local file system).

```typescript
// api/storage.ts
import { Task, UserType } from './types';

export interface Storage {
  getTasks(userType: UserType): Promise<Task[]>;
  saveTasks(userType: UserType, tasks: Task[]): Promise<void>;
}
```

## 4. Business Logic Handlers (`api/handlers.ts`)

Implement the core business logic as pure, framework-agnostic functions. These functions should not know about Express, Hono, or any specific server framework. They take `storage` and `authContext` as arguments.

```typescript
// api/handlers.ts
import { Storage } from './storage';
import { AuthContext, Task } from './types';

// --- Read Operations ---
export async function getTasks(storage: Storage, auth: AuthContext): Promise<Task[]> {
  if (auth.userType === 'public') {
    throw new Error('Forbidden: Public users cannot access server storage.');
  }
  return await storage.getTasks(auth.userType);
}

// --- Write Operations ---
export async function createTask(storage: Storage, auth: AuthContext, data: { text: string }): Promise<Task> {
  if (auth.userType === 'public') throw new Error('Forbidden');
  const tasks = await storage.getTasks(auth.userType);
  const newTask: Task = { /* ... */ };
  tasks.push(newTask);
  await storage.saveTasks(auth.userType, tasks);
  return newTask;
}

// ... other handlers (updateTask, deleteTask, etc.)
```

## 5. Main Export File (`api/index.ts`)

Create a single entry point to export all parts of your API package.

```typescript
// api/index.ts
export * as TaskHandlers from './handlers';
export type * from './types';
export type { Storage as TaskStorage } from './storage';
```

## 6. TypeScript Configuration (`api/tsconfig.api.json`)

Create a dedicated `tsconfig.json` for the API to generate clean, bundled type definitions (`.d.ts`) without unnecessary JavaScript files.

```json
// api/tsconfig.api.json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": ".",
    "declaration": true,
    "emitDeclarationOnly": true, // Only generate .d.ts files
    "moduleResolution": "node"
  },
  "include": ["./**/*.ts"],
  "exclude": ["./dist"]
}
```

## 7. `package.json` Configuration

Update the child repo's `package.json` to add a build script and define the package exports.

```json
// package.json
{
  "name": "@hadoku/task",
  "version": "1.0.0",
  "type": "module",
  "files": [
    "dist", // Frontend bundle
    "api"   // API source and type definitions
  ],
  "scripts": {
    "build": "vite build",
    "build:api": "tsc -p api/tsconfig.api.json",
    "build:all": "npm run build && npm run build:api"
  },
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./api": {
      "import": "./api/index.ts", // Export raw TypeScript source
      "types": "./api/dist/index.d.ts" // Export clean, bundled types
    }
  }
}
```

## 8. `.npmignore`

Create a `.npmignore` file in the root of the child repo to ensure the published package is lean.

```
# .npmignore
.vscode/
node_modules/
src/
public/
vite.config.ts
tsconfig.json
*.log

# Exclude API build artifacts we don't need
api/dist/**/*.js
api/dist/**/*.js.map
api/tsconfig.api.json
```

## Workflow Summary

1.  **Develop:** Make changes to your frontend (`src/`) and API (`api/`).
2.  **Build:** Run `npm run build:all`.
3.  **Link (Local Dev):**
    -   In child repo: `npm link`
    -   In parent repo: `npm link @hadoku/task`
4.  **Publish (Production):** `npm publish`
5.  **Consume:** The parent application can now import `{ TaskHandlers, TaskStorage } from '@hadoku/task/api'` and create adapters for its server environments.
