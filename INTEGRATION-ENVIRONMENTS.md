# Ivona Wayside Clinic — API and integration environment contract

## Application-wide mode

Set `IWC_INTEGRATION_ENVIRONMENT` on the server process to exactly one of `development`, `uat`, or `production`. It is deployment configuration, not a request parameter or user-selectable page control. Restart PHP workers and clear Laravel's cached configuration after changing it.

- **Development:** deterministic local fixtures; no external provider call is made by the shared integration gateway. Fixtures include eligibility, service verification, claims submission/status, and facility lookup outcomes.
- **UAT:** uses the saved UAT endpoint and issued UAT credentials. Network, authentication, TLS, and provider errors remain errors; the service never silently falls back to mock data.
- **Production:** uses the saved Production endpoint and issued production credentials. TLS verification is mandatory. The authority's approval/go-live process must be completed before activating the live connection.

The Developer Tools page stores separate Development/UAT/Production settings for every integration. The application-wide environment selects which record the shared gateway uses. Inbound API keys are also environment-bound; a Development key cannot be used against UAT or Production. Live HTTPS destinations must also match `IWC_INTEGRATION_ALLOWED_HOSTS` (comma-separated exact hostnames or approved subdomains); add any authority-issued custom host explicitly before enabling it. Private/reserved IP destinations and redirects remain blocked.

## Official references

- AfyaConnect developer onboarding and sandbox credentials: https://afyaconnect.dha.go.ke/get-started
- DHA HIE go-live path (Development, mandatory UAT, DHA certification, production credentials): https://hie-docs.dha.go.ke/docs/goLive
- AfyaConnect eClaims API guide: https://afyaconnect.dha.go.ke/docs/eclaims/getting-started/introduction
- AfyaConnect published eClaims eligibility endpoints and UAT base URL: https://afyaconnect.dha.go.ke/hie-api/eclaims/eligibility
- AfyaLink Basic → JWT authentication: https://afyalink.dha.go.ke/apidocs/authentication
- AfyaLink signed JWT and encrypted payload guidance: https://afyalink.dha.go.ke/api-authentication-encryption
- SHA EDI Development: https://edi-api.provider-dev.sha.go.ke/
- SHA EDI UAT: https://edi-api.provider-uat.sha.go.ke/
- SHA EDI Production: https://api-edi.provider.sha.go.ke/

The SHA EDI landing pages provide these environment URLs, but they do not expose the complete authentication contract or operation schemas on the landing page. The profile is therefore preconfigured with the URLs but remains disabled until the applicable official credentials and API contract are configured. Client Registry lookup uses the separate `dha-afyalink` profile and the documented `GET /v3/client-registry/fetch-client` route; the assigned AfyaLink host, agent ID, and account credentials must be entered for each environment. The host is intentionally not guessed from a documentation portal URL.

The AfyaConnect eClaims catalogue publishes the UAT base URL `https://ilm-dev.dha.go.ke/uat-middleware/api/v1` and GET paths for eligibility, benefits, benefit interventions/utilization, POMSF balances, sub-benefits, and facility bed occupancy. These are prefilled in the DHA HIE UAT profile. The token endpoint and credentials remain unset because the authority issues them during onboarding. The production API base URL is not guessed: enter the exact one issued for the approved production API product.

AfyaConnect documents OAuth 2.0 client credentials and FHIR-aligned APIs. AfyaLink documents two supported token approaches: (1) Basic authentication to `{base_url}/v1/hie-auth?key={consumer_key}`, returning a JWT; or (2) a signed HS256 JWT with `key`, `iat`, and short `exp` claims. The gateway supports both. AfyaLink's documented encrypted envelope uses AES-256-CBC for payload data, RSA-OAEP for the AES key and IV, and a Base64 envelope. Mark only the operations whose official API specification requires encryption; configure the correct public/private keys per environment.

## Shared gateway contract

HMIS modules must call `App\\Services\\Integrations\\EnvironmentAwareIntegrationService::request($integrationSlug, $operation, $method, $path, $payload, $headers)`. Do not create ad-hoc provider HTTP calls inside clinical, billing, or claims controllers. Published operation names in the HIE UAT map include `eligibility.check`, `patient.benefits`, `patient.benefits.interventions`, `patient.benefits.utilization`, `patient.pomsf_balances`, `patient.sub_benefits`, and `facility.bed_occupancy`.

The shared gateway applies the selected environment's base URL, authentication, facility headers, optional AfyaLink encryption, timeouts, HTTPS/TLS verification, and endpoint map. It returns the actual provider status and body to the calling server-side workflow. Diagnostic logs retain status, duration, operation, and safe messages only—not patient payloads, credentials, tokens, private keys, or provider response bodies. The console response viewer is intended only for explicitly configured non-patient health endpoints.

The gateway does not automatically retry write operations. Claims and other writes must use stable transaction references/idempotency controls defined by the exact provider contract before retries are added. Clinical workflows must also map local patient/facility identifiers to official Client Registry and Facility Registry identifiers and validate request/response schemas against the authority's API catalogue.

This patch creates the shared environment and integration layer and configures published UAT endpoints. It does not claim DHA certification or a completed production go-live. Provider-issued production base URLs, credentials, facility identifiers, API-product scopes, and approved workflow schemas must be entered from the authority portal; the patch deliberately does not fabricate them.


## SHA patient journey operations

The patient wizard uses `patient.lookup_by_identifier` on the dedicated `dha-afyalink` profile for Client Registry, `patient.benefits` on the DHA HIE/AfyaConnect profile for the configured benefits catalogue, and `preauthorization.check` for the preauthorization workflow. The benefits route is taken from the existing published UAT endpoint map. Preauthorization request path and schema must be configured from the hospital's current authority-issued Postman collection before live use. Do not copy synthetic `DEV-BEN-*` codes into UAT or production. Development benefits are visibly synthetic UI scenarios only. Unknown or unavailable live preauthorization results are not treated as approval.
