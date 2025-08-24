<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        for ($i = 1; $i <= 20; $i++) {
            DB::table('users')->insert([
                'name' => $faker->name,
                'email' => "user{$i}@example.com",
                'email_verified_at' => now(), // verified email
                'password' => Hash::make('password123'), // plain password = password123
                'role' => $i % 10  === 0 ? 'admin' : 'student', // every 5th user is admin
                'remember_token' => Str::random(10),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
