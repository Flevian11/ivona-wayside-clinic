<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Encounter extends Model
{
    protected $guarded = ['id'];
    protected function casts(): array { return ['arrived_at' => 'datetime', 'triaged_at' => 'datetime', 'started_at' => 'datetime', 'completed_at' => 'datetime', 'sha_eligibility_checked_at' => 'datetime', 'claim_submitted_at' => 'datetime', 'finished_at' => 'datetime', 'billing_items' => 'array']; }
    public function patient(): BelongsTo { return $this->belongsTo(Patient::class); }
    public function principalMember(): BelongsTo { return $this->belongsTo(Patient::class, 'principal_member_patient_id'); }
    public function documents() { return $this->hasMany(EncounterDocument::class); }
    public function registeredBy(): BelongsTo { return $this->belongsTo(User::class, 'registered_by'); }
}
