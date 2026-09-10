# Rebuild Organization from the GovernOS v2 prototype

## Goal
Replace the current entity cards, departmental cards, and basic directory with the uploaded People, Roles & Structure experience, while keeping the existing Govern OS shell, logo, theme controls, and semantic design system.

## Navigation
Keep Organization navigation in the sidebar rather than adding tabs inside pages:
- Employees
- Roles
- Structure

`/organization` will open Employees by default. Existing Organization URLs will redirect to their closest replacement so saved links do not break.

## Screens and behavior

### Employees
- Search by name, role, email, or employee ID.
- Cascading company and department filters, removable filter chips, result count, sortable columns, pagination, and resettable empty state.
- Surface employees with no department as a visible data-quality alert and filter.
- Open an employee profile with:
  - one position row for each hierarchy: Legal, Operations, Governance;
  - reporting line and direct reports;
  - contact, status, join year, and location details.

### Roles
- Add a dedicated role catalogue because roles persist independently of employees.
- Search and filter by Operations or Governance hierarchy.
- Show organizational home, grade, holders, and owned documents.
- Sort vacancies prominently and summarize vacant roles plus documents without an owner.
- Open role details showing authority, document ownership, status, and assigned employees; vacant roles clearly explain approval-chain escalation.

### Structure
- Provide three hierarchy lenses: Legal ownership, Operations, and Governance.
- Render expandable trees with counts, shared departments, vacancies, subsidiaries, and unplaced employees.
- Selecting a company, department, governance body, or data gap opens a contextual detail panel with links into filtered Employees or Role details.
- The hierarchy lens control is local to the Structure tool; the three main Organization destinations remain sidebar children.

## Data model
- Replace the small Organization mock dataset with typed companies, departments, governance bodies, roles, and employees based on the uploaded prototype.
- Preserve deterministic sample generation so employee counts, reporting relationships, assignments, vacancies, and document ownership remain stable.
- Model legal employer, operations role, optional governance role, manager, location type, and placement status separately.

## Technical details
- Build reusable Organization components for badges, trees, tables, detail panels, and profile/detail views.
- Use TanStack routes and navigation state; no second application shell and no embedded standalone HTML/CSS.
- Use existing `Button`, `Input`, table, card, and semantic Tailwind tokens; adapt the prototype’s restrained information hierarchy without copying its monochrome theme over the current brand.
- Add responsive overflow/stacking behavior and keyboard-accessible interactive rows.
- Add complete route metadata for each new content route.
- Verify Employees, Roles, and all three Structure lenses in the running desktop preview, plus a compact-width layout check.
