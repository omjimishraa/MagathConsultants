# ERP Navigation and Page Consistency Update

## Scope

This update standardizes ERP service navigation entries and ERP page presentation for:

- `service/salesforce.html`
- `service/shopify.html`
- `service/business-central.html`

It also applies a site-wide enhancement for service menu labeling with icon and subtext, while preserving existing mobile expand/collapse behavior and existing URLs.

## What Changed

### 1) Global Navigation Enhancement

- Updated `assets/js/erp-nav.js` to decorate existing service links with metadata (icon + subtext), ARIA semantics, and menu analytics hooks.
- Ensured behavior is non-invasive:
	- No forced submenu open state.
	- No forced active/open classes on mobile menu containers.
	- Existing `mobilemenu.js` interactions remain authoritative.
- Added global asset injection in `assets/js/main.js`:
	- Injects `assets/css/erp-nav.css` once.
	- Injects `assets/js/erp-nav.js` once.
	- Uses guards (`window.__erpNavAssetsInjected`, `window.__erpNavInitialized`) to prevent duplicate setup.

### 2) Shared ERP Page Styling

- Introduced shared styles used by all three ERP pages:
	- `assets/css/erp-nav.css`
	- `assets/css/erp-pages.css`
- ERP pages now include these shared styles and no longer rely on page-specific ERP CSS files.

### 3) Image Set Upgrade

- Replaced placeholder ERP PNG/WebP references with the new realistic image set (JPG/WebP + @2x).
- Updated alt text and captions to match new visuals.
- Removed old generated placeholder image files and temporary test assets.

### 4) Business Central Page Parity

- Added a dedicated ERP CTA/form section on `service/business-central.html` for consistency with Salesforce and Shopify pages.
- Normalized CTA analytics attributes to include category, action, and label where applicable.

## URL and Route Safety

- No route/URL structure changes were introduced.
- Menu links remain file-based where already used (`service/*.html`) and canonical/structured-data URLs remain unchanged.

## Accessibility Notes

`assets/js/erp-nav.js` now applies:

- Menu/list semantics for mega menu and mobile submenu groups.
- `aria-current="page"` on exact current page service links.
- Improved keyboard/focus support via `assets/css/erp-nav.css` focus-visible treatment.
- Mobile ARIA state sync without changing expand/collapse behavior.

## Deployment Steps

1. Deploy updated files:
	 - `assets/js/main.js`
	 - `assets/js/erp-nav.js`
	 - `assets/css/erp-nav.css`
	 - `assets/css/erp-pages.css`
	 - `service/salesforce.html`
	 - `service/shopify.html`
	 - `service/business-central.html`
2. Deploy new ERP image assets under `assets/images/services/erp/`.
3. Ensure removed old image filenames are not referenced in caches or CDN manifests.
4. Purge CDN cache for:
	 - `assets/js/main.js`
	 - `assets/js/erp-nav.js`
	 - `assets/css/erp-nav.css`
	 - `assets/css/erp-pages.css`
	 - ERP service page URLs

## QA Checklist

### Navigation

- Desktop mega menu service entries show icon + subtext consistently.
- Mobile submenu service entries show icon + subtext consistently.
- Mobile menu does not auto-expand on page load.
- Existing tap-to-expand behavior remains unchanged.
- Current ERP page link receives `aria-current="page"` only on matching page.

### ERP Pages

- Salesforce, Shopify, and Business Central load shared ERP CSS correctly.
- Hero and supporting images load new JPG/WebP variants with @2x fallbacks.
- No broken image URLs in network panel.
- CTA buttons and forms include analytics data attributes.

### Accessibility and SEO

- Keyboard tab order remains usable in header/nav and ERP forms.
- Landmark and breadcrumb structure remains valid.
- Canonical tags and schema URLs stay intact.

## Acceptance Criteria

- Service navigation entries are visually consistent across desktop and mobile menus.
- No regression in mobile menu expand/highlight interactions.
- ERP page visual language is aligned across Salesforce, Shopify, and Business Central.
- Only new ERP image set is referenced by these pages.
- All touched files pass editor diagnostics.

## Rollback Plan

If rollback is required:

1. Revert `assets/js/main.js` to remove global ERP asset injection block.
2. Revert `assets/js/erp-nav.js` to previous implementation.
3. Remove `assets/css/erp-nav.css` and `assets/css/erp-pages.css` references from ERP pages.
4. Restore old ERP image assets and page image references.
5. Purge CDN cache for reverted JS/CSS/HTML.

## Demo and Screenshot Checklist

Capture and attach screenshots for each page (`salesforce`, `shopify`, `business-central`):

- Desktop:
	- Header mega menu open state with ERP entries visible.
	- Hero section and first supporting image block.
	- Footer CTA/form section.
- Mobile (responsive viewport):
	- Collapsed menu state.
	- Expanded services submenu state.
	- ERP page hero and CTA visibility.

Use this checklist as release proof in QA sign-off notes.
