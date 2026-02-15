# Frontend Coding Guidelines

## UI Framework

> [!IMPORTANT]
> **Use MUI (Material UI) components exclusively.** Do not use raw HTML elements when an MUI equivalent exists. No Tailwind, no custom CSS frameworks.

| Instead of          | Use                                               |
| ------------------- | ------------------------------------------------- |
| `<button>`          | `<Button>` from `@mui/material`                   |
| `<input>`           | `<TextField>`                                     |
| `<div>` for layout  | `<Box>`, `<Stack>`, `<Grid>`, `<Container>`       |
| `<table>`           | `<Table>` or `<DataGrid>` from `@mui/x-data-grid` |
| `<ul>/<li>` for nav | `<List>`, `<ListItem>`, `<ListItemButton>`        |
| CSS media queries   | MUI `useMediaQuery` or responsive `sx` props      |

**Styling:** Use the `sx` prop and MUI's `theme` object. Avoid inline `style={}` and external CSS files for component-specific styles.

```tsx
// ✅ Good
<Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>

// ❌ Bad
<div style={{ padding: 16, backgroundColor: 'white', borderRadius: 8 }}>
```

---

## Architecture — Feature-Based Structure

```
src/
  ├── app/                      # Next.js pages & layouts
  │   ├── (auth)/               # Auth route group
  │   ├── (protected)/          # Protected route group
  │   └── components/           # Shared UI components
  │       ├── auth/             # Auth-specific components
  │       ├── charts/           # D3 chart components
  │       ├── dashboard/        # Dashboard widgets
  │       ├── layout/           # Shell, sidebar, topbar
  │       └── tickets/          # Ticket-related components
  ├── context/                  # React Context providers
  ├── hooks/                    # Custom hooks (page-level)
  ├── lib/                      # Utilities & API
  │   ├── hooks/                # Data-fetching hooks
  │   ├── api/                  # API endpoint functions
  │   ├── api.ts                # Base API client
  │   ├── auth.ts               # Auth cookie helpers
  │   └── types.ts              # Shared TypeScript types
  └── constant/                 # App constants
```

---

## State Management

1. **React Context** for global state (auth, RBAC). No Redux unless app grows significantly.
2. **`useState` + `useEffect`** for local component state and data fetching.
3. **Cookies** (via `js-cookie`) for persistent auth state — not `localStorage`.

| State Type                       | Where                                        |
| -------------------------------- | -------------------------------------------- |
| User session, tokens             | `AuthContext` + cookies                      |
| Active org/project, permissions  | `RBACContext` + cookies                      |
| Form inputs, UI toggles          | Component-local `useState`                   |
| Server data (analytics, tickets) | Custom hooks (`useDashboardAnalytics`, etc.) |

---

## RBAC & Permissions

1. **Use `useRBAC().can('permission.slug')`** — Never check role names.
2. **Conditionally render** UI elements based on permissions, don't just hide with CSS.
3. **System admins** bypass all checks via `isSystemAdmin` flag — checked inside `can()`.
4. **Context headers** — `apiClient` automatically attaches `x-org-id`/`x-project-id` from cookies. Never set them manually.

```tsx
// ✅ Good — permission-based
const { can } = useRBAC();
{
  can("ticket.create") && <Button>New Ticket</Button>;
}

// ❌ Bad — role-based
{
  user.role === "ADMIN" && <Button>New Ticket</Button>;
}
```

---

## API Layer

1. **All API calls through `apiClient()`** — Never raw `fetch()` or direct `axios`.
2. **Endpoint functions in `lib/api/`** — e.g., `api.tickets.ts`, `api.auth.ts`.
3. **Data-fetching hooks in `lib/hooks/`** — Wrap API calls with loading/error state management.
4. **Auth header** — Set `auth: true` in `apiClient` options. Token injection is automatic.

```typescript
// ✅ Good — in lib/api/api.tickets.ts
export const getTickets = () =>
  apiClient<ITicket[]>("/tickets", { auth: true });

// ✅ Good — in lib/hooks/useTickets.ts
export function useTickets() {
  const [data, setData] = useState<ITicket[]>([]);
  const [loading, setLoading] = useState(true);
  // ...fetch in useEffect
}

// ❌ Bad — raw fetch in a component
fetch("/api/tickets", { headers: { Authorization: `Bearer ${token}` } });
```

---

## Components

1. **One component per file** — Name file same as component (`KPICard.tsx` exports `KPICard`).
2. **`"use client"` directive** — Required on every component that uses hooks, state, or browser APIs.
3. **Props interface** — Define above the component, not inline.
4. **Skeleton loading** — Use MUI `<Skeleton>` during data loading. Never show blank screens.
5. **Error boundaries** — Show user-friendly error messages, not raw error objects.

```tsx
// ✅ Good
interface TicketCardProps {
    ticket: ITicket;
    onEdit?: () => void;
}

export default function TicketCard({ ticket, onEdit }: TicketCardProps) { ... }
```

---

## Charts (D3)

1. **Wrap D3 in reusable components** — `D3DonutChart`, `D3BarChart`, etc.
2. **Use MUI theme colors** — Access via `useTheme()`, don't hardcode hex values for chart elements.
3. **Responsive** — Charts must resize properly. Use `ResizeObserver` or container-based sizing.

---

## TypeScript

1. **No `any`** — Use `unknown` and narrow, or define proper interfaces.
2. **Shared types in `lib/types.ts`** — All API response types, entity interfaces.
3. **Prefix interfaces** — `IUser`, `ITicket`, `IOrganization` for data models.
4. **Use `type` for unions/intersections**, `interface` for object shapes.

---

## Navigation & Routing

1. **Sidebar menu items** are permission-gated via `can()` — not role strings.
2. **Use `useRouter()` from `next/navigation`** — Never `window.location`.
3. **Route groups** — `(auth)` for public routes, `(protected)` for authenticated routes.
4. **All protected routes** render inside `AppShell` (sidebar + topbar).

---

## General

- **No `console.log` in production** — Remove or guard with `process.env.NODE_ENV`.
- **No hardcoded strings** for permissions, API URLs, or credentials.
- **Keep components small** — If a component is > 200 lines, break it up.
- **Consistent spacing** — Use MUI spacing units (`p: 2` = 16px, `gap: 3` = 24px).
- **Accessibility** — Always add `aria-label` on icon-only buttons, proper heading hierarchy.
