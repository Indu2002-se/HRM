<?php

namespace App\Http\Requests\Face;

use Illuminate\Foundation\Http\FormRequest;

class EnrollFaceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'face_descriptor' => ['required', 'array', 'size:128'],
            'face_descriptor.*' => ['required', 'numeric'],
        ];
    }
}
