---
title: Advanced React
description: Custom hooks, memoisation with useMemo/useCallback/React.memo, useReducer, Context design, Error Boundaries, Suspense, and concurrent features.
---

# Advanced React

Once you understand the fundamentals, the next layer is about performance and architecture: when to memoize, when not to, how to structure shared state, and how to handle errors and loading states gracefully across your component tree.

---

## Custom Hooks

Custom hooks extract stateful logic into reusable functions. Any function starting with `use` that calls other hooks is a custom hook. They let you share *behaviour* (not UI) between components:

```jsx
// useFetch — generic data fetching with loading/error states
function useFetch(url) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => !cancelled && (setData(data), setLoading(false)))
      .catch(err  => !cancelled && (setError(err.message), setLoading(false)));

    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}

// useLocalStorage — persists state across page reloads
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStoredValue];
}

// useDebounce — delays value updates for search inputs
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

### Rules of Hooks

1. **Only call hooks at the top level** — never inside loops, conditions, or nested functions
2. **Only call hooks from React function components** or other custom hooks

---

## `useMemo`, `useCallback`, and `React.memo`

These three tools solve the same problem: preventing unnecessary work when a parent re-renders. **But premature optimisation is real** — add them only when you have measured a performance problem.

### `React.memo` — skip re-rendering a component

```jsx
// OrderRow re-renders whenever the parent renders, even if order/onCancel didn't change
const OrderRow = React.memo(function OrderRow({ order, onCancel }) {
  console.log('Rendering OrderRow', order.id);
  return (
    <tr>
      <td>{order.id}</td>
      <td>{order.status}</td>
      <td>
        <button onClick={() => onCancel(order.id)}>Cancel</button>
      </td>
    </tr>
  );
});
// Now only re-renders when `order` or `onCancel` reference changes
```

### `useCallback` — stable function reference

```jsx
function OrderList({ orders }) {
  // Without useCallback: handleCancel is a NEW function on every render
  // => React.memo on OrderRow is useless because the prop keeps changing
  const handleCancel = useCallback((orderId) => {
    cancelOrder(orderId);
  }, []); // empty deps: function never changes

  return (
    <table>
      {orders.map(order =>
        <OrderRow key={order.id} order={order} onCancel={handleCancel} />
      )}
    </table>
  );
}
```

### `useMemo` — memoize expensive calculations

```jsx
function OrderSummary({ orders }) {
  // Without useMemo: recalculates on every render even if orders hasn't changed
  const totals = useMemo(() => ({
    count:    orders.length,
    revenue:  orders.reduce((sum, o) => sum + o.total, 0),
    pending:  orders.filter(o => o.status === 'pending').length,
    avgValue: orders.length
      ? orders.reduce((s, o) => s + o.total, 0) / orders.length
      : 0
  }), [orders]); // recalculate only when orders array changes

  return <div>...</div>;
}
```

> **When NOT to memoize:** most components, simple calculations, components that almost always re-render for good reasons. Memoisation has a cost (comparison on every render). Profile first, then optimise.

---

## `useReducer` — Complex State Logic

`useReducer` is `useState` for state with complex transitions. It centralises state logic and makes it testable:

```jsx
const initialState = {
  items: [],
  total: 0,
  promoCode: null,
  discount: 0
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find(i => i.id === action.item.id);
      const items = exists
        ? state.items.map(i => i.id === action.item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i)
        : [...state.items, { ...action.item, quantity: 1 }];
      return { ...state, items, total: calcTotal(items, state.discount) };
    }
    case 'REMOVE_ITEM':
      const items = state.items.filter(i => i.id !== action.id);
      return { ...state, items, total: calcTotal(items, state.discount) };
    case 'APPLY_PROMO':
      return { ...state, promoCode: action.code, discount: action.discount };
    case 'RESET':
      return initialState;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function Cart() {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  return (
    <div>
      {cart.items.map(item => (
        <CartItem
          key={item.id}
          item={item}
          onRemove={() => dispatch({ type: 'REMOVE_ITEM', id: item.id })}
        />
      ))}
      <p>Total: ${cart.total.toFixed(2)}</p>
    </div>
  );
}
```

---

## Context API — Performance Patterns

The classic problem: any component consuming a context re-renders when ANY part of the context value changes, even if the component only uses one field.

```jsx
// PROBLEM: one context for everything
const AppContext = createContext();
// If user logs in, ALL consumers re-render, even those that only need theme

// SOLUTION: split contexts by update frequency
const AuthContext  = createContext();  // changes on login/logout
const ThemeContext = createContext(); // changes when user toggles dark mode
const CartContext  = createContext();  // changes on every add/remove

// Components subscribe only to what they care about
function Header() {
  const { user }  = useAuth();   // re-renders on login/logout
  const { theme } = useTheme();  // re-renders on theme change
  // NOT re-rendered when cart changes
  ...
}
```

---

## Error Boundaries

Error boundaries catch JavaScript errors in their child tree and display a fallback UI instead of crashing the whole app. They must be class components (or use the `react-error-boundary` library):

```jsx
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="error-container">
      <h2>Something went wrong</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => { /* optional cleanup */ }}
      onError={(error, info) => logger.error(error, info)} // send to Sentry etc.
    >
      <OrderList />
    </ErrorBoundary>
  );
}
```

> **Error boundaries do NOT catch:** async errors (`setTimeout`, promises), event handler errors, errors in the boundary itself. Use `try/catch` for those.

---

## Suspense and `React.lazy`

Suspense lets you declaratively handle loading states for code splitting and async data:

```jsx
import { lazy, Suspense } from 'react';

// Code-split — each lazy component is its own JS chunk
const OrderList   = lazy(() => import('./pages/OrderList'));
const AdminPanel  = lazy(() => import('./pages/AdminPanel'));
const Analytics   = lazy(() => import('./pages/Analytics'));

function App() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        <Route path="/orders"  element={<OrderList />} />
        <Route path="/admin"   element={<AdminPanel />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Suspense>
  );
}
```

---

## Concurrent Features

### `useTransition` — non-urgent state updates

```jsx
import { useState, useTransition } from 'react';

function SearchPage() {
  const [query, setQuery]   = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e) => {
    setQuery(e.target.value);  // urgent — update input immediately

    startTransition(() => {
      // non-urgent — React can interrupt this if user keeps typing
      setResults(searchProducts(e.target.value));
    });
  };

  return (
    <div>
      <input value={query} onChange={handleSearch} />
      {isPending ? <Spinner /> : <ResultList results={results} />}
    </div>
  );
}
```

### `useDeferredValue` — defer expensive renders

```jsx
import { useDeferredValue } from 'react';

function ProductGrid({ filters }) {
  // deferredFilters lags behind filters during rapid changes
  // React renders the old results while computing the new ones
  const deferredFilters = useDeferredValue(filters);
  const products = useMemo(
    () => expensiveFilter(allProducts, deferredFilters),
    [deferredFilters]
  );

  return <Grid products={products} stale={filters !== deferredFilters} />;
}
```
