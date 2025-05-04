<?php

namespace App\Service;

class FormatService
{
    public function formatTab(string $tab): string
    {
        $tabLines = explode("\n", $tab);

        $tabLines = array_filter($tabLines, fn($line) => !$this->isUnwantedLine($line));

        $tabLines = array_values($tabLines);

        // Add newlines before and after headings and instrumental parts
        foreach ($tabLines as $index => $line) {
            if ($this->isHeading($line)) {
                $tabLines[$index] = "\n" . $line . "\n";
            } else if ($this->isInstrumental($line)) {
                $prefix = isset($tabLines[$index - 1]) && $this->isInstrumental($tabLines[$index - 1]) ? '' : "\n";
                $suffix = isset($tabLines[$index + 1]) && $this->isInstrumental($tabLines[$index + 1]) ? '' : "\n";
                $tabLines[$index] = $prefix . $line . $suffix;
            }
        }

        $tab = implode("\n", $tabLines);

        // Reduce multiple newlines to two
        $tab = preg_replace('/\n{3,}/', "\n\n", $tab);

        // Remove leading newlines
        $tab = ltrim($tab, "\n");
        // Remove trailing newlines
        $tab = rtrim($tab, "\n");

        return $tab;
    }

    private function isHeading(string $line): bool
    {
        return str_starts_with(trim($line), '[') && str_ends_with(trim($line), ']');
    }

    private function isInstrumental(string $line): bool
    {
        return str_starts_with(trim($line), '|') && str_ends_with(trim($line), '|');
    }

    private function isUnwantedLine(string $line): bool
    {
        return trim($line) === '';
    }
}
