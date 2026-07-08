<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeaveResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'from_date' => $this->from_date,
            'to_date' => $this->to_date,
            'leave_type' => $this->leave_type,
            'reason' => $this->reason,
            'rejected_reason' => $this->rejected_reason,
            'num_days' => $this->num_days,
            'status' => $this->status,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
