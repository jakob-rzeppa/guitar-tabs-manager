<?php

namespace App\DataFixtures;

use App\Entity\Artist;
use App\Entity\SongKey;
use App\Entity\Tab;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // $product = new Product();
        // $manager->persist($product);

        $artist = new Artist();
        $artist->setName('The Beatles');
        $manager->persist($artist);

        $tab = new Tab();
        $tab->setName('Yesterday');
        $tab->setArtist($artist);
        $tab->setSongKey(SongKey::F);
        $tab->setCapo(0);
        $tab->setContent("Chords in the original key of F. McCartney plays it in G but uses a guitar that is tuned down one full step (D-G-C-F-A-d), that's why the song sounds in the key of F. Transposed +2 to G (the way McCartney played it in the studio and plays it live until today) the song is much easier to play.\n\n[Intro]\nF  F\n\n[Verse 1]\nF         Em7     A7                 Dm     Dm/C\nYesterday, all my troubles seemed so far away\nBb       C7                     F            F/E Dm  G7       Bb F F\n Now it looks as though they're here to stay, oh I believe in yesterday\n\n[Verse 2]\nF        Em7      A7             Dm         Dm/C\nSuddenly, I'm not half the man I used to be\nBb         C7             F        F/E Dm   G7       Bb F F\n There's a shadow hanging over me, oh yesterday came suddenly\n \n[Chorus]\nEm7 A7   Dm  Dm/C Bb         Gm        C        F\nWhy she  had to   go I don't know, she wouldn't say\nEm7 A7   Dm  Dm/C  Bb           Gm       C     F\nI   said something wrong, now I long for yesterday\n \n[Verse 3]\nF         Em7       A7           Dm          Dm/C\nYesterday, love was such an easy game to play\nBb     C7              F          F/E Dm  G7       Bb F F\n Now I need a place to hide away, oh  I believe in yesterday\n \n[Chorus]\nEm7 A7   Dm  Dm/C Bb           Gm       C       F\n Why she  had to   go I don't know, she wouldn't say\nEm7 A7   Dm  Dm/C  Bb           Gm       C     F\nI   said something wrong, now I long for yesterday\n \n[Verse]\nF        Em7        A7           Dm           Dm/C\nYesterday, love was such an easy game to play\nBb     C7              F          F/E Dm  G7       Bb F F\n Now I need a place to hide away, oh  I believe in yesterday\n \n[Outro]\nF     G/F   Bb F  F\nMm mm mm mm mm mm mmmmmmmmm");
        $manager->persist($tab);

        $artist = new Artist();
        $artist->setName('Ed Sheeran');
        $manager->persist($artist);

        $tab = new Tab();
        $tab->setName('Perfect');
        $tab->setArtist($artist);
        $tab->setSongKey(SongKey::A_B);
        $tab->setCapo(1);
        $tab->setContent("[Intro]\n\nG\n\n \n\n[Verse 1]\n\n          G        Em\n\nI found a love for me\n\n              C                            D\n\nDarling, just dive right in, and follow my lead\n\n                G          Em\n\nWell, I found a girl beautiful and sweet\n\n        C                                     D\n\nI never knew you were the someone waiting for me\n\n \n\n[Pre-Chorus]\n\n                                G\n\nCause we were just kids when we fell in love\n\n            Em                      C                G  D\n\nNot knowing what it was, I will not give you up this ti-ime\n\n             G                           Em\n\nDarling just kiss me slow, your heart is all I own\n\n            C                     D\n\nAnd in your eyes you're holding mine\n\n \n\n[Chorus]\n\n      Em   C             G          D              Em\n\nBaby, I'm dancing in the dark, with you between my arms\n\nC                G     D                Em\n\nBarefoot on the grass, listening to our favourite song\n\n          C                G                 D              Em\n\nWhen you said you looked a mess, I whispered underneath my breath\n\n         C                G        D          G\n\nBut you heard it, darling you look perfect tonight\n\n \n\n|(G) D/F# Em D | C  D  |\n\n \n\n[Verse 2]\n\n                G                    Em\n\nWell, I found a woman, stronger than anyone I know\n\n              C                                          D\n\nShe shares my dreams, I hope that someday I'll share her home\n\n           G             Em\n\nI found a love, to carry more than just my secrets\n\n         C                              D\n\nTo carry love, to carry children of our own\n\n \n\n[Pre-Chorus]\n\n                             G                     Em\n\nWe are still kids, but we're so in love, fighting against all odds\n\n             C               G  D\n\nI know we'll be alright this ti-ime\n\n             G                              Em\n\nDarling just hold my hand, be my girl, I'll be your man\n\n         C               D\n\nI see my future in your eyes\n\n \n\n[Chorus]\n\n      Em   C              G         D              Em\n\nBaby, I'm dancing in the dark, with you between my arms\n\nC                G     D                Em\n\nBarefoot on the grass, listening to our favourite song\n\n        C                G                D\n\nWhen I saw you in that dress, looking so beautiful\n\n  Em       C                  G        D          G\n\nI don't deserve this, darling you look perfect tonight\n\n \n\n[Interlude]\n\n|(G) | G | Em | % |\n\n| C  | % | D  | % |\n\n \n\n[Chorus]\n\n      Em   C              G         D              Em\n\nBaby, I'm dancing in the dark, with you between my arms\n\nC                G     D                Em\n\nBarefoot on the grass, listening to our favourite song\n\n        C              G               D             Em\n\nI have faith in what I see, now I know I have met an angel\n\n    C          G         D\n\nIn person, and she looks perfect\n\n \n\n[Outro]\n\n  G/B     C           Dsus4    D          G\n\nI don't deserve this, you look perfect tonight\n\n|(G) D/F# Em D | C  D  | G");
        $manager->persist($tab);

        $manager->flush();
    }
}
