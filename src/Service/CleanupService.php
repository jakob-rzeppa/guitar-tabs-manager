<?php

namespace App\Service;

class CleanupService
{
    public function cleanupTab(string $tab): string
    {
        $tab = preg_replace('/^\h*\v+/m', '', $tab);

        return $tab;
    }
}
