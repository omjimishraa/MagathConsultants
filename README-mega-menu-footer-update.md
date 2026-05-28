# Mega Menu, Footer, and Contact Location Update

## Summary
This update applies two changes across the site:

1. Desktop mega menu now uses viewport-constrained height with vertical scroll when content overflows.
2. Mobile menu open/active behavior remains unchanged; no auto-expand logic was added.

## Files Modified

### Navigation / Mega Menu
- `assets/scss/layout/header/_mega-menu.scss`
- `assets/css/main.css` (compiled from SCSS)
- `assets/js/erp-nav.js` (ARIA visibility sync only)

## Mega Menu Rules Applied
Desktop mega menu now includes:
- `max-height: calc(100vh - var(--header-height, 120px));`
- `overflow-y: auto;`
- `overflow-x: hidden;`
- `scrollbar-gutter: stable;`
- cross-browser scrollbar styling:
  - `scrollbar-width` / `scrollbar-color`
  - `::-webkit-scrollbar` track/thumb rules
- `:focus-within` handling to keep keyboard navigation scrollable inside the menu

## Accessibility / Behavior Notes
- `erp-nav.js` now synchronizes `aria-hidden` on the desktop mega menu panel with existing open/close lifecycle.
- Existing `aria-expanded` logic remains intact.
- No mobile submenu auto-open code was introduced.
- Existing menu highlight/expand behavior is preserved.

## Test Checklist

1. Desktop mega menu overflow
- Open Services mega menu on desktop.
- Verify menu scroll appears when content exceeds viewport height.
- Verify no horizontal scrollbar.

2. Keyboard accessibility
- Tab into Services mega menu.
- Verify focus can move through links and panel remains scrollable.
- Verify Escape still closes expanded state behavior as before.

3. Mobile behavior regression
- Open mobile menu.
- Verify submenu sections do not auto-expand unexpectedly.
- Verify active/highlight behavior matches prior behavior.

4. Visual integrity
- Confirm no route/URL changes.
- Confirm spacing and layout remain consistent with existing design.
