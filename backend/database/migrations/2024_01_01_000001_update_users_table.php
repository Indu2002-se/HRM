<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('employee')->after('email');
            $table->string('position')->nullable()->after('role');
            $table->string('level')->nullable()->after('position');
            $table->string('status')->default('active')->after('level');
            $table->date('joined_date')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'position', 'level', 'status', 'joined_date']);
        });
    }
};
