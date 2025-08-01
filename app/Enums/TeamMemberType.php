<?php

namespace App\Enums;

enum TeamMemberType: string
{
    case MEMBER = 'member';
    case STAR_MEMBER = 'star_member';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function labels(): array
    {
        return [
            self::MEMBER->value => 'Member',
            self::STAR_MEMBER->value => 'Star Member',
        ];
    }
}
