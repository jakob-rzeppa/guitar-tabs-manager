<?php

namespace App\DataFixtures;

use App\Entity\Artist;
use App\Entity\Sheet;
use App\Entity\Tag;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $artist = new Artist();
        $artist->setName('Ed Sheeran');

        $manager->persist($artist);

        $tagOne = new Tag();
        $tagOne->setName('Pop');

        $manager->persist($tagOne);

        $tagTwo = new Tag();
        $tagTwo->setName('Acoustic');

        $manager->persist($tagTwo);

        $sheet = new Sheet();
        $sheet->setTitle('Shape of You');
        $sheet->setContent('...');
        $sheet->setCapo(2);
        $sheet->setSourceURL('https://example.com/shape-of-you');
        $sheet->setArtist($artist);
        $sheet->addTag($tagOne);
        $sheet->addTag($tagTwo);

        $manager->persist($sheet);

        $manager->flush();
    }
}
