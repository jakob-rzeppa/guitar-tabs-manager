<?php

namespace App\Controller;

use App\Entity\Tab;
use App\Repository\ArtistRepository;
use App\Repository\TagRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\TabRepository;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/tab')]
final class TabController extends AbstractController
{
    #[Route('', name: 'app_tab_get_all', methods: ['GET'])]
    public function getAll(TabRepository $tabRepository, SerializerInterface $serializer): JsonResponse
    {
        $tabs = $tabRepository->findAll();

        $reducedTabs = [];

        foreach ($tabs as $tab) {
            $artist = $tab->getArtist() !== null ? [
                'id' => $tab->getArtist()->getId(),
                'name' => $tab->getArtist()->getName(),
            ] : null;

            $tags = [];
            foreach ($tab->getTags() as $tag) {
                $tags[] = [
                    'id' => $tag->getId(),
                    'name' => $tag->getName()
                ];
            }

            $reducedTabs[] = [
                'id' => $tab->getId(),
                'title' => $tab->getTitle(),
                'artist' => $artist,
                'tags' => $tags
            ];
        }

        $jsonResponse = $serializer->serialize([
            'content' => $reducedTabs,
        ], 'json');

        return JsonResponse::fromJsonString($jsonResponse);
    }

    #[Route('/{id}', name: 'app_tab_get_by_id', methods: ['GET'])]
    public function getById(int $id, TabRepository $tabRepository, SerializerInterface $serializer): JsonResponse
    {
        $tab = $tabRepository->find($id);

        if (null === $tab) {
            throw $this->createNotFoundException();
        }

        $artist = $tab->getArtist() !== null ? [
            'id' => $tab->getArtist()->getId(),
            'name' => $tab->getArtist()->getName(),
        ] : null;

        $tags = [];
        foreach ($tab->getTags() as $tag) {
            $tags[] = [
                'id' => $tag->getId(),
                'name' => $tag->getName()
            ];
        }

        $jsonResponse = $serializer->serialize([
            'content' => [
                'id' => $tab->getId(),
                'title' => $tab->getTitle(),
                'tags' => $tags,
                'artist' => $artist,
                'capo' => $tab->getCapo(),
                'content' => $tab->getContent()
            ]
        ], 'json');

        return JsonResponse::fromJsonString($jsonResponse);
    }

    #[Route('', name: 'app_tab_create', methods: ['POST'])]
    public function create(
        Request $request,
        ArtistRepository $artistRepository,
        TagRepository $tagRepository,
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer): JsonResponse
    {
        $requestContent = $request->toArray();

        $tab = new Tab();
        $tab->setTitle($requestContent['title']);
        $tab->setContent($requestContent['content']);
        $tab->setCapo($requestContent['capo']);

        $artistId = $requestContent['artist_id'] ?? null;
        if ($artistId !== null) {
            $artist = $artistRepository->find($artistId);

            $tab->setArtist($artist);
        }

        $tagIds = $requestContent['tag_ids'] ?? null;
        if ($tagIds !== null) {
            $tab->getTags()->clear();

            $tags = $tagRepository->findBy(['id' => $tagIds]);
            foreach ($tags as $tag) {
                $tab->addTag($tag);
            }
        }

        $entityManager->persist($tab);
        $entityManager->flush();

        $artist = $tab->getArtist() !== null ? [
            'id' => $tab->getArtist()->getId(),
            'name' => $tab->getArtist()->getName(),
        ] : null;

        $tags = [];
        foreach ($tab->getTags() as $tag) {
            $tags[] = [
                'id' => $tag->getId(),
                'name' => $tag->getName()
            ];
        }

        $jsonResponse = $serializer->serialize([
            'content' => [
                'id' => $tab->getId(),
                'title' => $tab->getTitle(),
                'tags' => $tags,
                'artist' => $artist,
                'capo' => $tab->getCapo(),
                'content' => $tab->getContent()
            ]
        ], 'json');

        return JsonResponse::fromJsonString($jsonResponse);
    }

    #[Route('/{id}', name: 'app_tab_update', methods: ['PUT'])]
    public function update(
        int $id,
        TabRepository $tabRepository,
        ArtistRepository $artistRepository,
        TagRepository $tagRepository,
        Request $request,
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer
    ): JsonResponse
    {
        $tab = $tabRepository->find($id);

        if (null === $tab) {
            throw $this->createNotFoundException();
        }

        $requestContent = $request->toArray();

        $tab->setTitle($requestContent['title'] ?? $tab->getTitle());
        $tab->setContent($requestContent['content'] ?? $tab->getContent());
        $tab->setCapo($requestContent['capo'] ?? $tab->getCapo());

        $artistId = $requestContent['artist_id'] ?? null;
        if ($artistId !== null) {
            $artist = $artistRepository->find($artistId);

            $tab->setArtist($artist);
        }

        $tagIds = $requestContent['tag_ids'] ?? null;
        if ($tagIds !== null) {
            $tab->getTags()->clear();

            $tags = $tagRepository->findBy(['id' => $tagIds]);
            foreach ($tags as $tag) {
                $tab->addTag($tag);
            }
        }

        $entityManager->persist($tab);
        $entityManager->flush();

        $artist = $tab->getArtist() !== null ? [
            'id' => $tab->getArtist()->getId(),
            'name' => $tab->getArtist()->getName(),
        ] : null;

        $tags = [];
        foreach ($tab->getTags() as $tag) {
            $tags[] = [
                'id' => $tag->getId(),
                'name' => $tag->getName()
            ];
        }

        $jsonResponse = $serializer->serialize([
            'content' => [
                'id' => $tab->getId(),
                'title' => $tab->getTitle(),
                'tags' => $tags,
                'artist' => $artist,
                'capo' => $tab->getCapo(),
                'content' => $tab->getContent()
            ]
        ], 'json');

        return JsonResponse::fromJsonString($jsonResponse);
    }

    #[Route('/{id}', name: 'app_tab_delete', methods: ['DELETE'])]
    public function delete(int $id, TabRepository $tabRepository, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $tab = $tabRepository->find($id);

        if (null === $tab) {
            throw $this->createNotFoundException();
        }

        $entityManager->remove($tab);
        $entityManager->flush();

        $jsonResponse = $serializer->serialize([
            'message' => 'Tab deleted successfully'
        ], 'json');

        return JsonResponse::fromJsonString($jsonResponse);
    }
}
