---
title: Redux
description: Redux Toolkit createSlice, createAsyncThunk, configureStore, Reselect selectors, and RTK Query for server-state management with cache invalidation.
---

# Redux

Redux solves one problem: predictable, centralised state management for complex applications where multiple components need the same data and state transitions need to be traceable. Redux Toolkit (RTK) is the official, modern way to write Redux — it eliminates the boilerplate that made classic Redux painful.

---

## When to Use Redux

Not every app needs Redux. Use it when:
- Multiple unrelated components need the same state
- State transitions are complex and need to be debugged/traced
- You have complex async flows with loading/error states across many features
- Your app has significant server state that needs caching (RTK Query handles this)

**Do not use Redux for:** local UI state (modal open/closed, form values), server state for simple apps (React Query or RTK Query handle this better without Redux).

---

## `createSlice` — The Building Block

A slice owns one piece of the Redux state and all the actions that modify it:

```javascript
// features/orders/ordersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async action — handles pending/fulfilled/rejected lifecycle
export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/orders?customerId=${customerId}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancel',
  async (orderId, { rejectWithValue }) => {
    try {
      await fetch(`/api/orders/${orderId}/cancel`, { method: 'POST' });
      return orderId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    items:   [],
    loading: false,
    error:   null,
    selected: null
  },
  reducers: {
    // Synchronous actions — Immer allows "mutating" syntax safely
    selectOrder(state, action) {
      state.selected = action.payload;
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchOrders lifecycle
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // cancelOrder lifecycle
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.items = state.items.filter(o => o.id !== action.payload);
      });
  }
});

export const { selectOrder, clearError } = ordersSlice.actions;
export default ordersSlice.reducer;
```

---

## `configureStore` — Assembling the Store

```javascript
// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from '../features/orders/ordersSlice';
import authReducer   from '../features/auth/authSlice';
import { apiSlice }  from '../features/api/apiSlice'; // RTK Query

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    auth:   authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer, // RTK Query reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // RTK Query middleware
  devTools: process.env.NODE_ENV !== 'production'
});

// TypeScript types (if using TS)
export type RootState    = ReturnType<typeof store.getState>;
export type AppDispatch  = typeof store.dispatch;
```

```jsx
// main.jsx — wrap app with Provider
import { Provider } from 'react-redux';
import { store } from './store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

---

## Connecting Components

```jsx
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, cancelOrder, selectOrder } from './ordersSlice';

function OrderList({ customerId }) {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchOrders(customerId));
  }, [dispatch, customerId]);

  const handleCancel = (orderId) => {
    dispatch(cancelOrder(orderId));
  };

  if (loading) return <Spinner />;
  if (error)   return <ErrorBanner message={error} />;

  return (
    <ul>
      {items.map(order => (
        <li key={order.id}>
          {order.id} — {order.status}
          <button onClick={() => handleCancel(order.id)}>Cancel</button>
        </li>
      ))}
    </ul>
  );
}
```

---

## Selectors with Reselect

Memoized selectors prevent unnecessary re-renders when the store changes but the derived value does not:

```javascript
// features/orders/selectors.js
import { createSelector } from '@reduxjs/toolkit'; // re-exports from Reselect

// Input selectors — cheap, non-memoized
const selectOrders       = state => state.orders.items;
const selectStatusFilter = state => state.orders.filter;

// Output selector — only recalculates when inputs change
export const selectFilteredOrders = createSelector(
  [selectOrders, selectStatusFilter],
  (orders, filter) => {
    if (!filter) return orders;
    return orders.filter(o => o.status === filter);
  }
);

export const selectOrderStats = createSelector(
  [selectOrders],
  (orders) => ({
    total:    orders.length,
    pending:  orders.filter(o => o.status === 'pending').length,
    revenue:  orders.reduce((sum, o) => sum + o.total, 0)
  })
);

// Usage — only re-renders when filteredOrders actually changes
const filteredOrders = useSelector(selectFilteredOrders);
```

---

## RTK Query — Server State Made Simple

RTK Query is a data fetching and caching library built into RTK. It eliminates manual loading/error state management for server data:

```javascript
// features/api/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    }
  }),
  tagTypes: ['Order', 'Product'],  // for cache invalidation
  endpoints: (builder) => ({

    // Query — GET request with caching
    getOrders: builder.query({
      query: (customerId) => `/orders?customerId=${customerId}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Order', id })), 'Order']
          : ['Order'],
      transformResponse: (response) => response.data, // unwrap wrapper
    }),

    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }]
    }),

    // Mutation — POST/PUT/DELETE with cache invalidation
    createOrder: builder.mutation({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: ['Order'], // clears the orders list cache
    }),

    cancelOrder: builder.mutation({
      query: (id) => ({ url: `/orders/${id}/cancel`, method: 'POST' }),
      invalidatesTags: (result, error, id) => [{ type: 'Order', id }]
    }),
  })
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useCancelOrderMutation
} = apiSlice;
```

```jsx
// Usage — no loading state management, no useEffect, no dispatch
function OrderList({ customerId }) {
  const { data: orders, isLoading, isError, error }
    = useGetOrdersQuery(customerId);
  const [cancelOrder, { isLoading: isCancelling }]
    = useCancelOrderMutation();

  if (isLoading) return <Spinner />;
  if (isError)   return <Error message={error.message} />;

  return (
    <ul>
      {orders.map(order => (
        <li key={order.id}>
          {order.id}
          <button
            onClick={() => cancelOrder(order.id)}
            disabled={isCancelling}
          >
            Cancel
          </button>
        </li>
      ))}
    </ul>
  );
}
```

### Optimistic updates

```javascript
cancelOrder: builder.mutation({
  query: (id) => ({ url: `/orders/${id}/cancel`, method: 'POST' }),
  async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
    // Optimistically update the cache before the request completes
    const patchResult = dispatch(
      apiSlice.util.updateQueryData('getOrders', undefined, (draft) => {
        const order = draft.find(o => o.id === id);
        if (order) order.status = 'cancelled';
      })
    );
    try {
      await queryFulfilled;
    } catch {
      patchResult.undo(); // revert if the request fails
    }
  }
}),
```
