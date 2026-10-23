# ivona-wayside-clinic
Modular hospital HMIS with PostgreSQL, Laravel, TypeScript, and DHA/HIE integration


## Release notes / changelog

The in-app **What's New** page is backed by published `system_releases` records. To install or refresh the initial detailed release entry on a development database, run:

```powershell
php artisan db:seed --class=SystemReleaseNotesSeeder
```

The seeder is idempotent for release `0.1.0`. Review `CHANGELOG.md` for the project-level record. The release notes explicitly distinguish implemented foundations from unverified or incomplete production workflows.
