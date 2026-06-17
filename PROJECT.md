# PROJECT: BuildAForm

This document serves as the primary context for any AI agent working on the BuildAForm project. It describes the project's goals, approach, and constraints.

## Project Goal
Build a modern, full-stack "Mini-Typeform" clone that allows users to create questionnaires (Form Builder), fill them out (Form Responder), and view results (Response Viewer), with an added layer of AI-powered form generation.

## Core Approach
We follow a **structured, documentation-first** approach to development:

1.  **Exhaustive Planning**: No code is written without a clear plan.
2.  **Sequential Implementation**: Tasks are tackled in the order defined by the project specifications (Requirement PDFs):
3.  **Minimalist Start**: Focus on mandatory features first. Optional features like Authentication are deferred until the core logic is solid.
4.  **Standardized Workflow**:
    - Use **Gitflow** for managing branches (main, develop, feature branches).
    - Use a **GitHub-issues-based workflow** to track tasks and progress.
    - **Branches**:
      - Do NOT include issue numbers in branch names.
      - AI agents MUST NEVER merge into or rebase `develop` or `main` branches.
    - **Pushing Policy**: AI agents MUST NEVER push to the remote repository. They can commit locally, but the actual push must be performed by a human.
    - **Authorship Policy**: AI agents MUST NOT sign their names as co-authors or contributors in commits, Pull Requests, or documentation. All work is the responsibility of a human, and AI agents must remain anonymous in the repository history.
    - **Pull Requests**: AI agents can create Pull Requests only for branches that have already been pushed to the remote by a human.

## Context for AI Agents
- **Base Knowledge**: Refer to the `requirements/` folder for original requirements.
- **Technical Choices**: ALL technical decisions (stack, architecture, etc.) are documented in `plan/choices.md`. AI agents MUST review this file before starting any work.
- **State**: Check the **GitHub Issues and Milestones** for the current progress. This is the single source of truth for the project's roadmap and task status.
