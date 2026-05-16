# Hydroclawnics Frontend Design Revamp — Codex Prompt

## Context
You are redesigning the Hydroclawnics dashboard frontend to be production-grade, modern, and calm. The current version works functionally but needs a complete visual overhaul. The design direction is inspired by: Canopy + Almond + Rekindle app aesthetics, Claude brand language, and Gruvbox color theory.

**Reference images:** Canopy (minimalist botanical), Almond/Rekindle (warm, approachable sans-serif typography, soft gradients, high contrast text on muted backgrounds). Claude serif is a good font.
Use ./media/ for reference in images, and use lettuce.png/ico as the favicon/icon of the app. 

## Design System — Foundation

### Color Palette
Do NOT use bright neons or saturated greens. Use Gruvbox-inspired + Claude warmth:

**Neutrals (Foundation):**
- Background: `#0f1419` (near-black, slightly warm)
- Surface primary: `#1a1f2e` (dark slate)
- Surface secondary: `#252d3d` (slightly lighter slate)
- Text primary: `#f5f1de` (warm cream/off-white)
- Text secondary: `#a8a49e` (muted gray)
- Border: `#3d4451` (subtle dark gray)

**Semantic Colors (Calm, not vibrant):**
- Success/Healthy: `#7fb069` (muted sage green, not lime)
- Warning: `#d4a373` (warm sandy amber, not orange)
- Critical: `#c9566b` (dusty rose, not bright red)
- Info/Primary: `#6fa3d8` (soft blue, like Claude brand)
- Neutral: `#6a6a6a` (gray)

**Accent (Subtle):**
- Hover: `rgba(127, 176, 105, 0.1)` (sage green at 10% opacity)
- Focus: `#6fa3d8` (soft blue outline)

### Typography
- **Heading 1** (Navbar): 24px, 600 weight, tracking -0.5px, color: `#f5f1de`
- **Heading 2** (Card titles): 16px, 600 weight, color: `#f5f1de`
- **Body text**: 14px, 400 weight, color: `#a8a49e` (muted until you want to emphasize)
- **Data numbers**: 18px, 700 weight, monospace, color: `#f5f1de` (high contrast for readability)
- **Font stack**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

### Spacing & Layout
- Use 8px grid (4, 8, 12, 16, 20, 24, 32px gaps)
- Padding on cards: 20px
- Border radius: 8px (no extreme rounding)
- No shadows — use borders instead. A border of `1px #3d4451` on cards is better than drop shadows.
- Gap between elements: 16px (standard)

## Component Redesign — Specific Changes

### 1. Navbar
**Current:** Green border, simple flex layout
**New:**
- Background: `#0f1419` (same as page bg — navbar is subtle)
- Left side: Logo + "Hydroclawnics 🌱" (22px bold)
- Center: Empty (breathing room)
- Right side: Three items in a row, spaced 20px apart:
  - Connection status: Animated dot (green = connected, yellow = connecting, red = disconnected) + text "Connected" in 12px gray
  - Pod summary: "17 Healthy | 3 Warning | 0 Critical" in 12px gray
  - Settings gear icon (not implemented yet, just a placeholder)
- Bottom border: 1px solid `#3d4451` (subtle separator)
- Height: 60px

### 2. PhysicalPot Panel
**Current:** Three Plotly gauge charts (blocky, overly technical)
**New:**
- Card with 1px border `#3d4451`, background `#1a1f2e`, padding 20px
- Title: "Pot Alpha (Physical)" in 14px gray, slightly reduced weight
- Status badge: Top right corner, small pill shape with background color matching status (`#7fb069` bg with `#0f1419` text for healthy). Text: "HEALTHY"
- Three stat rows (vertical, not side-by-side):
  ```
  pH           6.5     [range 6.0-7.0 ✓]
  EC           0.9 ppm [range 0.8-1.2 ✓]
  Temp         19°C    [range 18-24 ✓]
  ```
  - Left column: label (14px gray)
  - Center column: large number (20px bold monospace, white)
  - Right column: range in parentheses (12px gray) with a small green checkmark or orange/red X
  - Use a minimal bar underneath each metric showing value position within range (like a progress bar, height 3px, border-radius 1.5px)
- Last action: "No physical intervention logged yet" in 12px italic gray at bottom
- No Plotly charts. Simple, readable, practical.

### 3. Pod Grid
**Current:** 4-column grid of cards with green borders and status badges
**New:**
- Keep 4-column grid responsive (3 columns on tablet, 1 on mobile)
- Each card:
  - Background: `#1a1f2e`, border: 1px `#3d4451`
  - Padding: 16px
  - Radius: 8px
  - Header row: 
    - Left: Pod ID + crop emoji/name (14px bold, white)
    - Right: Status badge (pill, 12px bold uppercase, colored background with contrasting text)
  - Body:
    ```
    pH     6.46 
    EC     902 ppm
    Temp   20.1°C
    Age    23h 14m
    ```
    - Two columns, label + value
    - Labels: 12px gray
    - Values: 14px monospace, white
    - No sparklines inline. Use hover state to reveal them.
  - Hover state: 
    - Background shifts to `#252d3d` (slightly lighter)
    - Cursor becomes pointer
    - On click, opens modal (see below)
  - No background tint — let color come from the status badge only

- Tab switcher between "2D Grid" and "3D Farm" above the grid. Simple toggle buttons with underline indicator.

### 4. Tab Switcher (2D / 3D)
- Two buttons: "2D Grid" and "3D Farm"
- Inactive button: text `#a8a49e`, background transparent
- Active button: text `#f5f1de`, border-bottom 2px `#6fa3d8`, background transparent
- No filled backgrounds. Very minimal.

### 5. Pod Detail Modal (On Card Click)
**New component:**
- Overlay with semi-transparent dark background `rgba(0, 0, 0, 0.7)`
- Modal container: `#1a1f2e` background, 1px border `#3d4451`, 32px padding
- Width: 600px max, centered
- Header: Pod ID + crop name, status badge, close button (X, top right)
- Content:
  - Full sensor readings (pH, EC, Temp, Light, DO) in a 2-column layout
  - Two sparkline charts: pH history (line chart, green stroke, transparent fill) and EC history (orange stroke)
  - Last agent action text: "Agent dosed pH up (0.3) at 10:23 PM" in 12px gray
- Close on Escape key or outside click

### 6. Sparkline Charts (Inside Modal Only)
- Use Recharts
- Chart container: 100% width, 120px height
- Stroke color: `#7fb069` for pH, `#d4a373` for EC
- Stroke width: 2px
- Fill: transparent
- No axes, no labels, just the curve
- Grid behind it: very faint `rgba(127, 176, 105, 0.05)`

### 7. Farm3D (3D Tab)
- Full height, same background as page
- Canvas fills the container
- Scene lighting: soft white directional light from top-left, subtle ambient
- No harsh shadows
- Pods: gray cylinders + colored spheres (same colors as status badges)
- On pod click in 3D: camera pans to focus on that pod, then opens detail modal
- Scene auto-rotates slowly when idle

### 8. Agent Reasoning Feed (Right Column)
**Current:** Scrolling feed with entries
**New:**
- Card: `#1a1f2e` background, 1px border `#3d4451`
- Title: "Agent Reasoning Feed" (14px gray) at top
- Scrollable content area (max-height with scroll)
- Each entry (newest first):
  - Timestamp: 12px gray, `10:29 PM`
  - Pod badge: small pill with pod ID, gray background
  - Diagnosis: 13px, `#f5f1de`, bold
  - Action: monospace, 12px, colored by action type:
    - `dose_ph_up` / `dose_ph_down`: blue `#6fa3d8`
    - `nutrient`: amber `#d4a373`
    - `heat_adjust`: rose `#c9566b`
    - `alert`: gray `#6a6a6a`
  - Reasoning: 12px gray, max 150 chars with expand toggle ("...more" link in blue)
  - Separator line: 1px `#3d4451` between entries
  - No colored left borders. Keep it minimal.
  - Typewriter animation on newest entry ONLY: text streams in over 1.5s
- Empty state: "Waiting for agent decisions..." (12px gray, centered, italic)

### 9. Layout Structure (Overall)
- Page background: `#0f1419`
- Navbar: top, full width, 60px
- Main content: two columns below navbar
  - Left (60%): PhysicalPot panel + Tab switcher + PodGrid/Farm3D
  - Right (40%): Agent Reasoning Feed (sticky, full height)
  - Gutter between columns: 16px
- Responsive: On mobile, stack columns vertically (feed below grid)

## Visual Tone
- **Calm:** No vibrant colors, no heavy shadows, no neon
- **Readable:** High contrast text on dark backgrounds
- **Practical:** No decorative elements, every pixel serves a function
- **Botanical theme:** Sage greens and warm earth tones (but muted)
- **Inspired by:** Almond (warm sans-serif, soft palette), Canopy (minimalist), Claude (blue accents, refined)

## Implementation Notes
- Use CSS custom properties for all colors — define them at `:root` level
- Use Tailwind if you want, but override the default color palette entirely with custom CSS variables
- No animations except: hover state changes (smooth 200ms transition), typewriter effect on newest log entry, subtle pulse on connection status dot
- Use SVG for icons (settings, close, checkmark, etc.) — keep them minimal and 24x24px
- No third-party icon libraries — inline simple SVGs or use Unicode symbols

## Files to Modify / Create
1. `App.jsx` — overall layout structure
2. `Navbar.jsx` — NEW, replaces inline navbar in App.jsx
3. `PhysicalPot.jsx` — complete visual redesign, drop Plotly
4. `PodGrid.jsx` — card styling overhaul
5. `PodDetailModal.jsx` — NEW modal component
6. `AgentLog.jsx` — redesign feed, add typewriter
7. `Farm3D.jsx` — keep logic, adjust scene lighting/style
8. `globals.css` — color palette CSS variables, typography, resets
9. `tabSwitcher.jsx` — NEW minimal tab toggle component

## Success Criteria
- Dashboard feels like a production tool, not a hackathon prototype
- Colors are calm and readable (no eye strain in dim room)
- Every UI element serves a clear function
- Almond + Canopy aesthetic is visible in card layouts and typography
- No bright greens, no heavy shadows, no unnecessary depth
- Agent log is the primary focus (right column), second to the pod data (left)

Go through every file. Do NOT skip any visual element. Make this look intentional and polished.