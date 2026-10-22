Ivona Wayside Clinic — Profile, Settings and Passkey UI patch

Files included (relative to project root):
- resources/js/layouts/settings/layout.tsx
- resources/js/pages/settings/profile.tsx
- resources/js/pages/settings/security.tsx
- resources/js/components/manage-passkeys.tsx
- resources/js/components/passkey-item.tsx
- resources/js/components/passkey-register.tsx

Changes:
- Responsive account settings navigation and clearer settings page hierarchy.
- Improved profile form, account summary, email-verification state and save feedback.
- Improved security/password form layout while preserving the existing endpoints and two-factor flow.
- Passkey registration no longer asks the user to type a name. It infers a useful label from available browser/platform information and uses a privacy-respecting fallback.
- Improved passkey list, saved count, empty state, registration status, and removal confirmation.

Important limitation:
Browsers do not consistently expose the exact hardware model or authenticator name. Labels are inferred from browser/platform information and must not be treated as verified physical device identity.

Apply from the project root. Back up the six target files first. This patch does not modify .env, database configuration, migrations, or production database records.
