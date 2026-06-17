# Technical Choices

This document outlines the technical decisions made for the BuildAForm project.

## Frontend & UI
- **Framework**: Next.js (App Router) - Latest stable version.
- **Styling**: Tailwind CSS.
- **Components**: Shadcn UI (chosen for its extensibility and clean default look).
- **Validation**: Zod (standard for TypeScript schema validation).

## Backend & Data
- **Language**: TypeScript (End-to-end).
- **ORM**: Prisma.
- **Database**: Supabase / PostgreSQL (Self-hosted setup).
- **Authentication**: Deferred. Initial implementation will use an "open admin" approach to prioritize core features. Supabase Auth will be integrated later.

## AI Integration
- **Engine**: Ollama (Local model setup).
- **API Compatibility**: Target OpenAI-compatible APIs to ensure future flexibility.
- **Feature**: Form generation based on text prompts.

## Workflow
- **Task Management**: GitHub-issues-based workflow.
- **Branching Model**: Gitflow.
<<<<<<< Updated upstream
- **Default Branch**: `develop` (until v1.0.0 is released, for a faster early workflow).
- **Prioritization**: Strictly following the order and requirements defined in the `requirements/` folder.
=======
- **Releases**: We use Semantic Release to automate versioning and GitHub Releases.
  - `main` triggers stable releases.
  - `develop` triggers `beta` pre-releases.
  - `release/*` triggers `rc` (release candidate) pre-releases.
- **Default Branch**: `develop` until v1.0.0 is released, `main` from then on.
- **Branch Naming**:
  - Feature branches should be named `feature/<feature-name>` (e.g., `feature/gitflow-setup`). 
  - Release branches shloud be named `release/<milestone-name>` (e.g., `release/infrastructure-project-setup`).
- **Merging & Release Policy**:
  - We create `release/*` branches from `develop` when ready for a release.
  - Fixes can be applied directly to `release/*` branches and then backported to `develop`.
  - Once stable, `main` is **rebased** onto the `release/*` branch. `develop` is then rebased onto the `main` branch.

## GitHub Issues
Issues should follow one of the available templates:
- `feature_request.md` for new features.
>>>>>>> Stashed changes
