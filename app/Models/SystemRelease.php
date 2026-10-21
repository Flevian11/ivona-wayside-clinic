<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SystemRelease extends Model
{
    protected $fillable = [
        'version',
        'title',
        'release_type',
        'summary',
        'release_notes',
        'features',
        'improvements',
        'bug_fixes',
        'security_notes',
        'known_issues',
        'minimum_php_version',
        'minimum_database_version',
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'improvements' => 'array',
            'bug_fixes' => 'array',
            'security_notes' => 'array',
            'known_issues' => 'array',
            'published_at' => 'datetime',
            'withdrawn_at' => 'datetime',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function publisher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'published_by');
    }
}