<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Face\EnrollFaceRequest;
use App\Http\Resources\UserResource;
use App\Services\FaceVerificationService;
use Illuminate\Http\JsonResponse;

class FaceController extends Controller
{
    public function __construct(
        private FaceVerificationService $faceService
    ) {}

    public function status(): JsonResponse
    {
        $user = auth()->user();

        return response()->json([
            'data' => [
                'face_enrolled' => $this->faceService->isEnrolled($user),
                'face_enrolled_at' => $user->face_enrolled_at?->toISOString(),
            ],
        ]);
    }

    public function enroll(EnrollFaceRequest $request): JsonResponse
    {
        $user = $this->faceService->enroll(
            auth()->user(),
            $request->validated('face_descriptor')
        );

        return response()->json([
            'message' => 'Face enrolled successfully',
            'data' => new UserResource($user),
        ]);
    }
}
