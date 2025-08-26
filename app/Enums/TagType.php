<?php

namespace App\Enums;

enum TagType: string
{
    case INDUSTRY = 'industry';
    case BLOG = 'blog';
    case PROJECT = 'project';

    public function label(): string
    {
        return match ($this) {
            self::INDUSTRY => 'Industry',
            self::BLOG => 'Blog',
            self::PROJECT => 'Project',
        };
    }

    public static function options(): array
    {
        return collect(self::cases())
            ->map(fn($case) => [
                'value' => $case->value,
                'label' => $case->label(),
            ])
            ->toArray();
    }
}
