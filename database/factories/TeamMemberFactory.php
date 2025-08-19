<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TeamMember>
 */
class TeamMemberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'designation' => fake()->jobTitle(),
            'bio' => fake()->paragraph(),
            'mascot_image' => fake()->imageUrl(400, 400, 'people'),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'social_links' => json_encode([
                'twitter' => fake()->url(),
                'linkedin' => fake()->url(),
            ]),
            'image' => fake()->imageUrl(400, 400, 'people'),
            'color' => fake()->hexColor(),
            'type' => fake()->randomElement(['member', 'star_member']),
            'order' => fake()->numberBetween(0, 100),
            'is_active' => fake()->boolean(),
        ];
    }
}
