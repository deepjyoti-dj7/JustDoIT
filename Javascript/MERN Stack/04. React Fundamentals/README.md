# React Fundamentals

This folder covers the foundational React concepts you need for MERN development: setup, components, props/state, events, lists/keys, forms, lifecycle, composition, and best practices. Each file includes clear examples and interview Q&A.

## Topics
- 01. Introduction to React
- 02. Setup & Create React App
- 03. Components (Functional & Class)
- 04. Props & State
- 05. Events & Conditional Rendering
- 06. Lists, Keys & Rendering
- 07. Forms (Controlled & Uncontrolled)
- 08. Lifecycle Methods
- 09. Composition, Thinking & Tools
- 10. React Best Practices

## Quick Start

```bash
# Create a modern React app (recommended)
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev

# Or with CRA (legacy)
npx create-react-app my-react-app
cd my-react-app
npm start
```

## File Structure Example

```text
src/
	components/
	hooks/
	pages/
	App.jsx
	main.jsx
```

## Summary
- React is a component-based library using JSX and a virtual DOM.
- Prefer functional components with hooks.
- Use keys for lists, controlled inputs for forms.
- Manage state at the right level; lift state when needed.
- Follow best practices: hooks rules, memoization, accessibility, testing.
