<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login($request->validated());

        if (!$result['success']) {
            return response()->json([
                'message' => $result['message']
            ], 401);
        }

        return response()->json([
            'message' => 'Login successful',
            'user' => new UserResource($result['user']),
            'token' => $result['token']
        ]);
    }

    public function logout(): JsonResponse
    {
        $this->authService->logout();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    public function refresh(): JsonResponse
    {
        $token = $this->authService->refresh();

        return response()->json([
            'token' => $token
        ]);
    }

    public function me(): JsonResponse
    {
        $user = $this->authService->getCurrentUser();

        return response()->json([
            'user' => new UserResource($user)
        ]);
    }
}
