<?php

namespace App\Tests\Controller;

use App\Entity\Tab;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class TabControllerTest extends WebTestCase
{
    private KernelBrowser $client;
    private EntityManagerInterface $manager;
    private EntityRepository $tabRepository;
    private string $path = '/tab/';

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->manager = static::getContainer()->get('doctrine')->getManager();
        $this->tabRepository = $this->manager->getRepository(Tab::class);

        foreach ($this->tabRepository->findAll() as $object) {
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
            'tab[title]' => 'Testing',
            'tab[capo]' => 'Testing',
            'tab[content]' => 'Testing',
        ]);

        self::assertResponseRedirects($this->path);

        self::assertSame(1, $this->tabRepository->count([]));
    }

    public function testShow(): void
    {
        $this->markTestIncomplete();
        $fixture = new Tab();
        $fixture->setTitle('My Title');
        $fixture->setCapo('My Title');
        $fixture->setContent('My Title');

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
        $fixture->setTitle('Value');
        $fixture->setCapo('Value');
        $fixture->setContent('Value');

        $this->manager->persist($fixture);
        $this->manager->flush();

        $this->client->request('GET', sprintf('%s%s/edit', $this->path, $fixture->getId()));

        $this->client->submitForm('Update', [
            'tab[title]' => 'Something New',
            'tab[capo]' => 'Something New',
            'tab[content]' => 'Something New',
        ]);

        self::assertResponseRedirects('/tab/');

        $fixture = $this->tabRepository->findAll();

        self::assertSame('Something New', $fixture[0]->getTitle());
        self::assertSame('Something New', $fixture[0]->getCapo());
        self::assertSame('Something New', $fixture[0]->getContent());
    }

    public function testRemove(): void
    {
        $this->markTestIncomplete();
        $fixture = new Tab();
        $fixture->setTitle('Value');
        $fixture->setCapo('Value');
        $fixture->setContent('Value');

        $this->manager->persist($fixture);
        $this->manager->flush();

        $this->client->request('GET', sprintf('%s%s', $this->path, $fixture->getId()));
        $this->client->submitForm('Delete');

        self::assertResponseRedirects('/tab/');
        self::assertSame(0, $this->tabRepository->count([]));
    }
}
