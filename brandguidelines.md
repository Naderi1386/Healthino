# Healthino - Brand & Design Guidelines

## 1. Design Philosophy
Healthino is a premium, minimalist, and trustworthy privacy-first health application. The visual design must feel clean, organic, warm, and highly professional—deeply inspired by modern wellness aesthetics (e.g., More Nutrition). It must feel lightweight, premium, and calm, completely avoiding chaotic neon sport colors.

---

## 2. Design Tokens & Color Palette (Tailwind CSS Variables)
All colors must be implemented using custom Tailwind variables mapped in the base layer. Do not hardcode raw hex values inside features.

* **Background (Soft Base):** `#F9F6F0` (A warm, clean cream/off-white that reduces eye strain).
* **Primary Text & Heavy UI:** `#1C2421` (A premium luxury charcoal/deep olive-black instead of pitch black).
* **Accent Primary (Organic Well-being):** `#4A6B5D` (A muted, sophisticated sage green used for success, health, and 🟢 tags).
* **Accent Secondary (Energy/Focus):** `#E5A93C` (A warm golden-amber/ochre used for warnings, progress rings, and 🟡 tags).
* **Alert/Danger (Refined Warning):** `#C95A49` (A soft terracota/muted red used for deletions, unhealthy alerts, and 🔴 tags).
* **Card Backgrounds:** `#FFFFFF` (Pure white cards overlaying the cream background to create elegant depth).

---

## 3. Typography & Spacing
* **Font Family:** Clean, highly readable geometric sans-serif (e.g., Inter, Plus Jakarta Sans) with optimized line heights.
* **Scale:** Use strict Tailwind spacing metrics (`gap-4`, `p-6`, `space-y-4`). Avoid random pixel spacing.

---

## 4. UI Layout & Component Aesthetics
* **Layout Structure (User Panel Matrix):**
    * **Desktop:** Strict 30/70 split. A fixed, sticky Left Side Menu spanning 30% of the viewport width. A fluid, responsive Right Content Area spanning 70%.
    * **Mobile:** Left Side Menu transitions seamlessly into an animated bottom drawer or a full-width hamburger overlay.
* **Component Borders:** High use of smooth, rounded shapes. Standard cards and containers must use `rounded-2xl` ($16\text{px}$) or `rounded-3xl` ($24\text{px}$).
* **Shadows:** Extremely subtle, soft ambient shadows (`shadow-sm` or custom low-blur shadows) to maintain flat yet dimensional luxury aesthetics.

---

## 5. Motion & Interaction Principles
* **Micro-interactions:** Any button hover or tag click must have a feedback duration of exactly `0.2s` with an `ease-out` transition using Framer Motion.
* **Page Transitions:** Smooth client-side route transitions (fade-in/slide-up) to eliminate rigid layout shifts.
* **Interactive Charts:** Recharts implementations must utilize custom smooth tooltips themed in `#1C2421` with white typography.