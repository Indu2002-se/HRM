<?php

namespace App\Http\Requests\Attendance;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VerifyAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action' => ['required', Rule::in(['check_in', 'check_out'])],
            'face_descriptor' => ['required', 'array', 'size:128'],
            'face_descriptor.*' => ['required', 'numeric'],
            'attendance_id' => ['required_if:action,check_out', 'nullable', 'uuid'],
        ];
    }
}
