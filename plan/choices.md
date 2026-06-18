# Technical Choices

This document outlines the technical decisions made for the BuildAForm project.

## Frontend & UI

- **Framework**: Next.js (App Router) - Latest stable version.
- **Styling**: Tailwind CSS v4.
- **Components**: Shadcn UI (Radix UI primitives, Luma visual preset). Preset code: `b6V64uxTj0`.
    - **Icons**: Hugeicons (`@hugeicons/react`).
    - **Fonts**: Manrope (body), Space Grotesk (headings) via `next/font/google`.
- **Validation**: Zod (standard for TypeScript schema validation).

## Backend & Data

- **Language**: TypeScript (End-to-end).
- **ORM**: Prisma 6 (pinned). We deliberately stay on the v6 line for a simpler setup and richer support.
- **Database**: Supabase Cloud (managed PostgreSQL). We chose the hosted offering over a self-hosted instance for a
  simpler setup — no infrastructure to run locally. Prisma connects via two URLs: the Supavisor **pooled** connection (
  transaction mode, port 6543) as `DATABASE_URL` for the app runtime, and the **direct** connection (port 5432) as
  `DIRECT_URL` for migrations.
- **Authentication**: Deferred. Initial implementation will use an "open admin" approach to prioritize core features.
  Supabase Auth will be integrated later.

## AI Integration

- **Engine**: Ollama (Local model setup).
- **API Compatibility**: Target OpenAI-compatible APIs to ensure future flexibility.
- **Feature**: Form generation based on text prompts (aiming for structured JSON output that matches the database
  schema).

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

## Question Types

| Type              | UI                                        | Status                                                                 |
|-------------------|-------------------------------------------|------------------------------------------------------------------------|
| `STATEMENT`       | Display-only text block, no answer needed | Implemented                                                            |
| `SHORT_TEXT`      | Single-line text input                    | Implemented                                                            |
| `LONG_TEXT`       | Multi-line textarea                       | Implemented                                                            |
| `SINGLE_CHOICE`   | Radio buttons — pick one from options     | Implemented                                                            |
| `MULTIPLE_CHOICE` | Checkboxes — pick many from options       | Implemented                                                            |
| `NUMBER`          | Numeric input                             | Implemented                                                            |
| `DATE`            | Date picker                               | Deferred — achievable via `SHORT_TEXT` for now                         |
| `EMAIL`           | Email input with format validation        | Deferred — achievable via `SHORT_TEXT` for now                         |
| `DROPDOWN`        | Select menu (for long option lists)       | Deferred — achievable via `SINGLE_CHOICE` or `MULTIPLE_CHOICE` for now |
| `YES_NO`          | Binary choice                             | Deferred — achievable via `SINGLE_CHOICE` for now                      |
| `SCALE`           | Linear numeric scale (e.g. 1–10)          | Deferred — achievable via `SINGLE_CHOICE` for now                      |

## Question Options

Choice-based questions (`SINGLE_CHOICE`, `MULTIPLE_CHOICE`) use a dedicated `Option` model rather than `String[]` on
`Question`. Each option has its own `id`, `label`, and `order`, with cascade delete from `Question`. This allows
answers to reference options by `id` rather than by label string — keeping historical responses stable if
a label is later edited.
