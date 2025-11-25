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
            $result = $transposeService->transposeSheet($chord, 'up');

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
            $result = $transposeService->transposeSheet($chord, 'down');

            $this->assertEquals(
                $expected[$index],
                trim($result),
                "The transposed chord should be equal to the expected chord"
            );
        }
    }

    public function testLyrics(): void
    {
        $sheet = 'This is a test line with chords: C, D, E, F, G, A, B, that should be transposed.';
        $expected = 'This is a test line with chords: C, D, E, F, G, A, B, that should be transposed.';

        $transposeService = new TransposeService();
        $result = $transposeService->transposeSheet($sheet, 'up');

        $this->assertEquals(
            $expected,
            $result,
            'The transposed sheet should be equal to the expected sheet'
        );
    }

    public function testEmptySheet(): void
    {
        $sheet = '';
        $expected = '';

        $transposeService = new TransposeService();
        $result = $transposeService->transposeSheet($sheet, 'up');

        $this->assertEquals(
            $expected,
            $result,
            'The transposed sheet should be equal to the expected sheet'
        );
    }

    public function testHeadings(): void
    {
        $sheet = '[Intro]';
        $expected = '[Intro]';

        $transposeService = new TransposeService();
        $result = $transposeService->transposeSheet($sheet, 'up');

        $this->assertEquals(
            $expected,
            $result,
            'The transposed sheet should be equal to the expected sheet'
        );
    }

    public function testMultilineSheet(): void
    {
        $sheet = "[Intro]\nG\n\n[Verse 1]\n          G        Em\nI found a love for me\n              C                            D\nDarling, just dive right in, and follow my lead\n                G          Em\nWell, I found a girl beautiful and sweet\n        C                                     D\nI never knew you were the someone waiting for me";
        $expected = "[Intro]\nG#\n\n[Verse 1]\n          G#        Fm\nI found a love for me\n              C#                            D#\nDarling, just dive right in, and follow my lead\n                G#          Fm\nWell, I found a girl beautiful and sweet\n        C#                                     D#\nI never knew you were the someone waiting for me";

        $transposeService = new TransposeService();
        $result = $transposeService->transposeSheet($sheet, 'up');

        $this->assertEquals(
            $expected,
            $result,
            'The transposed sheet should be equal to the expected sheet'
        );
    }

    public function testChordsRightNextToEachOther(): void
    {
        $sheet = 'C D E';
        $expected = 'C# D# F';

        $transposeService = new TransposeService();
        $result = $transposeService->transposeSheet($sheet, 'up');

        $this->assertEquals(
            $expected,
            $result,
            'The transposed sheet should be equal to the expected sheet'
        );
    }

    public function testChordsWithSpaces(): void
    {
        $sheet = 'C  D  E';
        $expected = 'C#  D#  F';

        $transposeService = new TransposeService();
        $result = $transposeService->transposeSheet($sheet, 'up');

        $this->assertEquals(
            $expected,
            $result,
            'The transposed sheet should be equal to the expected sheet'
        );
    }

    public function testChordsWithSuffixes(): void
    {

        $chords = [
            'Cmaj7',
            'C#sus4',
            'Db7',
            'Dmaj7',
            'D#7',
        ];
        $expected = [
            'C#maj7',
            'Dsus4',
            'D7',
            'D#maj7',
            'E7',
        ];

        $transposeService = new TransposeService();

        foreach ($chords as $index => $chord) {
            $result = $transposeService->transposeSheet($chord, 'up');

            $this->assertEquals(
                $expected[$index],
                trim($result),
                "The transposed chord should be equal to the expected chord"
            );
        }
    }

    public function testInversedChords(): void
    {
        $chords = [
            'C/E',
            'C#/B',
            'Db/F#',
            'D/A',
            'D#/C#',
            'Eb/Bb',
        ];
        $expected = [
            'C#/F',
            'D/C',
            'D/G',
            'D#/A#',
            'E/D',
            'E/B',
        ];

        $transposeService = new TransposeService();

        foreach ($chords as $index => $chord) {
            $result = $transposeService->transposeSheet($chord, 'up');

            $this->assertEquals(
                $expected[$index],
                trim($result),
                "The transposed chord should be equal to the expected chord"
            );
        }
    }
}
