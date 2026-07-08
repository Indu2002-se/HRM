<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'date',
        'check_in',
        'check_out',
        'worked_hours',
        'status',
        'verification_method',
        'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'worked_hours' => 'decimal:2',
            'verified_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
