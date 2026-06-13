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
- **Default Branch**: `develop` (until v1.0.0 is released, for a faster early workflow).
- **Prioritization**: Strictly following the order and requirements defined in the `requirements/` folder.
