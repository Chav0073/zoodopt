# Contributing to Zoodopt

Welcome! This document outlines how our team collaborates on the Zoodopt project. Please read carefully before pushing any code.

---

## 📁 Branching Strategy

- `main` → stable, demo-ready code only
- `dev` → shared working branch (default)
- `yourname/feature-name` → feature branches for new work

### 🔀 Creating a New Branch

Open terminal and run:

```
git checkout dev
git pull origin dev
git checkout -b yourname/feature-description
```

**Examples:**

- `melissa/user-form`
- `richer/backend-api`

---

## 📝 Commit Message Format

Use this structure:

```
<type>: <clear short summary>
```

### Common types:

- `feat:` → new feature
- `fix:` → bug fix
- `docs:` → documentation or planning update
- `chore:` → setup/config/cleanup

**Examples:**

```
feat: build dynamic form component
fix: resolve form submission bug
docs: add project timeline to README
```

---

## 🔐 Branch Protection Rules

### `main` (strict)

- ✅ Protected: no direct pushes
- ✅ Requires pull request with at least **1 approval**
- ✅ Must resolve all review comments
- ✅ Squash merge only

### `dev` (semi-protected)

- ✅ Cannot be deleted
- ✅ Force pushes disabled
- ✅ Direct pushes allowed (for now)
- ✅ No required reviews

---

## 📦 Pull Requests

1. Base your PR on the `dev` branch
2. Assign a teammate to review
3. Resolve any review comments
4. Use **squash merge** when approved

---

## 🤝 Code of Conduct

- Be respectful in comments and reviews
- Help each other learn — this is a team project!
- Use clear commit messages and consistent formatting

---

Thanks for contributing to Zoodopt!
