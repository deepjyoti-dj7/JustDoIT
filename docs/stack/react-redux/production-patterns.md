---
title: Production Patterns
description: Code splitting with React.lazy, bundle analysis, React Testing Library, accessibility, React.StrictMode, and performance profiling.
---

# Production Patterns

Shipping a React application to production involves more than working code. You need fast initial loads (code splitting), confidence in behaviour (testing), accessible interfaces (ARIA), and tools to diagnose and fix performance regressions before users notice them.

---

## Code Splitting with `React.lazy`

A single-bundle React app sends every page's code on first load. Code splitting creates separate chunks per route, loaded on demand:

```jsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const HomePage    = lazy(() => import('./pages/HomePage'));
const OrderList   = lazy(() => import('./pages/OrderList'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const AdminPanel  = lazy(() => import('./pages/AdminPanel'));

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/"           element={<HomePage />} />
        <Route path="/orders"     element={<OrderList />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/admin"      element={<AdminPanel />} />
      </Routes>
    </Suspense>
  );
}
```

Loading `/orders` only downloads the `OrderList` chunk. The admin panel code is never sent to regular users.

### Preloading on hover

```jsx
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

function AdminLink() {
  const preload = () => import('./pages/AdminPanel');
  return (
    <Link to="/admin" onMouseEnter={preload} onFocus={preload}>
      Admin Panel
    </Link>
  );
}
```

---

## Bundle Analysis

```bash
npm install --save-dev rollup-plugin-visualizer
```

```javascript
// vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({ open: true, gzipSize: true, filename: 'dist/stats.html' })
  ]
});
```

```bash
npm run build  # opens interactive treemap at dist/stats.html
```

Common findings: moment.js (67 KB gzipped — replace with dayjs), icon libraries imported wholesale instead of tree-shaken, duplicate dependencies at different versions.

---

## Testing with React Testing Library

RTL tests behaviour from a user's perspective — what they see and interact with — not implementation details:

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OrderCard } from './OrderCard';

describe('OrderCard', () => {
  const mockOrder = { id: 'order-123', status: 'pending', total: 49.99 };

  it('renders order details', () => {
    render(<OrderCard order={mockOrder} onCancel={vi.fn()} />);
    expect(screen.getByText('order-123')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('$49.99')).toBeInTheDocument();
  });

  it('calls onCancel when Cancel button clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<OrderCard order={mockOrder} onCancel={onCancel} />);
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledWith('order-123');
  });
});

// Async data loading
it('loads and displays orders', async () => {
  server.use(http.get('/api/orders', () => HttpResponse.json([mockOrder])));
  render(<OrderList customerId="cust-1" />);
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
  const orderRow = await screen.findByText('order-123');
  expect(orderRow).toBeInTheDocument();
});
```

### RTL query priority

| Query | Use when |
|---|---|
| `getByRole` | Accessible elements — **preferred, also tests accessibility** |
| `getByLabelText` | Form inputs with associated labels |
| `getByText` | Non-interactive text |
| `getByTestId` | Last resort only |
| `findBy*` | Async — waits for element to appear |
| `queryBy*` | Asserting element is NOT present |

---

## Accessibility (a11y)

```jsx
// BAD: div with click has no keyboard support
<div onClick={handleClick}>Click me</div>

// GOOD: button is keyboard-accessible and announced by screen readers
<button onClick={handleClick} type="button">Click me</button>

// Meaningful label when button text is not descriptive
<button
  onClick={() => deleteOrder(order.id)}
  aria-label={`Delete order ${order.id}`}
>
  <TrashIcon aria-hidden="true" />
</button>

// Live region — screen readers announce changes automatically
<div role="status" aria-live="polite">
  {saveStatus}
</div>
```

### Automated a11y checking

```bash
npm install --save-dev @axe-core/react
```

```jsx
// In development only — logs violations to console
if (process.env.NODE_ENV !== 'production') {
  const axe = await import('@axe-core/react');
  axe.default(React, ReactDOM, 1000);
}
```

---

## `React.StrictMode`

```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Development-only, zero production impact. It intentionally double-invokes render functions and `useEffect` to surface:
- Side effects placed incorrectly in the render body
- Missing cleanup in `useEffect`
- Deprecated lifecycle method usage

> If your app breaks with StrictMode, the double-render found a real bug — usually an object mutation inside render or an effect without a cleanup function.

---

## Performance Profiling

```jsx
import { Profiler } from 'react';

function onRender(id, phase, actualDuration) {
  if (actualDuration > 16) {
    console.warn(`${id} took ${actualDuration.toFixed(1)}ms (${phase})`);
  }
}

<Profiler id="OrderList" onRender={onRender}>
  <OrderList orders={orders} />
</Profiler>
```

**React DevTools Profiler** records every render, its duration, and why it rendered (prop/state/context/hook changed). Workflow:
1. Record a slow interaction
2. Find components that re-rendered unnecessarily
3. Add `React.memo`, `useMemo`, or `useCallback` only where the profiler proves it helps

---

## Environment Variables

```bash
# .env — Vite requires VITE_ prefix for client-side access
VITE_API_URL=https://api.example.com
VITE_STRIPE_KEY=pk_live_...
```

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

> Variables without `VITE_` are Node.js-only and never bundled. Never put secrets in `VITE_*` — they are shipped to every browser.
