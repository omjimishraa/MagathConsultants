# CRM & ERP Solutions Subpages Integration

## New Pages
- service/salesforce.html
- service/shopify.html
- service/business-central.html

## New CSS
- assets/css/erp-salesforce.css
- assets/css/erp-shopify.css
- assets/css/erp-business.css

## New JS
- assets/js/erp-nav.js

## New Image Assets
Folder: assets/images/services/erp/

Included formats and sizes:
- PNG + WebP
- Base and retina (@2x)
- Hero mockups (1600x700 + @2x)
- Section illustrations (1200x600 + @2x)
- Thumbnails (600x400 + @2x)

## Integration Steps
1. Deploy the new HTML files under the existing service/ directory.
2. Deploy the new CSS and JS files under assets/css and assets/js.
3. Deploy image files under assets/images/services/erp/.
4. Confirm each new page keeps base href="../" (already set).
5. Ensure server rewrites map these public URLs to the new files:
   - /services/erp-development/salesforce -> /service/salesforce.html
   - /services/erp-development/shopify -> /service/shopify.html
   - /services/erp-development/business-central -> /service/business-central.html
6. If using Apache/Nginx, add rewrite rules at server level (routing is not implemented in client JS).

## Navigation Behavior
- Existing ERP links were already present in desktop mega menu and mobile submenu.
- assets/js/erp-nav.js now enhances ERP menu entries with icon + one-line description.
- Active state is applied for:
  - Current page link (aria-current="page")
  - CRM & ERP Solutions parent item
  - Services parent item
- Mobile submenu auto-expands to show active ERP page.

## Analytics Tracking Attributes
Added on ERP CTAs/forms via data attributes:
- data-ga-category
- data-ga-action

## Forms and Validation
- All new CTA forms use action="send-contact.php" and method="POST".
- Client-side HTML validation is enabled via required fields.
- Additional validation state styling is applied with .erp-form-invalid from the ERP CSS files.
- No backend endpoint changes were made.

## New Classes and Components
All custom classes are prefixed with erp-.

Shared/navigation classes:
- erp-page
- erp-menu-link
- erp-menu-icon
- erp-menu-copy
- erp-is-active
- erp-is-parent-active
- erp-form-invalid

Page-specific classes:
- Salesforce: erp-salesforce-hero, erp-salesforce-stats, erp-stats-card, erp-services-grid, erp-service-card, erp-partner-panel, erp-partner-logo, erp-media-card, erp-caption, erp-footer-cta
- Shopify: erp-shopify-hero, erp-shopify-blocks, erp-shopify-block, erp-features-grid, erp-feature-card, erp-feature-media, erp-case-teaser, erp-footer-cta
- Business Central: erp-business-hero, erp-business-services, erp-business-card, erp-module-chart, erp-business-visuals, erp-business-media, erp-caption, erp-footer-cta

## Accessibility Notes
- Semantic sections and heading hierarchy (single H1 per page).
- Breadcrumb uses explicit nav labeling.
- Active links include aria-current for keyboard/screen-reader context.
- Forms are keyboard navigable and validation-friendly.
- Color choices in new sections are high contrast against backgrounds.

## SEO and Structured Data
Each page includes:
- Unique title
- Unique meta description
- Canonical URL
- Open Graph: og:title, og:description, og:image
- twitter:card
- JSON-LD for Organization + Service

## Test Checklist
- [ ] Breadcrumb path is exactly Home > Services > CRM & ERP Solutions > Current Page
- [ ] Desktop mega menu shows ERP entries with icon + short description
- [ ] Mobile menu ERP submenu expands and each item is tappable
- [ ] Active menu highlighting works for ERP child + ERP parent + Services parent
- [ ] URLs route correctly through server rewrites
- [ ] CTA buttons include data-ga-category and data-ga-action
- [ ] Form submission fields validate client-side
- [ ] Non-critical images use loading="lazy"
- [ ] Layout verified at 320, 375, 414, 768, 1024, 1366 widths
- [ ] Keyboard navigation is functional across nav, CTAs, and forms
- [ ] Lighthouse target >= 80 for performance/SEO/accessibility (post-deploy)
- [ ] JSON-LD validates in Rich Results Test

## Demo Checklist
1. Open each page on desktop and verify hero, services, and CTA sections.
2. Hover Services in desktop header and verify ERP links are decorated and clickable.
3. Open mobile menu and verify ERP submenu expands with active state.
4. Submit each page's ERP mini-form with invalid and valid inputs.
5. Confirm contact area and global footer remain unchanged.

## Screenshot Checklist (Desktop + Mobile)
Capture these during QA:
- Desktop: hero + breadcrumb for each page.
- Desktop: Services mega menu with ERP entries shown.
- Mobile: ERP submenu expanded and active item highlighted.
- Mobile: each page CTA/form section visible.
