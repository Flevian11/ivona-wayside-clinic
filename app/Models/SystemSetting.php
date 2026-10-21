<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'group',
        'is_public',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'value' => 'array',
            'is_public' => 'boolean',
        ];
    }
}