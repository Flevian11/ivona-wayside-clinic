# ivona-wayside-clinic
Modular hospital HMIS with PostgreSQL, Laravel, TypeScript, and DHA/HIE integration

## Facility branding uploads

The Administration → Facility settings page accepts direct image uploads for the clinic logo and browser favicon; it no longer asks for external logo/icon URLs. Accepted formats are PNG, JPEG, and WebP. Logos are limited to 4 MB; favicon images must be square and are limited to 2 MB. Files are stored on Laravel's configured `public` disk under `storage/app/public/site/branding` and referenced through `/storage/...` URLs.

After configuring the application, ensure the public storage link exists:

```powershell
php artisan storage:link
```

If the link already exists, do not recreate it. For production, ensure the web server can serve `public/storage` and enforce the deployment's normal file permissions. Uploaded branding files are validated server-side; the previous image is retained when no replacement is selected, and managed old files are removed after a successful replacement or removal.
