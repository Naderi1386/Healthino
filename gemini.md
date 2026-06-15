# Healthino - Software Engineering & Coding Rules

## 1. Technical Baseline
* **Framework Layer:** React 19+ with Vite.
* **Language Strictness:** TypeScript with strictly `"strict": true` enabled inside `tsconfig.json`.
* **NO `any` KEYWORD:** The utilization of `any` primitive type is completely prohibited. Write declarative custom interfaces/types for every prop, hook return, and database transaction object.

---

## 2. Architectural Boundary Guardrails (Feature-Based)
* The project enforces a strict **Feature-Based (Domain-Driven)** layout inside `src/features/`.
* **Isolation Rule:** Features must act as autonomous sandboxes. No file inside a feature folder is permitted to import deep internal modules from another feature folder.
* **Public API Boundary:** Features can only talk to each other via a clean root export file (`index.ts`) acting as the public API gatekeeper for that specific domain.

---

## 3. Code Cleanliness & Decomposition Standards
* **Component Size Cap:** No single UI component file should exceed a maximum threshold of **150 lines of code**. If code length is violated, you must immediately break it down into modular atomic elements inside `shared/components/` or sub-components.
* **Logic Decoupling:** UI layouts must be purely presentational. All calculation algorithms, Dexie.js database querying loops, and heavy status states must reside inside structured, cohesive **Custom Hooks**.
* **No Dead Code:** Empty code blocks, unused imported modules, dangling variables, or commented-out boilerplate sections are strictly forbidden.

---

## 4. Database Safety & Error Handling
* **Transaction Enclosures:** All local asynchronous writes and mutations to the Dexie.js database (`Dexie.js / IndexedDB`) must be enclosed securely inside `try/catch` wrappers.
* **Fail-Safe UI:** In case of database read/write failures, throw contextual errors to be caught gracefully by error boundaries without triggering application freezing.
* **Data Persistence:** Invoke `navigator.storage.persist()` intelligently on user initialization flows to defend client storage data maps against arbitrary browser cache clearing policies.

---

## 5. Modern Framework Patterns
* Always use the latest, state-of-the-art hooks and declarative syntax configurations provided by **Zustand** (utilizing atomic selectors for performance rendering) and **React Router v7+**.
* Write modular utility classes with Tailwind CSS v4 using semantic design variables. Avoid inline hodgepodge hardcodings.