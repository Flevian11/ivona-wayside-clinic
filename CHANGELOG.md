# Ivona Wayside Clinic HMIS — Changelog

This file records project-level changes and verification boundaries. The in-app **What's New** page is populated from published `system_releases` records.

## 0.1.0 — Platform Foundation

### Added
- Laravel/PHP application foundation with Inertia.js, React, TypeScript/TSX and Vite.
- PostgreSQL-oriented schema and initial patient, encounter and invoice workflows.
- Initial role/permission infrastructure for server-side authorization.
- Facility administration and public-facing clinic information routes.
- Public page entry points for home, about, services, blog, careers, contact, terms, privacy and data-protection information.
- Versioned release notes with categorized features, improvements, bug fixes, security notes and known issues.
- Integration boundaries that keep development simulation distinct from live external services.
- Independent facility logo and favicon upload controls in the branding update line.

### Improvements
- Facility branding can be managed through image uploads rather than requiring externally hosted logo/icon URLs.
- Logo and favicon are saved independently from general facility details.
- Release notes are published from structured records and ordered by semantic version.

### Security and operational notes
- Production secrets must be configured outside source control.
- Development fixtures must be synthetic.
- Live SHA/DHA behavior must use verified current contracts and authorized credentials; mock responses are not production success.
- This release note does not assert DHA accreditation, SHA production approval, or complete clinical readiness.

### Verification status
This changelog describes the source baseline and documented implementation intent. It does not claim that migrations, all automated tests, or live integrations have been executed successfully in every deployment environment. Verify the delivered code against PostgreSQL and the actual deployment environment before production use.
