<?php

namespace App\Tests\Service;

use App\Service\TransposeService;
use PHPUnit\Framework\TestCase;

class TransposeServiceTest extends TestCase
{
    public function testAllChords(): void
    {
        $tab = 'C   C#   D   D#   E   F   F#   G   G#   A   A#   B   Cm   C#m   Dm   D#m   Em   Fm   F#m   Gm   G#m   Am   A#m   Bm';
        $expected = 'C#  D   D#  E   F  F#  G   G#  A   A#  B   C  C#m  Dm   D#m  Em   Fm  F#m  Gm   G#m  Am   A#m  Bm   Cm';

        $transposeService = new TransposeService();
        $result = $transposeService->transposeTab($tab, 'up');

        $this->assertEquals(
            $expected,
            $result,
            'The transposed tab should be equal to the expected tab'
        );
    }

    public function testAllChordsDown(): void
    {
        $tab = 'C   C#   D   D#   E   F   F#   G   G#   A   A#   B   Cm   C#m   Dm   D#m   Em   Fm   F#m   Gm   G#m   Am   A#m   Bm';
        $expected = 'B  C   C#  D   D#  E  F   F#  G   G#  A   A#  Bm  Cm   C#m  Dm   D#m  Em  Fm   F#m  Gm   G#m  Am   A#m';

        $transposeService = new TransposeService();
        $result = $transposeService->transposeTab($tab, 'down');

        $this->assertEquals(
            $expected,
            $result,
            'The transposed tab should be equal to the expected tab'
        );
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
