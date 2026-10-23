<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientIntegrationTransaction extends Model
{
    protected $guarded = ['id'];
    protected function casts(): array { return ['request_body_redacted' => 'array', 'response_body_redacted' => 'array', 'completed_at' => 'datetime']; }
    public function patient(): BelongsTo { return $this->belongsTo(Patient::class); }
    public function encounter(): BelongsTo { return $this->belongsTo(Encounter::class); }
}
