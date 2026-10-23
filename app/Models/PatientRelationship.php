<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientRelationship extends Model
{
    protected $guarded = ['id'];
    protected function casts(): array { return ['is_principal_member' => 'boolean', 'verified_at' => 'datetime']; }
    public function patient(): BelongsTo { return $this->belongsTo(Patient::class); }
    public function relatedPatient(): BelongsTo { return $this->belongsTo(Patient::class, 'related_patient_id'); }
}
