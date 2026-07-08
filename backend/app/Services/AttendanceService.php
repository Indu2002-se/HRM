<?php

namespace App\Services;

use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Pagination\LengthAwarePaginator;

class AttendanceService
{
    public function getUserAttendances(string $userId, array $filters = []): LengthAwarePaginator
    {
        $query = Attendance::where('user_id', $userId);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['date'])) {
            $query->whereDate('date', $filters['date']);
        }

        if (!empty($filters['search'])) {
            $query->whereDate('date', 'like', '%' . $filters['search'] . '%');
        }

        return $query->orderBy('date', 'desc')
            ->paginate($filters['per_page'] ?? 10);
    }

    public function checkIn(string $userId, array $data): Attendance
    {
        $today = Carbon::today()->toDateString();
        
        // Check if already checked in today
        $existing = Attendance::where('user_id', $userId)
            ->whereDate('date', $today)
            ->first();

        if ($existing) {
            throw new \Exception('Already checked in today');
        }

        return Attendance::create([
            'user_id' => $userId,
            'date' => $today,
            'check_in' => Carbon::now()->toTimeString(),
            'status' => 'present',
            'verification_method' => $data['verification_method'] ?? 'manual',
            'verified_at' => ($data['verification_method'] ?? 'manual') === 'face' ? now() : null,
        ]);
    }

    public function checkOut(string $id, string $userId, array $data): Attendance
    {
        $attendance = Attendance::where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();

        if ($attendance->check_out) {
            throw new \Exception('Already checked out');
        }

        $checkIn = Carbon::parse($attendance->date . ' ' . $attendance->check_in);
        $checkOut = Carbon::now();
        
        $workedHours = $checkOut->diffInMinutes($checkIn) / 60;

        $attendance->update([
            'check_out' => $checkOut->toTimeString(),
            'worked_hours' => round($workedHours, 2),
            'verification_method' => $data['verification_method'] ?? $attendance->verification_method,
            'verified_at' => ($data['verification_method'] ?? null) === 'face' ? now() : $attendance->verified_at,
        ]);

        return $attendance;
    }

    public function getStats(string $userId, ?string $month = null, ?string $year = null): array
    {
        $month = $month ?? Carbon::now()->month;
        $year = $year ?? Carbon::now()->year;

        $attendances = Attendance::where('user_id', $userId)
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->get();

        $totalAttendance = $attendances->count();
        $checkedInToday = Attendance::where('user_id', $userId)
            ->whereDate('date', Carbon::today())
            ->whereNotNull('check_in')
            ->exists();
        
        $checkedOutToday = Attendance::where('user_id', $userId)
            ->whereDate('date', Carbon::today())
            ->whereNotNull('check_out')
            ->exists();

        $todayAttendance = Attendance::where('user_id', $userId)
            ->whereDate('date', Carbon::today())
            ->first();

        return [
            'total_attendance_this_month' => $totalAttendance,
            'checked_in_today' => $checkedInToday,
            'checked_out_today' => $checkedOutToday,
            'current_status' => $todayAttendance ? $todayAttendance->status : 'absent',
            'worked_hours_today' => $todayAttendance ? ($todayAttendance->worked_hours ?? 0) : 0
        ];
    }

    public function getTodayStatus(string $userId): array
    {
        $attendance = Attendance::where('user_id', $userId)
            ->whereDate('date', Carbon::today())
            ->first();

        return [
            'checked_in' => $attendance && $attendance->check_in ? true : false,
            'checked_out' => $attendance && $attendance->check_out ? true : false,
            'check_in_time' => $attendance?->check_in,
            'check_out_time' => $attendance?->check_out,
            'worked_hours' => $attendance?->worked_hours ?? 0,
            'status' => $attendance?->status ?? 'absent'
        ];
    }

    public function getMonthlyChart(string $userId, ?string $month = null, ?string $year = null): array
    {
        $month = $month ?? Carbon::now()->month;
        $year = $year ?? Carbon::now()->year;

        $attendances = Attendance::where('user_id', $userId)
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->orderBy('date')
            ->get();

        $daysInMonth = Carbon::createFromDate($year, $month, 1)->daysInMonth;
        $chartData = [];

        for ($day = 1; $day <= $daysInMonth; $day++) {
            $date = Carbon::createFromDate($year, $month, $day);
            $attendance = $attendances->first(function ($item) use ($date) {
                return \Carbon\Carbon::parse($item->date)->toDateString() === $date->toDateString();
            });

            $chartData[] = [
                'day' => $day,
                'date' => $date->format('Y-m-d'),
                'worked_hours' => $attendance ? ($attendance->worked_hours ?? 0) : 0,
                'status' => $attendance ? $attendance->status : 'absent'
            ];
        }

        return $chartData;
    }
}
