<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->date('start_date');
            $table->date('end_date');
            $table->time('event_time');
            $table->enum('location_type', ['offline', 'virtual'])->default('offline');
            $table->string('location'); // Physical address or virtual link
            $table->string('category');
            $table->integer('capacity');
            $table->string('organizer');
            $table->string('event_image')->nullable();
            $table->json('event_features'); // Store as JSON array
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};