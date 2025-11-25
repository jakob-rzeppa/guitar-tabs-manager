<?php

namespace App\Service;

class FormatService
{
    public function formatSheet(string $sheet): string
    {
        $sheetLines = explode("\n", $sheet);

        $sheetLines = array_filter($sheetLines, fn($line) => !$this->isUnwantedLine($line));
        $sheetLines = array_values($sheetLines);

        // Add newlines before and after headings and instrumental parts
        foreach ($sheetLines as $index => $line) {
            if ($this->isHeading($line)) {
                $sheetLines[$index] = "\n" . $line . "\n";
            } else if ($this->isInstrumental($line)) {
                $prefix = isset($sheetLines[$index - 1]) && $this->isInstrumental($sheetLines[$index - 1]) ? '' : "\n";
                $suffix = isset($sheetLines[$index + 1]) && $this->isInstrumental($sheetLines[$index + 1]) ? '' : "\n";
                $sheetLines[$index] = $prefix . $line . $suffix;
            }
        }

        $sheet = implode("\n", $sheetLines);

        // Reduce multiple newlines to two
        $sheet = preg_replace('/\n{3,}/', "\n\n", $sheet);

        // Remove leading newlines
        $sheet = ltrim($sheet, "\n");
        // Remove trailing newlines
        $sheet = rtrim($sheet, "\n");

        return $sheet;
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
