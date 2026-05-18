# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 07: Wire editor home — complete

## Completed

- **01-design-system**: shadcn/ui initialized (Tailwind v4), Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea added. `lucide-react` installed. `lib/utils.ts` with `cn()` created. `globals.css` updated with the full dark theme token set — all shadcn tokens remapped to the project palette. `<html>` has `class="dark"` for shadcn dark variant activation.
- **02-editor-chrome**: `components/editor/editor-navbar.tsx` — fixed-height navbar with `PanelLeftOpen`/`PanelLeftClose` toggle and left/center/right section layout. `components/editor/project-sidebar.tsx` — fixed overlay sidebar that slides in from left without pushing content; `isOpen`/`onClose` props; Projects header with close button; shadcn Tabs (My Projects / Shared) with empty placeholder states; full-width New Project button footer. Dialog pattern ready via existing shadcn `dialog.tsx` + color tokens.
- **03-auth**: `@clerk/ui` installed. `ClerkProvider` wraps root layout with `dark` theme from `@clerk/ui/themes` and CSS variable overrides. `proxy.ts` at project root (Next.js 16 middleware) uses `clerkMiddleware` + `createRouteMatcher` to protect all routes except `/sign-in` and `/sign-up`. Sign-in and sign-up pages at `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx` — two-panel layout (left: logo/tagline/feature list, right: Clerk form) on large screens; form-only on small screens. `app/page.tsx` redirects authenticated users to `/editor`, unauthenticated to `/sign-in`. `UserButton` added to editor navbar right section.
- **04-project-dialogs**: `data/mock-projects.ts` with `MockProject` type and mock owned/shared lists. `hooks/use-project-dialogs.ts` manages dialog, form, and loading state. `contexts/project-dialogs-context.tsx` provides hook via React context. `components/editor/project-dialogs.tsx` renders Create/Rename/Delete dialogs with controlled open state. `components/editor/editor-home.tsx` — centered heading, description, and New Project button. `app/editor/page.tsx` renders EditorHome. Sidebar updated with project list, owned-only rename/delete hover actions, wired New Project button, and mobile backdrop scrim at z-40. `editor-shell.tsx` uses the hook, provides context, and renders dialogs.
- **05-prisma**: `prisma/models/project.prisma` defines `ProjectStatus` enum, `Project` model (ownerId, name, optional description, status, canvasJsonPath, timestamps, indexes on ownerId and createdAt), and `ProjectCollaborator` model (project relation with cascade delete, email, createdAt, unique on project/email, indexes on email and project/createdAt). `lib/prisma.ts` exports a cached `PrismaClient` singleton using `@prisma/adapter-pg`; branches on `DATABASE_URL` prefix (`prisma+postgres://` vs. direct). Migration `20260517034542_init_projects` applied to Prisma Postgres. Client generated to `app/generated/prisma/`.
- **06-project-apis**: `app/api/projects/route.ts` — GET lists the authenticated user's projects ordered by `createdAt` desc; POST creates a project with `ownerId` from Clerk `userId`, defaulting `name` to `"Untitled Project"`. `app/api/projects/[projectId]/route.ts` — PATCH renames a project (owner-only, 403 for non-owners); DELETE removes a project (owner-only, 204 on success). Both routes return 401 for unauthenticated requests. No UI wiring.
- **07-wire-editor-home**: `app/editor/page.tsx` is now a server component that fetches owned and shared projects via `lib/data/projects.ts` and passes them to `EditorHomeShell`. `contexts/sidebar-state-context.tsx` provides `isSidebarOpen`/`toggleSidebar`/`closeSidebar`/`toggleRef` so `EditorNavbar` and `EditorHomeShell` share sidebar state without prop-drilling through the layout. `EditorShell` is slimmed to navbar + main wrapper; sidebar and dialogs live in `EditorHomeShell` (page-level). `hooks/use-project-actions.ts` replaces the mock hook: calls real `POST`/`PATCH`/`DELETE` API routes, generates a `slug-suffix` room ID, navigates to the new workspace after create, refreshes after rename/delete, and redirects to `/editor` when deleting the active workspace. POST API updated to accept an optional custom `id` (validated against a safe slug pattern) so project ID and Liveblocks room ID stay aligned. Create dialog shows the room ID preview.

## In Progress

- None.

## Next Up

- Feature 08 (TBD — per spec files).

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Dark-only theme: all shadcn CSS variable defaults set to the dark palette in `:root`. No `.dark` override block needed; `class="dark"` on `<html>` activates shadcn dark variants.
- `components/ui/*` files are unmodified generated files and must not be edited.

## Session Notes

- Add context needed to resume work in the next session.
