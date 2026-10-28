# ReferHire Design System Specification
## "Editorial Precision Meets Professional Technology"

> **Framework:** React 18 + Vite + Three.js + Vanilla CSS Custom Properties
> **Generated via UI/UX Pro Max Skill** (`ui-ux-pro-max`)
> **Core Direction:** Minimalist Swiss & Editorial Publication Architecture

---

## 1. Brand Identity & Personality

* **Voice:** Intelligent, Professional, Credible, Ambitious, Approachable, Precise, Calmly Confident.
* **Aesthetic Philosophy:** The rigor of an elite financial/architectural journal merged with the speed and utility of a next-generation career graph.
* **Anti-Patterns Strictly Avoided:**
  * ❌ No generic dark purple/violet glowing SaaS gradients.
  * ❌ No floating orbs, neon halos, or confetti particles.
  * ❌ No identical oversized rounded-rectangle cards stacked blindly.
  * ❌ No decorative glassmorphism blurring everywhere.
  * ❌ No fabricated testimonials or fake success metrics.
  * ❌ No emojis used as primary UI iconography (use Lucide icons exclusively).

---

## 2. Color System & Semantic Tokens

### Primary Editorial Palette
* **Canvas Background (`--bg-canvas`):** `#F8F7F4` (Warm off-white archival paper)
* **Surface Card (`--bg-surface`):** `#FFFFFF` (Pure crisp white)
* **Subtle Surface (`--bg-subtle`):** `#F0EFEA` (Warm stone tinted gray)
* **Elevated Surface (`--bg-elevated`):** `#FFFFFF` with precise 1px micro-border
* **Dark Contrast Surface (`--bg-ink`):** `#14171C` (Deep archival ink black)
* **Dark Navy Foundation (`--bg-navy`):** `#111A2E` (Oxford deep navy for high-contrast anchors)

### Editorial Inks & Typography
* **Ink Primary (`--text-primary`):** `#17191D` (Deep carbon ink, high contrast 14:1)
* **Ink Secondary (`--text-secondary`):** `#4B5363` (Muted slate, 6.8:1 contrast)
* **Ink Tertiary (`--text-tertiary`):** `#767E8E` (Editorial caption slate)
* **Ink Dim / Hairline (`--text-dim`):** `#9DA5B4`
* **On-Dark Primary (`--text-on-dark`):** `#F8F9FA`
* **On-Dark Secondary (`--text-on-dark-muted`):** `#B5BFCD`

### Accent & Action
* **Editorial Cobalt (`--color-cobalt`):** `#2554D7` (Intelligent, trustworthy, sharp)
* **Cobalt Hover (`--color-cobalt-hover`):** `#1A43B8`
* **Cobalt Light Wash (`--color-cobalt-subtle`):** `rgba(37, 84, 215, 0.08)`
* **Cobalt Border (`--color-cobalt-border`):** `rgba(37, 84, 215, 0.25)`

### Semantic Status Colors
* **Verified / Accepted (`--color-success`):** `#107548` (Forest emerald, WCAG AA compliant)
* **Verified Subtle Wash (`--color-success-wash`):** `rgba(16, 117, 72, 0.08)`
* **Pending / Review (`--color-warning`):** `#B45309` (Warm amber ochre)
* **Pending Subtle Wash (`--color-warning-wash`):** `rgba(180, 83, 9, 0.08)`
* **Declined / Error (`--color-error`):** `#C53030` (Editorial crimson)
* **Declined Subtle Wash (`--color-error-wash`):** `rgba(197, 48, 48, 0.08)`

### Micro Borders & Dividers
* **Border Ultra-Light (`--border-hairline`):** `#E5E3DC`
* **Border Standard (`--border-standard`):** `#D8D5CB`
* **Border Strong (`--border-strong`):** `#B8B4A6`
* **Border Focus Ring (`--border-focus`):** `#2554D7`

---

## 3. Typography Architecture

* **Editorial Serif Display (`--font-display`):** `'Newsreader', 'Playfair Display', Georgia, serif`
  * Applied to: Hero main headlines, section editorial titles, quotes, signature numbers.
  * Weight: 500 / 600, tracking: `-0.02em`, line-height: `1.15`.
* **Interface Sans (`--font-sans`):** `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif`
  * Applied to: Navigation, body text, form controls, action buttons, table rows.
  * Weight: 400 (regular), 500 (medium), 600 (semibold).
* **Technical Monospace (`--font-mono`):** `'JetBrains Mono', SFMono-Regular, monospace`
  * Applied to: Salary ranges, experience tags, verification codes, match scores, system stamps.

---

## 4. Layout & Spacing Rules

* **Container Max-Width:** `1280px` standard, `1440px` wide-view split workspace.
* **Rhythm Scale:**
  * `--space-2xs`: `4px`
  * `--space-xs`: `8px`
  * `--space-sm`: `12px`
  * `--space-md`: `16px`
  * `--space-lg`: `24px`
  * `--space-xl`: `32px`
  * `--space-2xl`: `48px`
  * `--space-3xl`: `64px`
  * `--space-4xl`: `96px`
* **Corner Radii:**
  * `--radius-xs`: `4px` (micro tags)
  * `--radius-sm`: `6px` (buttons, inputs, status chips)
  * `--radius-md`: `10px` (cards, panels, modals)
  * `--radius-lg`: `16px` (featured surfaces, sheets)
  * `--radius-full`: `9999px` (circular avatars, pill filters)
* **Elevation & Shadows:**
  * No heavy muddy drop shadows.
  * `--shadow-sm`: `0 1px 2px rgba(23, 25, 29, 0.04), 0 1px 1px rgba(23, 25, 29, 0.02)`
  * `--shadow-md`: `0 4px 12px rgba(23, 25, 29, 0.06), 0 1px 3px rgba(23, 25, 29, 0.04)`
  * `--shadow-lg`: `0 12px 28px rgba(23, 25, 29, 0.08), 0 2px 6px rgba(23, 25, 29, 0.04)`

---

## 5. Signature 3D Experience: "ReferHire Network"

* **Concept:** Interactive spatial referral constellation connecting live Requisitions (Opportunities), Verified Referrers (Employees), and Candidate Skills.
* **Aesthetic:** Architectural line-wire and precision illuminated nodes suspended on a warm ink/off-white parchment canvas with restrained depth of field.
* **Technical Guidelines (Three.js):**
  * Segment counts: Low-poly clean spheres (16-24 segments), single shared geometry.
  * Renderer: Single WebGLRenderer instance, `alpha: true`, `devicePixelRatio` capped at `2`.
  * Interaction: Raycaster with Normalized Device Coordinates (NDC) updated once per RAF frame.
  * Accessibility: Reactive `prefers-reduced-motion` detection that disables camera orbital drifting.
  * Fallback: Pure semantic 2D interactive network directory cards when WebGL is absent or disabled.

---

## 6. Primary Workflows & Page Layout Patterns

1. **Landing Page:** Editorial asymmetrical hero with live connection stats, integrated role discovery search, signature 3D network visualization, transparent verification protocol, and compact curated listings.
2. **Discover Jobs:** High-productivity split-view or dual-pane scanner (Left: compact filterable job feed with transparent match %; Right: comprehensive opportunity breakdown with direct referral request launcher and skill gap analysis).
3. **Find Referrers:** Professional directory with verified company email badges, referral quotas, response time metrics, and direct request modal.
4. **Candidate Dashboard:** Action-oriented career headquarters prioritizing application pipeline, pending referral requests, saved bookmarks, and profile completion gauge.
5. **Referrer Dashboard:** Streamlined triage desk for incoming referral endorsements with one-click review, internal submission confirmation, and availability toggles.
6. **Career Intelligence:** Deterministic AI Copilot, resume-to-job match breakdown with keyword explainability, and referral outreach pitch composer.
