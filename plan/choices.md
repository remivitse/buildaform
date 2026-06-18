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

## Form Editor Persistence

The Form Editor uses an **explicit-save / draft-in-memory** model rather than auto-saving each change. The editor
(`FormEditor`) holds the question list in client state; add/remove/edit operations only mutate that draft, and a single
**Save** action persists the whole set. We chose this over per-change server actions to avoid partial/garbage writes
(e.g. empty questions) and to keep client/DB reconciliation in one place — which also makes drag reordering cheap to add
later.

`saveFormQuestions` persists the draft in a single Prisma **transaction** that diffs against the database: questions
absent from the draft are deleted (their `Option`s cascade), existing ones are updated, and new ones are created. New
questions carry a client-generated temporary `id` (`crypto.randomUUID()`); the server treats any `id` not already in the
database as new, then returns the persisted rows so the client can reconcile temporary ids to real ones. Question
`order` is derived from array position on every save.

## Question Type Selection

Each question's `type` is chosen in the editor from the supported `QuestionType`s (see the Question Types table above).
The supported set and their human labels live in a single module (`src/lib/question-types.ts`) that imports
`QuestionType` **type-only**, so it — and every client component that uses it — stays free of a runtime
`@prisma/client` dependency in the browser bundle; the type values are string literals validated against the enum via
`satisfies`.

Only choice types (`SINGLE_CHOICE`, `MULTIPLE_CHOICE`) carry options. Validation requires at least two options for a
choice question; switching a question away from a choice type drops its options on the next save. `saveFormQuestions`
extends the draft-diff to options: within the same transaction, each kept question's options are diffed (update
existing, create new, delete removed) using the same temporary-id reconciliation as questions, with option `order`
derived from array position.
