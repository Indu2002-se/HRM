<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'date' => $this->date,
            'day' => Carbon::parse($this->date)->format('l'),
            'check_in' => $this->check_in ? Carbon::parse($this->check_in)->format('H:i:s') : null,
            'check_out' => $this->check_out ? Carbon::parse($this->check_out)->format('H:i:s') : null,
            'worked_hours' => $this->worked_hours ?? 0,
            'status' => $this->status,
            'verification_method' => $this->verification_method ?? 'manual',
            'verified_at' => $this->verified_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
