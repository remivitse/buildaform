# Technical Choices

This document outlines the technical decisions made for the BuildAForm project.

## Frontend & UI
- **Framework**: Next.js (App Router) - Latest stable version.
- **Styling**: Tailwind CSS.
- **Components**: Shadcn UI (chosen for its extensibility and clean default look).
- **Validation**: Zod (standard for TypeScript schema validation).

## Backend & Data
- **Language**: TypeScript (End-to-end).
- **ORM**: Prisma 6 (pinned). We deliberately stay on the v6 line for a simpler setup and richer support.
- **Database**: Supabase Cloud (managed PostgreSQL). We chose the hosted offering over a self-hosted instance for a simpler setup — no infrastructure to run locally. Prisma connects via two URLs: the Supavisor **pooled** connection (transaction mode, port 6543) as `DATABASE_URL` for the app runtime, and the **direct** connection (port 5432) as `DIRECT_URL` for migrations.
- **Authentication**: Deferred. Initial implementation will use an "open admin" approach to prioritize core features. Supabase Auth will be integrated later.

## AI Integration
- **Engine**: Ollama (Local model setup).
- **API Compatibility**: Target OpenAI-compatible APIs to ensure future flexibility.
- **Feature**: Form generation based on text prompts (aiming for structured JSON output that matches the database schema).

## Development Workflow
- **Feature planning**: GitHub Issues and Milestones.
- **Branching Model**: Gitflow.
- **Default Branch**: `develop` until v1.0.0 is released, `main` from then on.
- **Branch Naming**:
  - Feature branches should be named `feature/<feature-name>` (e.g., `feature/gitflow-setup`). 
  - Release branches shloud be named `release/<milestone-name>` (e.g., `release/infrastructure-project-setup`).
- **Merging & Release Policy**:
  - We create `release/*` branches from `develop` when ready for a release.
  - Fixes can be applied directly to `release/*` branches and then backported to `develop`.
  - Once stable, `main` is **rebased** onto the `release/*` branch. `develop` is then rebased onto the `main` branch.
- **Versioning**: We use Semantic Release to automate versioning and GitHub Releases.
    - `main` triggers stable releases.
    - `develop` triggers `beta` pre-releases.
    - `release/*` triggers `rc` (release candidate) pre-releases.
  This also means we use Semantic Versioning (SemVer).

## GitHub Issues
Issues should follow one of the available templates:
- `feature_request.md` for new features.