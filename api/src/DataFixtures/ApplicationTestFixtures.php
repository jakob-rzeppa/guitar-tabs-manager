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

        $manager->persist($artist); // will have id 1

        $tagOne = new Tag();
        $tagOne->setName('Pop'); // will have id 1

        $manager->persist($tagOne);

        $tagTwo = new Tag();
        $tagTwo->setName('Acoustic'); // will have id 2

        $manager->persist($tagTwo);

        $sheet = new Sheet();
        $sheet->setTitle('Shape of You');
        $sheet->setContent('...');
        $sheet->setCapo(2);
        $sheet->setSourceURL('https://example.com/shape-of-you');
        $sheet->setArtist($artist);
        $sheet->addTag($tagOne);
        $sheet->addTag($tagTwo);

        $manager->persist($sheet); // will have id 1

        $manager->flush();
    }
}
