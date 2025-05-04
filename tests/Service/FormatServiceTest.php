<?php

namespace App\Tests;

use App\Service\FormatService;
use PHPUnit\Framework\TestCase;

class FormatServiceTest extends TestCase
{
    public function testRemoveEmptyLines(): void
    {
        $tab = "      G        Em\n\nI found a love for me\n\n          C                            D\n\nDarling, just dive right in, and follow my lead\n\n        G          Em\n\nWell, I found a girl beautiful and sweet\n\n    C                                     D\n\nI never knew you were the someone waiting for me";
        $expected = "      G        Em\nI found a love for me\n          C                            D\nDarling, just dive right in, and follow my lead\n        G          Em\nWell, I found a girl beautiful and sweet\n    C                                     D\nI never knew you were the someone waiting for me";

        $formatService = new FormatService();
        $result = $formatService->formatTab($tab);

        $this->assertEquals(
            $expected,
            $result,
            'The formated tab should be equal to the expected tab'
        );
    }

    public function testAddLinesBeforeAndAfterHeadings(): void
    {
        $tab = "        C                     D\nAnd in your eyes you're holding mine\n[Chorus]\n      Em   C             G          D              Em\nBaby, I'm dancing in the dark, with you between my arms";
        $expected = "        C                     D\nAnd in your eyes you're holding mine\n\n[Chorus]\n\n      Em   C             G          D              Em\nBaby, I'm dancing in the dark, with you between my arms";

        $formatService = new FormatService();
        $result = $formatService->formatTab($tab);

        $this->assertEquals(
            $expected,
            $result,
            'The formated tab should be equal to the expected tab'
        );
    }

    public function testAddLinesBeforeAndAfterInstrumentalParts(): void
    {
        $tab = "  Em       C                  G        D          G\nI don't deserve this, darling you look perfect tonight\n|(G) | G | Em | % |\n| C  | % | D  | % |\n      Em   C              G         D              Em\n\nBaby, I'm dancing in the dark, with you between my arms\n\n|(G) | G | Em | % |\n\n| C  | % | D  | % |\n\n      Em   C              G         D              Em\nBaby, I'm dancing in the dark, with you between my arms";
        $expected = "  Em       C                  G        D          G\nI don't deserve this, darling you look perfect tonight\n\n|(G) | G | Em | % |\n| C  | % | D  | % |\n\n      Em   C              G         D              Em\nBaby, I'm dancing in the dark, with you between my arms\n\n|(G) | G | Em | % |\n| C  | % | D  | % |\n\n      Em   C              G         D              Em\nBaby, I'm dancing in the dark, with you between my arms";

        $formatService = new FormatService();
        $result = $formatService->formatTab($tab);

        $this->assertEquals(
            $expected,
            $result,
            'The formated tab should be equal to the expected tab'
        );
    }

    public function testAddLinesForHeadingInCombinationWithInstrumentalParts(): void
    {
        $tab = "  Em       C                  G        D          G\nI don't deserve this, darling you look perfect tonight\n[Interlude]\n|(G) | G | Em | % |\n[Chorus]\n      Em   C              G         D              Em\n\nBaby, I'm dancing in the dark, with you between my arms";
        $expected = "  Em       C                  G        D          G\nI don't deserve this, darling you look perfect tonight\n\n[Interlude]\n\n|(G) | G | Em | % |\n\n[Chorus]\n\n      Em   C              G         D              Em\nBaby, I'm dancing in the dark, with you between my arms";

        $formatService = new FormatService();
        $result = $formatService->formatTab($tab);

        $this->assertEquals(
            $expected,
            $result,
            'The formated tab should be equal to the expected tab'
        );
    }

    public function testBeginningAndEndOfTab(): void
    {
        $tab = "\n[Intro]\n\n  Em       C                  G        D          G\nI don't deserve this, darling you look perfect tonight\n\n[Chorus]\n      Em   C             G          D              Em\nBaby, I'm dancing in the dark, with you between my arms\n[Outro]\n";
        $expected = "[Intro]\n\n  Em       C                  G        D          G\nI don't deserve this, darling you look perfect tonight\n\n[Chorus]\n\n      Em   C             G          D              Em\nBaby, I'm dancing in the dark, with you between my arms\n\n[Outro]";

        $formatService = new FormatService();
        $result = $formatService->formatTab($tab);

        $this->assertEquals(
            $expected,
            $result,
            'The formated tab should be equal to the expected tab'
        );
    }
}
