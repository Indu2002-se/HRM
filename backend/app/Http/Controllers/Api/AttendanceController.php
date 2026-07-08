<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Attendance\StoreAttendanceRequest;
use App\Http\Requests\Attendance\UpdateAttendanceRequest;
use App\Http\Requests\Attendance\VerifyAttendanceRequest;
use App\Http\Resources\AttendanceResource;
use App\Services\AttendanceService;
use App\Services\FaceVerificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function __construct(
        private AttendanceService $attendanceService,
        private FaceVerificationService $faceService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $attendances = $this->attendanceService->getUserAttendances(
            auth()->id(),
            $request->all()
        );

        return response()->json([
            'data' => AttendanceResource::collection($attendances->items()),
            'meta' => [
                'current_page' => $attendances->currentPage(),
                'last_page' => $attendances->lastPage(),
                'per_page' => $attendances->perPage(),
                'total' => $attendances->total()
            ]
        ]);
    }

    public function store(StoreAttendanceRequest $request): JsonResponse
    {
        $attendance = $this->attendanceService->checkIn(
            auth()->id(),
            $request->validated()
        );

        return response()->json([
            'message' => 'Checked in successfully',
            'data' => new AttendanceResource($attendance)
        ], 201);
    }

    public function update(UpdateAttendanceRequest $request, string $id): JsonResponse
    {
        $attendance = $this->attendanceService->checkOut(
            $id,
            auth()->id(),
            $request->validated()
        );

        return response()->json([
            'message' => 'Checked out successfully',
            'data' => new AttendanceResource($attendance)
        ]);
    }

    public function stats(Request $request): JsonResponse
    {
        $stats = $this->attendanceService->getStats(
            auth()->id(),
            $request->get('month'),
            $request->get('year')
        );

        return response()->json([
            'data' => $stats
        ]);
    }

    public function todayStatus(): JsonResponse
    {
        $status = $this->attendanceService->getTodayStatus(auth()->id());

        return response()->json([
            'data' => $status
        ]);
    }

    public function monthlyChart(Request $request): JsonResponse
    {
        $chart = $this->attendanceService->getMonthlyChart(
            auth()->id(),
            $request->get('month'),
            $request->get('year')
        );

        return response()->json([
            'data' => $chart
        ]);
    }

    public function verify(VerifyAttendanceRequest $request): JsonResponse
    {
        $user = auth()->user();
        $descriptor = $request->validated('face_descriptor');
        $action = $request->validated('action');

        if (!$this->faceService->verify($user, $descriptor)) {
            return response()->json([
                'message' => 'Face verification failed. Please try again.',
            ], 403);
        }

        $verificationData = ['verification_method' => 'face'];

        try {
            if ($action === 'check_in') {
                $attendance = $this->attendanceService->checkIn(
                    auth()->id(),
                    $verificationData
                );
                $message = 'Checked in successfully with face verification';
            } else {
                $attendanceId = $request->validated('attendance_id');
                $attendance = $this->attendanceService->checkOut(
                    $attendanceId,
                    auth()->id(),
                    $verificationData
                );
                $message = 'Checked out successfully with face verification';
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }

        return response()->json([
            'message' => $message,
            'data' => new AttendanceResource($attendance),
        ]);
    }
}
