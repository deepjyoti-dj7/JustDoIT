---
title: Routing and Forms
description: React Router v6 route configuration, dynamic params, nested routes, protected routes, and React Hook Form with Zod validation.
---

# Routing & Forms

React Router handles navigation between views in a single-page app. React Hook Form handles the complexity of forms — validation, error messages, submission state, and integration with UI libraries — without unnecessary re-renders.

---

## React Router v6

### Basic setup

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/orders"    element={<OrderList />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/admin/*"   element={<AdminRoutes />} />
        <Route path="*"          element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Navigation hooks

```jsx
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';

function OrderDetail() {
  const { id }     = useParams();       // /orders/:id -> { id: '123' }
  const navigate   = useNavigate();
  const location   = useLocation();     // { pathname, search, hash, state }
  const [searchParams, setSearchParams] = useSearchParams(); // ?page=2&sort=date

  const page = searchParams.get('page') ?? '1';

  const goBack = () => navigate(-1);    // go back in history
  const goToOrders = () => navigate('/orders', {
    state: { from: location.pathname }  // pass state between routes
  });

  return (
    <div>
      <button onClick={goBack}>Back</button>
      <h1>Order {id}</h1>
    </div>
  );
}
```

### Nested routes with `Outlet`

```jsx
// Parent layout component renders Outlet where children go
function AdminLayout() {
  return (
    <div className="admin">
      <AdminSidebar />
      <main>
        <Outlet />  {/* child routes render here */}
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index         element={<AdminDashboard />} /> {/* /admin */}
        <Route path="users"  element={<UserManagement />} /> {/* /admin/users */}
        <Route path="orders" element={<OrderManagement />} /> {/* /admin/orders */}
      </Route>
    </Routes>
  );
}
```

### Protected routes

```jsx
function RequireAuth({ children }) {
  const { user }   = useAuth();
  const location   = useLocation();

  if (!user) {
    // Redirect to login, save the attempted URL to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function RequireRole({ role, children }) {
  const { user } = useAuth();
  if (!user?.roles.includes(role)) {
    return <Navigate to="/403" replace />;
  }
  return children;
}

// Usage
<Route
  path="/orders"
  element={
    <RequireAuth>
      <OrderList />
    </RequireAuth>
  }
/>
<Route
  path="/admin"
  element={
    <RequireAuth>
      <RequireRole role="admin">
        <AdminPanel />
      </RequireRole>
    </RequireAuth>
  }
/>
```

### `Link` and `NavLink`

```jsx
import { Link, NavLink } from 'react-router-dom';

// Link — basic navigation
<Link to="/orders">All Orders</Link>
<Link to={`/orders/${order.id}`}>View Order</Link>

// NavLink — adds active class automatically
<NavLink
  to="/orders"
  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
>
  Orders
</NavLink>
```

---

## React Hook Form

React Hook Form uses uncontrolled inputs internally, only updating React state on validation/submit. This means far fewer re-renders than `useState`-based controlled forms.

### Basic form

```jsx
import { useForm } from 'react-hook-form';

function LoginForm({ onLogin }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    await onLogin(data.email, data.password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address'
            }
          })}
        />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register('password', { required: 'Password is required', minLength: 8 })}
        />
        {errors.password && <span className="error">{errors.password.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
```

### Zod integration with `zodResolver`

```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Minimum 8 characters'),
  confirmPassword: z.string()
}).refine(
  data => data.password === data.confirmPassword,
  { message: 'Passwords do not match', path: ['confirmPassword'] }
);

type RegisterFormData = z.infer<typeof schema>;

function RegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting, isDirty, isValid }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
    mode: 'onBlur'  // validate on field blur
  });

  const onSubmit = async (data: RegisterFormData) => {
    await registerUser(data);
    reset(); // clear form after successful submit
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}

      <input type="password" {...register('password')} />
      {errors.password && <p>{errors.password.message}</p>}

      <input type="password" {...register('confirmPassword')} />
      {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

      <button type="submit" disabled={isSubmitting || !isDirty || !isValid}>
        Register
      </button>
    </form>
  );
}
```

### Controlled components with `Controller`

For UI library components (Select, DatePicker, Checkbox groups) that don't use native HTML inputs:

```jsx
import { Controller } from 'react-hook-form';
import Select from 'react-select'; // example UI library

<Controller
  name="status"
  control={control}
  rules={{ required: 'Status is required' }}
  render={({ field, fieldState }) => (
    <div>
      <Select
        {...field}   // passes onChange, onBlur, value, ref
        options={statusOptions}
        placeholder="Select status..."
      />
      {fieldState.error && <p>{fieldState.error.message}</p>}
    </div>
  )}
/>
```

### Dynamic field arrays

```jsx
import { useFieldArray } from 'react-hook-form';

function OrderForm() {
  const { control, register, handleSubmit } = useForm({
    defaultValues: { items: [{ productId: '', quantity: 1 }] }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(`items.${index}.productId`)} />
          <input type="number" {...register(`items.${index}.quantity`)} />
          <button type="button" onClick={() => remove(index)}>Remove</button>
        </div>
      ))}
      <button type="button"
        onClick={() => append({ productId: '', quantity: 1 })}>
        Add Item
      </button>
      <button type="submit">Submit</button>
    </form>
  );
}
```
