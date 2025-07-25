# Branch Naming Convention

To keep our repository organized and consistent, all branches must follow this naming convention:

## Frontend Branches

Use for React development:

- `frontend/feature-name`
- `frontend/fix-issue-name`
- `frontend/style-update`

**Examples:**

- `frontend/login-page`
- `frontend/pet-list-view`

## Backend Branches

Use for API, database, authentication, or EF model logic:

- `backend/feature-name`
- `backend/fix-issue-name`
- `backend/model-update`

**Examples:**

- `backend/auth-jwt`
- `backend/pets-crud`
- `backend/applications-crud`

## Documentation or Config (Exception)

For small tasks related to documentation, Git config, or API specs:

- `docs/*`
- `config/*`

**Docs/config branches are exempt from the strict "1 branch per PR" rule.**

- You may group multiple related changes (e.g., `.gitignore`, `.env`, OpenAPI draft) into one branch and one PR if they are non-breaking.
- These branches may be merged without review if agreed by the team.

**Examples:**

- `docs/openapi-draft`
- `config/gitignore-env`

## General Rules

- Always branch off `main`
- Use lowercase and hyphens
- Prefer one branch per feature or fix (except docs/config as noted)
- Merge via pull request (no direct commits to `main`)
