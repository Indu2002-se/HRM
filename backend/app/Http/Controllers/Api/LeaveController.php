<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Leave\StoreLeaveRequest;
use App\Http\Resources\LeaveResource;
use App\Services\LeaveService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeaveController extends Controller
{
    public function __construct(
        private LeaveService $leaveService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $leaves = $this->leaveService->getUserLeaves(
            auth()->id(),
            $request->all()
        );

        return response()->json([
            'data' => LeaveResource::collection($leaves->items()),
            'meta' => [
                'current_page' => $leaves->currentPage(),
                'last_page' => $leaves->lastPage(),
                'per_page' => $leaves->perPage(),
                'total' => $leaves->total()
            ]
        ]);
    }

    public function store(StoreLeaveRequest $request): JsonResponse
    {
        $leave = $this->leaveService->createLeaveRequest(
            auth()->id(),
            $request->validated()
        );

        return response()->json([
            'message' => 'Leave request submitted successfully',
            'data' => new LeaveResource($leave)
        ], 201);
    }

    public function balance(): JsonResponse
    {
        $balance = $this->leaveService->getLeaveBalance(auth()->id());

        return response()->json([
            'data' => $balance
        ]);
    }
}
