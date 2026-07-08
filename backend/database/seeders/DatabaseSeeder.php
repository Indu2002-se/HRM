<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Leave;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create users
        $employee = User::create([
            'name' => 'John Doe',
            'email' => 'employee@example.com',
            'password' => Hash::make('password'),
            'role' => 'employee',
            'position' => 'Software Engineer',
            'level' => 'Senior',
            'status' => 'active',
            'joined_date' => Carbon::now()->subYears(2)->toDateString(),
        ]);

        $manager = User::create([
            'name' => 'Jane Smith',
            'email' => 'manager@example.com',
            'password' => Hash::make('password'),
            'role' => 'manager',
            'position' => 'HR Manager',
            'level' => 'Manager',
            'status' => 'active',
            'joined_date' => Carbon::now()->subYears(5)->toDateString(),
        ]);

        // Create attendance records for the current month
        $startDate = Carbon::now()->startOfMonth();
        $endDate = Carbon::now();

        for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
            if ($date->isWeekday()) {
                Attendance::create([
                    'user_id' => $employee->id,
                    'date' => $date->toDateString(),
                    'check_in' => '09:00:00',
                    'check_out' => '18:00:00',
                    'worked_hours' => 9.0,
                    'status' => 'present',
                ]);
            }
        }

        // Create some leave requests
        Leave::create([
            'user_id' => $employee->id,
            'from_date' => Carbon::now()->addDays(5)->toDateString(),
            'to_date' => Carbon::now()->addDays(7)->toDateString(),
            'leave_type' => 'full_day',
            'reason' => 'Family vacation',
            'num_days' => 3,
            'status' => 'pending',
        ]);

        Leave::create([
            'user_id' => $employee->id,
            'from_date' => Carbon::now()->subDays(10)->toDateString(),
            'to_date' => Carbon::now()->subDays(10)->toDateString(),
            'leave_type' => 'half_day',
            'reason' => 'Doctor appointment',
            'num_days' => 0.5,
            'status' => 'approved',
        ]);
    }
}
