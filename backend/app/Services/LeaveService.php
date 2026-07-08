<?php

namespace App\Services;

use App\Models\Leave;
use Carbon\Carbon;
use Illuminate\Pagination\LengthAwarePaginator;

class LeaveService
{
    public function getUserLeaves(string $userId, array $filters = []): LengthAwarePaginator
    {
        $query = Leave::where('user_id', $userId);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy('created_at', 'desc')
            ->paginate($filters['per_page'] ?? 10);
    }

    public function createLeaveRequest(string $userId, array $data): Leave
    {
        $fromDate = Carbon::parse($data['from_date']);
        $toDate = Carbon::parse($data['to_date']);
        
        $numDays = $fromDate->diffInDays($toDate) + 1;

        // Calculate based on leave type
        if ($data['leave_type'] === 'half_day') {
            $numDays = 0.5;
        } elseif ($data['leave_type'] === 'short_leave') {
            $numDays = 0.25;
        }

        return Leave::create([
            'user_id' => $userId,
            'from_date' => $data['from_date'],
            'to_date' => $data['to_date'],
            'leave_type' => $data['leave_type'],
            'reason' => $data['reason'],
            'num_days' => $numDays,
            'status' => 'pending'
        ]);
    }

    public function getLeaveBalance(string $userId): array
    {
        $currentYear = Carbon::now()->year;
        
        $leaves = Leave::where('user_id', $userId)
            ->whereYear('created_at', $currentYear)
            ->where('status', 'approved')
            ->get();

        $fullDays = $leaves->where('leave_type', 'full_day')->sum('num_days');
        $halfDays = $leaves->where('leave_type', 'half_day')->count();
        $shortLeaves = $leaves->where('leave_type', 'short_leave')->count();

        $totalUsed = $leaves->sum('num_days');
        $totalBalance = 20; // Assuming 20 days annual leave
        $remaining = $totalBalance - $totalUsed;

        return [
            'total_balance' => $totalBalance,
            'used' => $totalUsed,
            'remaining' => max(0, $remaining),
            'full_days' => $fullDays,
            'half_days' => $halfDays,
            'short_leaves' => $shortLeaves
        ];
    }
}
