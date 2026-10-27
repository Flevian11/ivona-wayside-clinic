<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientConsent extends Model
{
    protected $guarded = ['id'];
    protected function casts(): array { return ['requested_at' => 'datetime', 'granted_at' => 'datetime', 'expires_at' => 'datetime', 'revoked_at' => 'datetime', 'provider_metadata' => 'array', 'consent_token' => 'encrypted']; }
    public function patient(): BelongsTo { return $this->belongsTo(Patient::class); }
    public function encounter(): BelongsTo { return $this->belongsTo(Encounter::class); }
}
