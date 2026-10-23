<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Crypt;

class PatientIdentifier extends Model
{
    protected $guarded = ['id', 'value_encrypted', 'value_hash'];
    protected $hidden = ['value_encrypted', 'value_hash'];

    public function patient(): BelongsTo { return $this->belongsTo(Patient::class); }
    public function setIdentifierValue(string $value): void
    {
        $normalized = strtoupper(preg_replace('/\s+/', '', trim($value)));
        $this->value_encrypted = Crypt::encryptString($value);
        $this->value_hash = hash('sha256', $normalized);
    }
    public function identifierValue(): ?string
    {
        return $this->value_encrypted ? Crypt::decryptString($this->value_encrypted) : null;
    }
}
