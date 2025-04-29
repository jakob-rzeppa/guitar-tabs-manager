<?php

namespace App\DataFixtures;

use App\Entity\Tab;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class TabFixture extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $tab = new Tab();
        $tab->setTitle('Tab 1');
        $tab->setCapo(0);
        $tab->setContent('This is the content of Tab 1.');
        $manager->persist($tab);

        $manager->flush();
    }
}
