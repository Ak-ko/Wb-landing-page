<?php

namespace App\Traits;

trait BlogTrait
{
    function calculateReadingTime($content)
    {
        if (!$content) return 1;

        // Average reading speed: 200 words per minute
        $wordCount = str_word_count(strip_tags($content));
        $minutes = ceil($wordCount / 200);

        return max(1, $minutes); // Minimum 1 minute
    }
}
