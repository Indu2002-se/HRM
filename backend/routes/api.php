<?php

use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FaceController;
use App\Http\Controllers\Api\LeaveController;
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
});

// Protected routes
Route::middleware('auth:api')->group(function () {
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::get('me', [AuthController::class, 'me']);
    });

    // Profile routes
    Route::get('profile', [ProfileController::class, 'show']);

    // Face routes
    Route::prefix('face')->group(function () {
        Route::get('status', [FaceController::class, 'status']);
        Route::post('enroll', [FaceController::class, 'enroll']);
    });

    // Attendance routes
    Route::prefix('attendances')->group(function () {
        Route::get('/', [AttendanceController::class, 'index']);
        Route::post('/', [AttendanceController::class, 'store']);
        Route::post('verify', [AttendanceController::class, 'verify']);
        Route::put('{id}', [AttendanceController::class, 'update']);
        Route::get('stats', [AttendanceController::class, 'stats']);
        Route::get('today-status', [AttendanceController::class, 'todayStatus']);
        Route::get('monthly-chart', [AttendanceController::class, 'monthlyChart']);
    });

    // Leave routes
    Route::prefix('leaves')->group(function () {
        Route::get('/', [LeaveController::class, 'index']);
        Route::post('/', [LeaveController::class, 'store']);
        Route::get('balance', [LeaveController::class, 'balance']);
    });
});
