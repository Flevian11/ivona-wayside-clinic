<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StaffMember extends Model
{
    protected $fillable = ['staff_number', 'first_name', 'last_name', 'other_names', 'work_email', 'phone', 'department', 'job_title', 'employment_status', 'user_id'];

    public function user(): BelongsTo { return $this->belongsTo(User::class); }

    protected function casts(): array { return ['created_at' => 'datetime', 'updated_at' => 'datetime']; }
}
