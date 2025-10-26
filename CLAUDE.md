# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UGC Studio is an AI-powered system for automatically generating high-quality UGC (User Generated Content) videos with animated AI faces. The system creates vertical videos (1080x1920) for TikTok, Reels, and Shorts by combining:
- AI voice synthesis (XTTS v2)
- Talking head animation (SadTalker)
- Automatic subtitles (Whisper)
- Professional video editing (FFmpeg)

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui patterns
- **Backend**: Firebase (Auth, Firestore, Storage)
- **AI Worker**: FastAPI service with GPU support (Docker)
- **Package Manager**: Yarn 4.3.1 (required)
- **Node Version**: 18-20 (specified in package.json)

## Development Commands

```bash
# Development
yarn dev              # Start dev server with Turbopack

# Build & Deploy
yarn build            # Build for production
yarn start            # Start production server

# Linting & Testing
yarn lint             # Run ESLint
yarn test             # Run Jest tests
yarn test:watch       # Run tests in watch mode
yarn test:coverage    # Generate coverage report
yarn test:ci          # Run tests in CI mode
```

## Architecture

### Firebase Dual-Client Pattern

The codebase uses **two separate Firebase clients** - this is critical to understand:

1. **Client-Side** (`lib/firebaseClient.ts`):
   - Uses Firebase Client SDK (`firebase/app`, `firebase/firestore`, `firebase/auth`)
   - For frontend components and hooks
   - Imports: `import { db, auth, storage } from '@/lib/firebaseClient'`

2. **Server-Side** (`lib/firebase.ts`):
   - Uses Firebase Admin SDK (`firebase-admin`)
   - For API routes and server components
   - Imports: `import { adminDb, adminAuth, adminStorage } from '@/lib/firebase'`
   - Requires service account credentials (FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL)

**Never mix these two imports.** Client SDK cannot be used in API routes, Admin SDK cannot be used in client components.

### Service Layer Architecture

The app uses a **dual service layer** matching the Firebase pattern:

1. **Client Services** (`lib/ugc-services-client.ts`):
   - Classes: `UGCProjectService`, `UGCAssetService`, `UGCJobService`, `UGCVideoService`, `HookGenerationService`
   - Used in React hooks and client components
   - Exports singleton instances: `ugcProjectService`, `ugcAssetService`, etc.

2. **Server Services** (`lib/ugc-services-server.ts`):
   - Classes: `UGCProjectServiceServer`, `UGCAssetServiceServer`, etc.
   - Used exclusively in API routes
   - Exports singleton instances: `ugcProjectServiceServer`, `ugcAssetServiceServer`, etc.

### Data Model

Core entities in Firestore (see `lib/ugc-types.ts`):

- **UGCProject**: Container for a video project (name, language, niche, style)
- **UGCAsset**: Uploaded files (avatar image, demo video, music audio)
- **UGCJob**: Video generation job (tracks status: queued → processing → done/error)
- **UGCVideo**: Final generated video reference

### Custom Hooks Pattern

All data fetching uses custom hooks in `src/hooks/`:
- `use-ugc-projects.ts` - Project CRUD operations
- `use-ugc-assets.ts` - Asset upload/management
- `use-ugc-jobs.ts` - Job submission and real-time progress tracking
- `use-hook-generation.ts` - AI hook text generation

These hooks use the **client services** and provide React Query-like patterns with loading/error states.

### API Routes Structure

All UGC endpoints are under `/api/ugc/`:
- `POST /api/ugc/projects` - Create project
- `GET /api/ugc/projects?uid={uid}` - List user projects
- `POST /api/ugc/assets` - Upload asset (FormData)
- `POST /api/ugc/generate` - Start video generation job
- `POST /api/ugc/hooks` - Generate hook suggestions
- `GET /api/ugc/jobs?projectId={id}` - List project jobs

All API routes:
1. Use **server services** (`ugc-services-server.ts`)
2. Authenticate via Firebase Admin (`adminAuth.verifyIdToken()`)
3. Return JSON responses

### AI Worker Communication

The Next.js app communicates with a separate Python FastAPI worker (`worker/` directory):
- Worker handles CPU/GPU intensive AI processing
- Runs as Docker container with CUDA support
- Main services: TTS, Talking Head, Subtitle, Video Editor
- Communication via HTTP API (configured via UGC_WORKER_URL env var)

Video generation flow:
1. Frontend → Next.js API route creates job in Firestore
2. Next.js API → Worker API sends generation request
3. Worker processes video, updates Firestore progress
4. Worker uploads final video to Firebase Storage
5. Frontend hooks listen to Firestore for real-time updates

## Path Aliases

TypeScript paths configured in `tsconfig.json`:
```typescript
"@/*"           → "./src/*"
"@/components/*" → "./components/*"
"@/lib/*"       → "./lib/*"
```

Note: Components live in `/components`, not `/src/components`.

## Testing

- **Framework**: Jest + React Testing Library
- **Config**: `jest.config.js` with Next.js integration
- **Setup**: `jest.setup.js` (create if adding test utilities)
- **Coverage**: 70% threshold for branches/functions/lines/statements
- **Path aliases**: Mapped in moduleNameMapping to match tsconfig

Run single test file:
```bash
yarn test path/to/test.test.ts
```

## Environment Variables

Required for development (`.env.local`):

```bash
# Firebase Client (NEXT_PUBLIC_* for browser access)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (server-side only)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=         # Service account private key
FIREBASE_CLIENT_EMAIL=        # Service account email

# AI Worker (if using external worker)
UGC_WORKER_URL=               # Worker API endpoint
UGC_WORKER_TOKEN=             # Authentication token
```

## Key Architectural Decisions

1. **Workspace Pattern**: The repo has a `functions/` workspace for Firebase Functions, managed via yarn workspaces

2. **Real-time Updates**: UGC jobs use Firestore's `onSnapshot` for real-time progress updates in the UI

3. **File Uploads**: Assets go directly to Firebase Storage from client using resumable uploads, metadata stored in Firestore

4. **Authentication**: Single-user whitelisted email (per README), enforced via Firebase Auth

5. **Video Output**: All generated videos are 1080x1920 (vertical), H.264, 30fps, stored in Firebase Storage

## Worker Development

If working on the AI worker (`worker/`):

```bash
cd worker

# Local development (requires GPU)
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt

# Run worker locally
python main.py

# Test worker
python test_worker.py --test all

# Docker build
docker build -t ugc-worker .
docker run --gpus all -p 8000:8000 --env-file .env ugc-worker
```

Worker services are in `worker/services/`:
- `tts_service.py` - XTTS v2 voice synthesis
- `talking_head_service.py` - SadTalker face animation
- `subtitle_service.py` - Whisper transcription
- `video_editor_service.py` - FFmpeg composition

## Git Workflow

- **Main branch**: `main`
- **Current feature branch**: `feature/ugc-video-automation`
- This is a solo project (per README's single-user auth)

## Common Patterns

### Creating a new API route with Firebase:
```typescript
import { adminAuth, adminDb } from '@/lib/firebase';
import { ugcProjectServiceServer } from '@/lib/ugc-services-server';

export async function POST(req: Request) {
  // 1. Verify auth token
  const token = req.headers.get('Authorization')?.split('Bearer ')[1];
  const decodedToken = await adminAuth.verifyIdToken(token);

  // 2. Use server service
  const projects = await ugcProjectServiceServer.getByUserId(decodedToken.uid);

  // 3. Return JSON
  return Response.json({ projects });
}
```

### Creating a new custom hook:
```typescript
'use client';
import { ugcProjectService } from '@/lib/ugc-services-client';
import { useState, useEffect } from 'react';

export function useUgcProjects(uid: string) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return ugcProjectService.subscribeToUserProjects(uid, (data) => {
      setProjects(data);
      setLoading(false);
    });
  }, [uid]);

  return { projects, loading };
}
```

## Important Notes

- Language: The app is primarily in French (UI text, generated hooks, etc.)
- The `HookGenerationService` currently uses mock data - in production this would call an LLM API
- Video generation takes 2-5 minutes per video with GPU acceleration
- Storage costs: ~5GB per generated video (interim files + final output)
