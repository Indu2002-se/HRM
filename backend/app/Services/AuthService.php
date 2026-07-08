<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthService
{
    public function login(array $credentials): array
    {
        if (!$token = auth()->attempt($credentials)) {
            return [
                'success' => false,
                'message' => 'Invalid credentials'
            ];
        }

        return [
            'success' => true,
            'user' => auth()->user(),
            'token' => $token
        ];
    }

    public function logout(): void
    {
        auth()->logout();
    }

    public function refresh(): string
    {
        return auth()->refresh();
    }

    public function getCurrentUser(): User
    {
        return auth()->user();
    }
}
