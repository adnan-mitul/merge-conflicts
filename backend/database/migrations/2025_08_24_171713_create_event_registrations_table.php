<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('event_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('email');
            $table->string('student_id')->unique();
            $table->string('phone_number');
            $table->string('department');
            $table->string('semester');
            $table->timestamps();

            // Prevent duplicate registration for same event
            $table->unique(['event_id', 'student_id']);
            $table->unique(['event_id', 'email']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('event_registrations');
    }
};