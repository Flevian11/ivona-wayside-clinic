<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Patient extends Model
{
    use SoftDeletes;

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['date_of_birth' => 'date', 'is_deceased' => 'boolean', 'last_identity_verified_at' => 'datetime'];
    }

    public function identifiers(): HasMany { return $this->hasMany(PatientIdentifier::class); }
    public function encounters(): HasMany { return $this->hasMany(Encounter::class); }
    public function consents(): HasMany { return $this->hasMany(PatientConsent::class); }
    public function relationships(): HasMany { return $this->hasMany(PatientRelationship::class); }
    public function createdBy(): BelongsTo { return $this->belongsTo(User::class, 'created_by'); }

    public function scopeSearch(Builder $query, string $term): Builder
    {
        $like = '%' . addcslashes(trim($term), '%_\\') . '%';
        return $query->where(function (Builder $q) use ($like): void {
            $q->where('medical_record_number', 'like', $like)
                ->orWhere('full_name', 'like', $like)
                ->orWhere('phone', 'like', $like)
                ->orWhere('client_registry_id', 'like', $like);
        });
    }
}
