<?php

namespace App\Controller;

use App\Entity\Artist;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\ArtistRepository;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/artist')]
final class ArtistController extends AbstractController
{
    #[Route('', name: 'app_artist_get_all', methods: ['GET'])]
    public function getAll(ArtistRepository $artistRepository, SerializerInterface $serializer): JsonResponse
    {
        $artists = $artistRepository->findAll();

        $jsonResponse = $serializer->serialize([
            'data' => $artists
        ], 'json');

        return JsonResponse::fromJsonString($jsonResponse);
    }

    #[Route('/{id}', name: 'app_artist_get_by_id', methods: ['GET'])]
    public function getById(Artist $artist, SerializerInterface $serializer): JsonResponse
    {
        $jsonResponse = $serializer->serialize([
            'data' => $artist
        ], 'json');

        return JsonResponse::fromJsonString($jsonResponse);
    }

    #[Route('', name: 'app_artist_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $requestContent = $request->toArray();

        $artist = new Artist();
        $artist->setName($requestContent['name']);

        $entityManager->persist($artist);
        $entityManager->flush();

        $jsonResponse = $serializer->serialize([
            'data' => $artist,
            'message' => 'Artist created successfully'
        ], 'json');

        return JsonResponse::fromJsonString($jsonResponse);
    }

    #[Route('/{id}', name: 'app_artist_update', methods: ['PUT'])]
    public function update(Artist $artist, Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $requestContent = $request->toArray();

        $artist->setName($requestContent['name'] ?? $artist->getName());

        $entityManager->persist($artist);
        $entityManager->flush();

        $jsonResponse = $serializer->serialize([
            'data' => $artist,
            'message' => 'Artist created successfully'
        ], 'json');

        return JsonResponse::fromJsonString($jsonResponse);
    }

    #[Route('/{id}', name: 'app_artist_delete', methods: ['DELETE'])]
    public function delete(Artist $artist, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $entityManager->remove($artist);
        $entityManager->flush();

        $jsonResponse = $serializer->serialize([
            'message' => 'Artist deleted successfully'
        ], 'json');

        return JsonResponse::fromJsonString($jsonResponse);
    }
}
