# PROJECT: BuildAForm

This document serves as the primary context for any AI agent working on the BuildAForm project. It describes the project's goals, approach, and constraints.

## Project Goal
Build a modern, full-stack "Mini-Typeform" clone that allows users to create questionnaires (Form Builder), fill them out (Form Responder), and view results (Response Viewer), with an added layer of AI-powered form generation.

## Core Approach
We follow a **structured, documentation-first** approach to development:

1.  **Exhaustive Planning**: No code is written without a clear plan.
2.  **Sequential Implementation**: Tasks are tackled in the order defined by the project specifications (Requirement PDFs):
    - Part 1: Form Builder (Admin interface)
    - Part 2: Form Responder (Public interface)
    - Part 3: Response Viewer (Analytics dashboard)
    - Part 4: AI Prompt Generation
3.  **Minimalist Start**: Focus on mandatory features first. Optional features like Authentication are deferred until the core logic is solid.
4.  **Standardized Workflow**:
    - Use **Gitflow** for managing branches (main, develop, feature branches).
    - Use a **GitHub-issues-based workflow** to track tasks and progress.

## Technical Philosophy
- **Modern Stack**: Leveraging Next.js App Router and Server Actions.
- **Strict Typing**: TypeScript is used across the entire stack for reliability and maintainability.
- **UI Excellence**: Using Shadcn UI for a professional, accessible, and easily customizable interface.
- **Local AI**: Utilizing Ollama for local development of AI features, maintaining compatibility with OpenAI-style APIs.

## Context for AI Agents
- **Base Knowledge**: Refer to the `requirements/` folder for original requirements.
- **Decisions**: Refer to `plan/choices.md` for current technical stack and architectural decisions.
- **State**: Check the **GitHub Issues and Milestones** for the current progress. This is the single source of truth for the project's roadmap and task status.
