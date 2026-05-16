# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 04: Project Dialogs — complete

## Completed

- **01-design-system**: shadcn/ui initialized (Tailwind v4), Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea added. `lucide-react` installed. `lib/utils.ts` with `cn()` created. `globals.css` updated with the full dark theme token set — all shadcn tokens remapped to the project palette. `<html>` has `class="dark"` for shadcn dark variant activation.
- **02-editor-chrome**: `components/editor/editor-navbar.tsx` — fixed-height navbar with `PanelLeftOpen`/`PanelLeftClose` toggle and left/center/right section layout. `components/editor/project-sidebar.tsx` — fixed overlay sidebar that slides in from left without pushing content; `isOpen`/`onClose` props; Projects header with close button; shadcn Tabs (My Projects / Shared) with empty placeholder states; full-width New Project button footer. Dialog pattern ready via existing shadcn `dialog.tsx` + color tokens.
- **03-auth**: `@clerk/ui` installed. `ClerkProvider` wraps root layout with `dark` theme from `@clerk/ui/themes` and CSS variable overrides. `proxy.ts` at project root (Next.js 16 middleware) uses `clerkMiddleware` + `createRouteMatcher` to protect all routes except `/sign-in` and `/sign-up`. Sign-in and sign-up pages at `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx` — two-panel layout (left: logo/tagline/feature list, right: Clerk form) on large screens; form-only on small screens. `app/page.tsx` redirects authenticated users to `/editor`, unauthenticated to `/sign-in`. `UserButton` added to editor navbar right section.
- **04-project-dialogs**: `data/mock-projects.ts` with `MockProject` type and mock owned/shared lists. `hooks/use-project-dialogs.ts` manages dialog, form, and loading state. `contexts/project-dialogs-context.tsx` provides hook via React context. `components/editor/project-dialogs.tsx` renders Create/Rename/Delete dialogs with controlled open state. `components/editor/editor-home.tsx` — centered heading, description, and New Project button. `app/editor/page.tsx` renders EditorHome. Sidebar updated with project list, owned-only rename/delete hover actions, wired New Project button, and mobile backdrop scrim at z-40. `editor-shell.tsx` uses the hook, provides context, and renders dialogs.

## In Progress

- None.

## Next Up

- Feature 05 (TBD — per spec files).

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Dark-only theme: all shadcn CSS variable defaults set to the dark palette in `:root`. No `.dark` override block needed; `class="dark"` on `<html>` activates shadcn dark variants.
- `components/ui/*` files are unmodified generated files and must not be edited.

## Session Notes

- Add context needed to resume work in the next session.
