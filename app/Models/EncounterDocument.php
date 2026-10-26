<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class EncounterDocument extends Model {
 protected $guarded=['id'];
 public function encounter(): BelongsTo { return $this->belongsTo(Encounter::class); }
 public function uploader(): BelongsTo { return $this->belongsTo(User::class,'uploaded_by'); }
}
