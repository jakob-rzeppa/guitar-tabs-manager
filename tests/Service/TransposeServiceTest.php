<?php

namespace App\Tests\Service;

use App\Service\TransposeService;
use PHPUnit\Framework\TestCase;

class TransposeServiceTest extends TestCase
{
    public function testAllChords(): void
    {
        $chords = [
            'C',
            'C#',
            'Db',
            'D',
            'D#',
            'Eb',
            'E',
            'F',
            'F#',
            'Gb',
            'G',
            'G#',
            'Ab',
            'A',
            'A#',
            'Bb',
            'B',
            'Cm',
            'C#m',
            'Dbm',
            'Dm',
            'D#m',
            'Ebm',
            'Em',
            'Fm',
            'F#m',
            'Gbm',
            'Gm',
            'G#m',
            'Abm',
            'Am',
            'A#m',
            'Bbm',
            'Bm',
        ];
        $expected = [
            'C#',
            'D',
            'D',
            'D#',
            'E',
            'E',
            'F',
            'F#',
            'G',
            'G',
            'G#',
            'A',
            'A',
            'A#',
            'B',
            'B',
            'C',
            'C#m',
            'Dm',
            'Dm',
            'D#m',
            'Em',
            'Em',
            'Fm',
            'F#m',
            'Gm',
            'Gm',
            'G#m',
            'Am',
            'Am',
            'A#m',
            'Bm',
            'Bm',
            'Cm',
        ];

        $transposeService = new TransposeService();

        foreach ($chords as $index => $chord) {
            $result = $transposeService->transposeTab($chord, 'up');

            $this->assertEquals(
                $expected[$index],
                trim($result),
                "The transposed chord should be equal to the expected chord"
            );
        }
    }

    public function testAllChordsDown(): void
    {
        $chords = [
            'C',
            'C#',
            'Db',
            'D',
            'D#',
            'Eb',
            'E',
            'F',
            'F#',
            'Gb',
            'G',
            'G#',
            'Ab',
            'A',
            'A#',
            'Bb',
            'B',
            'Cm',
            'C#m',
            'Dbm',
            'Dm',
            'D#m',
            'Ebm',
            'Em',
            'Fm',
            'F#m',
            'Gbm',
            'Gm',
            'G#m',
            'Abm',
            'Am',
            'A#m',
            'Bbm',
            'Bm',
        ];
        $expected = [
            'B',
            'C',
            'C',
            'C#',
            'D',
            'D',
            'D#',
            'E',
            'F',
            'F',
            'F#',
            'G',
            'G',
            'G#',
            'A',
            'A',
            'A#',
            'Bm',
            'Cm',
            'Cm',
            'C#m',
            'Dm',
            'Dm',
            'D#m',
            'Em',
            'Fm',
            'Fm',
            'F#m',
            'Gm',
            'Gm',
            'G#m',
            'Am',
            'Am',
            'A#m',
        ];

        $transposeService = new TransposeService();

        foreach ($chords as $index => $chord) {
            $result = $transposeService->transposeTab($chord, 'down');

            $this->assertEquals(
                $expected[$index],
                trim($result),
                "The transposed chord should be equal to the expected chord"
            );
        }
    }

    public function testLyrics(): void
    {
        $tab = 'This is a test line with chords: C, D, E, F, G, A, B, that should be transposed.';
        $expected = 'This is a test line with chords: C, D, E, F, G, A, B, that should be transposed.';

        $transposeService = new TransposeService();
        $result = $transposeService->transposeTab($tab, 'up');

        $this->assertEquals(
            $expected,
            $result,
            'The transposed tab should be equal to the expected tab'
        );
    }

    public function testEmptyTab(): void
    {
        $tab = '';
        $expected = '';

        $transposeService = new TransposeService();
        $result = $transposeService->transposeTab($tab, 'up');

        $this->assertEquals(
            $expected,
            $result,
            'The transposed tab should be equal to the expected tab'
        );
    }

    public function testHeadings(): void
    {
        $tab = '[Intro]';
        $expected = '[Intro]';

        $transposeService = new TransposeService();
        $result = $transposeService->transposeTab($tab, 'up');

        $this->assertEquals(
            $expected,
            $result,
            'The transposed tab should be equal to the expected tab'
        );
    }

    public function testMultilineTab(): void
    {
        $tab = "[Intro]\nG\n\n[Verse 1]\n          G        Em\nI found a love for me\n              C                            D\nDarling, just dive right in, and follow my lead\n                G          Em\nWell, I found a girl beautiful and sweet\n        C                                     D\nI never knew you were the someone waiting for me";
        $expected = "[Intro]\nG#\n\n[Verse 1]\n          G#       Fm\nI found a love for me\n              C#                           D#\nDarling, just dive right in, and follow my lead\n                G#         Fm\nWell, I found a girl beautiful and sweet\n        C#                                    D#\nI never knew you were the someone waiting for me";

        $transposeService = new TransposeService();
        $result = $transposeService->transposeTab($tab, 'up');

        $this->assertEquals(
            $expected,
            $result,
            'The transposed tab should be equal to the expected tab'
        );
    }
}
