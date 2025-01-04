<?php

namespace App\Tests\Controller;

use App\Entity\Artist;
use App\Entity\SongKey;
use App\Entity\Tab;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class TabControllerTest extends WebTestCase
{
    private KernelBrowser $client;
    private EntityManagerInterface $manager;
    private EntityRepository $repository;
    private string $path = '/tab/';

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->manager = static::getContainer()->get('doctrine')->getManager();
        $this->repository = $this->manager->getRepository(Tab::class);

        foreach ($this->repository->findAll() as $object) {
            $this->manager->remove($object);
        }

        $this->manager->flush();
    }

    public function testIndex(): void
    {
        $this->client->followRedirects();
        $crawler = $this->client->request('GET', $this->path);

        self::assertResponseStatusCodeSame(200);
        self::assertPageTitleContains('Tab index');

        // Use the $crawler to perform additional assertions e.g.
        // self::assertSame('Some text on the page', $crawler->filter('.p')->first());
    }

    public function testNew(): void
    {
        $this->markTestIncomplete();
        $this->client->request('GET', sprintf('%snew', $this->path));

        self::assertResponseStatusCodeSame(200);

        $this->client->submitForm('Save', [
            'tab[name]' => 'Testing',
            'tab[songKey]' => 'Testing',
            'tab[capo]' => 'Testing',
            'tab[content]' => 'Testing',
            'tab[artist]' => 'Testing',
        ]);

        self::assertResponseRedirects($this->path);

        self::assertSame(1, $this->repository->count([]));
    }

    public function testShow(): void
    {
        $this->markTestIncomplete();
        $fixture = new Tab();
        $fixture->setName('My Title');
        $fixture->setSongKey(SongKey::A);
        $fixture->setCapo('My Title');
        $fixture->setContent('My Title');
        $fixture->setArtist(new Artist());

        $this->manager->persist($fixture);
        $this->manager->flush();

        $this->client->request('GET', sprintf('%s%s', $this->path, $fixture->getId()));

        self::assertResponseStatusCodeSame(200);
        self::assertPageTitleContains('Tab');

        // Use assertions to check that the properties are properly displayed.
    }

    public function testEdit(): void
    {
        $this->markTestIncomplete();
        $fixture = new Tab();
        $fixture->setName('Value');
        $fixture->setSongKey(SongKey::A);
        $fixture->setCapo('Value');
        $fixture->setContent('Value');
        $fixture->setArtist(new Artist());

        $this->manager->persist($fixture);
        $this->manager->flush();

        $this->client->request('GET', sprintf('%s%s/edit', $this->path, $fixture->getId()));

        $this->client->submitForm('Update', [
            'tab[name]' => 'Something New',
            'tab[songKey]' => 'Something New',
            'tab[capo]' => 'Something New',
            'tab[content]' => 'Something New',
            'tab[artist]' => 'Something New',
        ]);

        self::assertResponseRedirects('/tab/');

        $fixture = $this->repository->findAll();

        self::assertSame('Something New', $fixture[0]->getName());
        self::assertSame('Something New', $fixture[0]->getSongKey());
        self::assertSame('Something New', $fixture[0]->getCapo());
        self::assertSame('Something New', $fixture[0]->getContent());
        self::assertSame('Something New', $fixture[0]->getArtist());
    }

    public function testRemove(): void
    {
        $this->markTestIncomplete();
        $fixture = new Tab();
        $fixture->setName('Value');
        $fixture->setSongKey(SongKey::A);
        $fixture->setCapo('Value');
        $fixture->setContent('Value');
        $fixture->setArtist(new Artist());

        $this->manager->persist($fixture);
        $this->manager->flush();

        $this->client->request('GET', sprintf('%s%s', $this->path, $fixture->getId()));
        $this->client->submitForm('Delete');

        self::assertResponseRedirects('/tab/');
        self::assertSame(0, $this->repository->count([]));
    }
}
