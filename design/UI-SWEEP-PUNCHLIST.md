All 7 shots captured. Now verify file sizes and dimensions:All 7 files exist and are non-zero. Now read all images for the design review:**Screenshot inventory confirmed:**
- `sweep-home.png` — 1440×900, 289KB ✓
- `sweep-home-2.png` — 1440×900, 418KB ✓
- `sweep-myrecipes.png` — 1440×900, 74KB ✓
- `sweep-recipe.png` — 1440×900, 146KB ✓
- `sweep-recipe-2.png` — 1440×900, 120KB ✓
- `sweep-profile.png` — 1440×900, 68KB ✓
- `sweep-home-mobile.png` — 390×844, 71KB ✓

---

## Prioritised UI Punch-List

### 🔴 High — Broken / Embarrassing

**H1 · Profile page · Raw JSON dump instead of a UI**
`/profile` renders the API response object as plain text on a white page. There is zero UI — no avatar, no name, no edit form, nothing. This is the single most broken page in the app; it needs a real profile component before it can be shipped.

**H2 · Home & My Recipes · Recipe cards with no image show a huge grey void**
The vast majority of cards (easily 80%+ of the grid) have no photo — just a large flat `#e5e5e5` rectangle taking up ~60% of the card. This is the dominant visual impression of the app and it looks unfinished. Needs a styled placeholder: a food-themed illustration, a gradient with the recipe initials, or a subtle pattern — anything that communicates "image not yet added" rather than "this is broken."

**H3 · Home · Two cards render a screenshot of the create/edit recipe form as their thumbnail**
The recipe image is literally a screenshot of the form UI (visible fields, labels, checkboxes). These are test records but the card rendering doesn't guard against non-food images at all — more importantly, the fact that they show up in the public "Discover recipes" grid unmuted/unfiltered is a UX/trust issue.

**H4 · Home / My Recipes · "± 205389.13 hrs · 1 ingredients" data quality leaks into cards**
One card in the scrolled home view shows "± 205389.13 hrs" as the cooking time. Bad data shouldn't surface verbatim — add a sanity cap/display guard (e.g. if > 24hrs show "Long cook" or just hide it). "1 ingredients" should also be "1 ingredient" (singular).

**H5 · Mobile · "Label: All" badge appears below the label carousel as floating unstyled text-in-box**
On 390px there's a standalone `Label: All` chip rendered below the carousel that looks orphaned and unrelated to anything. Either remove it or integrate it into the carousel as the selected-state indicator.

---

### 🟡 Medium — Noticeably Substandard

**M1 · Home · Label carousel cards are too tall with no content**
The label filter chips are full card-height rectangles (~160px) with the label text bottom-aligned. Without an image they're just grey blocks. Should be compact horizontal pill/chip tabs (32–40px tall) — standard filter tab pattern. The current treatment wastes vertical space and looks undesigned.

**M2 · My Recipes · "Welcome" page title is inert and unhelpful**
The heading is just "Welcome" — no context. Compare to Home's "Discover recipes / Browse by label…" pattern. Should be something like "My Recipes" + a subtitle ("Recipes you've created"), and the create button should be solid/filled (it's currently outlined/ghost on this page, while Home uses a solid green — inconsistent).

**M3 · My Recipes · Recipe cards sit inside a large white container card with heavy padding**
The 2-card grid is wrapped in a white rounded-corner box that floats on the grey page background. Home cards sit directly on the grey background without a wrapper. The container approach on My Recipes wastes space, creates inconsistency, and makes a sparse page look even emptier.

**M4 · Recipe Detail · Two-column Info/Cooking Times layout has orphaned whitespace**
Right column ("Cooking times: Prep 10 mins / Cook 12 mins") is near-empty relative to the left column. These 4 fields should sit together in one compact row or use a pill/badge treatment rather than a half-page 2-column split with huge empty right-side space.

**M5 · Recipe Detail · "± 10 mins" / "± 12 mins" — the ± prefix is jarring prose**
Every time/ingredient count uses "±" as a literal prefix. On the detail page it reads like an engineering tolerance ("Preparation Time (±) 10 mins"). Replace with "~" or just omit the qualifier, or use a tilde-prefixed helper text beneath the number.

**M6 · Recipe Detail · Vegan/Vegetarian rendered as ✕ / ✓ emoji inline with grey label text**
"Vegan: ✕" and "Vegetarian: ✓" use browser-default cross/check characters in grey/red/green. These should be proper status badges or icon+label pairs with intentional colour (e.g. a small green pill "Vegetarian" / muted "Not Vegan").

**M7 · Recipe Detail · Ingredients section uses a generic green tin/jar icon for every ingredient**
All 8 ingredients share the same cartoon tin-can outline icon regardless of what the ingredient is. This is generic to the point of being noise. Either remove the icon (clean text list), use ingredient-category icons, or replace with a simple bullet/number.

**M8 · Recipe Detail · "How to cook" steps use a 2-column zigzag layout**
Steps 1–4 are arranged in a 2×2 grid (1 left, 2 right, 3 left, 4 right). Users expect numbered steps to read top-to-bottom in a single column. The zigzag requires eye-tracking gymnastics. Switch to a clean vertical numbered list.

**M9 · Recipe Detail · "Additional Information" section feels like a database dump**
Nutrition Facts are rendered as plain "- Calories: 400kcal" bullet strings in grey text. Labels are just "- Italian / - Pasta". These are the richest data on the page and deserve real visual treatment: a nutrition facts table, coloured label pills, and a portion badge.

**M10 · Nav · Search bar is the dominant visual element in the header**
The search input spans roughly 1/3 of the header width at centre, drawing the eye away from the logo/nav. It should be max-w-xs (≈280px) or tucked into a compact icon-to-expand pattern so the nav hierarchy reads correctly: logo → nav links → [search] → avatar.

---

### 🟢 Low — Polish

**L1 · All pages · Global floating Airpods-globe emoji button (bottom-right)**
A colourful round globe/emoji button is fixed in the bottom-right corner of every page. It appears to be a dev/debug widget or a third-party tool badge. It shouldn't be visible in a product build.

**L2 · Nav · Active nav item uses underline only, no weight difference**
"Home" gets a bottom underline when active but stays the same weight as "My Recipes". Use `font-semibold` or a colour change on the active item so the hierarchy is clearer; an underline alone is a very subtle signal.

**L3 · Home · "Discover recipes" heading has no vertical breathing room above it**
The heading starts ~80px from the nav bar bottom with very tight top padding. Add ~32px more top margin to give the page a proper entry point — it currently feels like it starts too abruptly.

**L4 · Recipe Detail · Left image column has a white card wrapper, rest of page is grey**
The hero image area sits in a white rounded card on the grey background, but the recipe info to the right has its own white card. The two white cards are at different heights and the left one is mostly empty (grey image placeholder). The whole detail layout needs a rethink once images are loaded, but the left card should at minimum match height or be removed as a wrapper.

**L5 · Recipe Detail · "by Emma Davis" author byline is the same weight as the recipe title**
"Pesto Pasta **by Emma Davis**" — the author reads as part of the title rather than secondary metadata. Should be smaller, lighter text (e.g. `text-sm text-gray-400`) separate from the `h1`.

**L6 · My Recipes · Empty-state below 2 cards is just blank grey page**
Nothing encourages further action when there are only 2 recipes. A subtle empty-state illustration or "Add your next recipe →" CTA in the blank area would significantly improve the feel.

[OPTIONS: Fix H1 Profile page UI now | Fix H2+M1 card placeholders and label carousel | Fix M8+M9 recipe detail layout and steps | Fix all High issues in one pass]