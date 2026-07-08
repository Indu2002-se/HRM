<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'position' => $this->position,
            'level' => $this->level,
            'status' => $this->status,
            'joined_date' => $this->joined_date?->format('Y-m-d'),
            'face_enrolled' => !empty($this->face_descriptor),
            'face_enrolled_at' => $this->face_enrolled_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
