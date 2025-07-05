<?php

namespace App\Service;

use InvalidArgumentException;

class TransposeService
{
    public function transposeTab(string $tab, string $direction): string
    {
        $tabRows = explode("\n", $tab);

        $result = '';

        foreach ($tabRows as $row) {
            $transposedRow = '';

            if ($direction === 'down') {
                $transposeTable = $this->getTransposeTableDown();
            } elseif ($direction === 'up') {
                $transposeTable = $this->getTransposeTableUp();
            } else {
                throw new InvalidArgumentException('Invalid transpose direction. Use "up" or "down".');
            }

            $keys = array_keys($transposeTable);
            usort($keys, function ($a, $b) {
                return strlen($b) - strlen($a);
            });

            for ($index = 0; $index < strlen($row); $index++) {
                $matched = false;

                foreach ($keys as $key) {
                    if (substr($row, $index, strlen($key)) === $key) {
                        $transposedChord = $transposeTable[$key];
                        $transposedRow .= $transposedChord;

                        $index += strlen($key) - 1;

                        $matched = true;
                        break;
                    }
                }

                if (!$matched) {
                    if (!preg_match('/[A-Ga-g#bmj743su,() \/|\\\\]/', $row[$index])) {
                        $transposedRow = $row;
                        break;
                    }

                    $transposedRow .= $row[$index];
                }
            }

            $result .= $transposedRow . "\n";
        }

        return rtrim($result, "\n");
    }

    private function getTransposeTableUp(): array
    {
        return [
            'C' => 'C#',
            'C#' => 'D',
            'Db' => 'D',
            'D' => 'D#',
            'D#' => 'E',
            'Eb' => 'E',
            'E' => 'F',
            'F' => 'F#',
            'F#' => 'G',
            'Gb' => 'G',
            'G' => 'G#',
            'G#' => 'A',
            'Ab' => 'A',
            'A' => 'A#',
            'A#' => 'B',
            'Bb' => 'B',
            'B' => 'C',
        ];
    }

    private function getTransposeTableDown(): array
    {
        return [
            'C#' => 'C',
            'Db' => 'C',
            'D' => 'C#',
            'D#' => 'D',
            'Eb' => 'D',
            'E' => 'D#',
            'F' => 'E',
            'F#' => 'F',
            'Gb' => 'F',
            'G' => 'F#',
            'G#' => 'G',
            'Ab' => 'G',
            'A' => 'G#',
            'A#' => 'A',
            'Bb' => 'A',
            'B' => 'A#',
            'C' => 'B',
        ];
    }
}
