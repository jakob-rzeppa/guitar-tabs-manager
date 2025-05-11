<?php

namespace App\DataFixtures;

use App\Entity\Artist;
use App\Entity\Tab;
use App\Entity\Tag;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class TabFixture extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $tag = new Tag();
        $tag->setName('Tag 1');
        $manager->persist($tag);

        $artist = new Artist();
        $artist->setName('Artist 1');
        $manager->persist($artist);

        $tab = new Tab();
        $tab->setTitle('Tab 1');
        $tab->setCapo(0);
        $tab->setContent('This is the content of Tab 1.');
        $tab->addTag($tag);
        $tab->setArtist($artist);
        $manager->persist($tab);

        $manager->flush();
    }
}
