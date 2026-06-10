# Master Plan & Issue Tracker

This document tracks the tasks for the BuildAForm project using a simulated GitHub-issues workflow.

## Milestone 1: Infrastructure & Project Setup
- [ ] **Issue #1**: Initialize Git with Gitflow (main/develop).
- [ ] **Issue #2**: Initialize Next.js project with Tailwind and TypeScript.
- [ ] **Issue #3**: Configure Prisma and PostgreSQL (Supabase).
- [ ] **Issue #4**: Setup Shadcn UI and base layout.

## Milestone 2: Part 1 - Form Builder (Admin Interface)
- [ ] **Issue #5**: Define Prisma Schema for Forms and Questions.
- [ ] **Issue #6**: Create Form Listing page (Dashboard).
- [ ] **Issue #7**: Implement "Create New Form" logic.
- [ ] **Issue #8**: Build Form Editor interface (Add/Remove questions).
- [ ] **Issue #9**: Support multiple question types (Short Text, Long Text, Multiple Choice, Rating).
- [ ] **Issue #10**: Implement question reordering.
- [ ] **Issue #11**: Implement Form Settings (Title, Description, etc.).

## Milestone 3: Part 2 - Form Responder (Public Interface)
- [ ] **Issue #12**: Create Public Form Route (e.g., `/f/[id]`).
- [ ] **Issue #13**: Build "One Question at a Time" Typeform-style flow.
- [ ] **Issue #14**: Add Progress Bar and Navigation.
- [ ] **Issue #15**: Implement Response Submission and Validation (Zod).

## Milestone 4: Part 3 - Response Viewer
- [ ] **Issue #16**: Create Response Analytics page for each form.
- [ ] **Issue #17**: Implement Summary View (charts/aggregates).
- [ ] **Issue #18**: Implement Individual Responses View.

## Milestone 5: Part 4 - AI Form Generation
- [ ] **Issue #19**: Setup Ollama/OpenAI-compatible client.
- [ ] **Issue #20**: Create AI Prompt interface.
- [ ] **Issue #21**: Implement AI generation logic (Prompt -> JSON Structure -> Prisma Save).
- [ ] **Issue #22**: Add preview/edit flow for AI-generated forms.

## Milestone 6: Final Polish & Documentation
- [ ] **Issue #23**: Comprehensive README with architectural choices.
- [ ] **Issue #24**: Final UX/UI pass and bug fixing.
