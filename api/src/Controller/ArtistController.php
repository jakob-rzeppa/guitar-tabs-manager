<?php

namespace App\Controller;

use App\Entity\Artist;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\ArtistRepository;
use App\Service\TabHandler;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/artists')]
final class ArtistController extends AbstractController
{
    #[Route('', name: 'app_artists_get_all', methods: ['GET'])]
    public function getAll(ArtistRepository $artistRepository, SerializerInterface $serializer): JsonResponse
    {
        $artists = $artistRepository->findAll();

        $reducedArtists = [];

        foreach ($artists as $artist) {
            $reducedArtists[] = [
                'id' => $artist->getId(),
                'name' => $artist->getName(),
            ];
        }

        $jsonResponse = $serializer->serialize([
            'content' => $reducedArtists,
        ], 'json');

        return JsonResponse::fromJsonString($jsonResponse);
    }

    #[Route('/{id}', name: 'app_artists_get_by_id', methods: ['GET'])]
    public function getById(int $id, ArtistRepository $artistRepository, SerializerInterface $serializer): JsonResponse
    {
        $artist = $artistRepository->find($id);

        if (null === $artist) {
            throw $this->createNotFoundException();
        }

        $jsonResponse = $serializer->serialize([
            'content' => $artist
        ], 'json');

        return JsonResponse::fromJsonString($jsonResponse);
    }

    #[Route('', name: 'app_artists_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $requestContent = $request->toArray();

        $artist = new Artist();
        $artist->setName($requestContent['name']);

        $entityManager->persist($artist);
        $entityManager->flush();

        $jsonResponse = $serializer->serialize([
            'content' => $artist,
            'message' => 'Artist created successfully'
        ], 'json');

        return JsonResponse::fromJsonString($jsonResponse);
    }

    #[Route('/{id}', name: 'app_artists_update', methods: ['PUT'])]
    public function update(int $id, Request $request, ArtistRepository $artistRepository, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $artist = $artistRepository->find($id);

        if (null === $artist) {
            throw $this->createNotFoundException();
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['name'])) {
            $artist->setName($data['name']);
        }

        $entityManager->flush();

        // Manually construct response to avoid circular reference
        $responseData = [
            'id' => $artist->getId(),
            'name' => $artist->getName()
        ];

        $jsonResponse = $serializer->serialize($responseData, 'json');

        return JsonResponse::fromJsonString($jsonResponse);
    }

    #[Route('/{id}', name: 'app_artists_delete', methods: ['DELETE'])]
    public function delete(int $id, ArtistRepository $artistRepository, EntityManagerInterface $entityManager, SerializerInterface $serializer, TabHandler $tabHandler): JsonResponse
    {
        $artist = $artistRepository->find($id);

        if (null === $artist) {
            throw $this->createNotFoundException();
        }

        $tabHandler->deleteArtistFromAllTabs($artist->getId());

        $entityManager->remove($artist);
        $entityManager->flush();

        $jsonResponse = $serializer->serialize([
            'message' => 'Artist deleted successfully'
        ], 'json');

        return JsonResponse::fromJsonString($jsonResponse);
    }
}
