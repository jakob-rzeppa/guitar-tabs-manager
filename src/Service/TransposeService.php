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
            // Skip lines with characters that are not valid chords or symbols
            if (preg_match('/[^\w\s#bm\d\p{P}()\[\]%\/|\\\\\-_]/u', $row)) {
                $result .= $row . "\n";
                continue;
            }

            // Skip lines with words longer than 3 characters (e.g. lyrics)
            if (max(array_map('strlen', explode(' ', $row))) > 3) {
                $result .= $row . "\n";
                continue;
            }

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
                        $result .= $transposedChord;

                        // Add spaces if the transposed chord is shorter than the original chord
                        if (strlen($transposedChord) < strlen($key)) {
                            $result .= str_repeat(' ', strlen($key) - strlen($transposedChord));
                        }

                        $index += strlen($key);
                        $matched = true;
                        break;
                    }
                }

                if (!$matched) {
                    $result .= $row[$index];
                }
            }

            $result .= "\n";
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
            'Cm' => 'C#m',
            'C#m' => 'Dm',
            'Dbm' => 'Dm',
            'Dm' => 'D#m',
            'D#m' => 'Em',
            'Ebm' => 'Em',
            'Em' => 'Fm',
            'Fm' => 'F#m',
            'F#m' => 'Gm',
            'Gbm' => 'Gm',
            'Gm' => 'G#m',
            'G#m' => 'Am',
            'Abm' => 'Am',
            'Am' => 'A#m',
            'A#m' => 'Bm',
            'Bbm' => 'Bm',
            'Bm' => 'Cm',
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
            'C#m' => 'Cm',
            'Dbm' => 'Cm',
            'Dm' => 'C#m',
            'D#m' => 'Dm',
            'Ebm' => 'Dm',
            'Em' => 'D#m',
            'Fm' => 'Em',
            'F#m' => 'Fm',
            'Gbm' => 'Fm',
            'Gm' => 'F#m',
            'G#m' => 'Gm',
            'Abm' => 'Gm',
            'Am' => 'G#m',
            'A#m' => 'Am',
            'Bbm' => 'Am',
            'Bm' => 'A#m',
            'Cm' => 'Bm',
        ];
    }
}
