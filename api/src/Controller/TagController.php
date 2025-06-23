<?php

namespace App\Controller;

use App\Entity\Tag;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\TagRepository;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/tag')]
final class TagController extends AbstractController
{
    #[Route('', name: 'app_tag_get_all', methods: ['GET'])]
    public function getAll(TagRepository $tagRepository, SerializerInterface $serializer): JsonResponse
    {
        $tags = $tagRepository->findAll();

        $jsonResponse = $serializer->serialize([
            'data' => $tags
        ], 'json');

        return JsonResponse::fromJsonString($jsonResponse);
    }

    #[Route('/{id}', name: 'app_tag_get_by_id', methods: ['GET'])]
    public function getById(int $id, TagRepository $tagRepository, SerializerInterface $serializer): JsonResponse
    {
        $tag = $tagRepository->find($id);

        if (null === $tag) {
            throw $this->createNotFoundException();
        }

        $jsonResponse = $serializer->serialize([
            'data' => $tag
        ], 'json');

        return JsonResponse::fromJsonString($jsonResponse);
    }

    #[Route('', name: 'app_tag_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $requestContent = $request->toArray();

        $tag = new Tag();
        $tag->setName($requestContent['name']);

        $entityManager->persist($tag);
        $entityManager->flush();

        $jsonResponse = $serializer->serialize([
            'data' => $tag,
            'message' => 'Tag created successfully'
        ], 'json');

        return JsonResponse::fromJsonString($jsonResponse);
    }

    #[Route('/{id}', name: 'app_tag_update', methods: ['PUT'])]
    public function update(int $id, TagRepository $tagRepository, Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $tag = $tagRepository->find($id);

        if (null === $tag) {
            throw $this->createNotFoundException();
        }

        $requestContent = $request->toArray();

        $tag->setName($requestContent['name'] ?? $tag->getName());

        $entityManager->persist($tag);
        $entityManager->flush();

        $jsonResponse = $serializer->serialize([
            'data' => $tag,
            'message' => 'Tag created successfully'
        ], 'json');

        return JsonResponse::fromJsonString($jsonResponse);
    }

    #[Route('/{id}', name: 'app_tag_delete', methods: ['DELETE'])]
    public function delete(int $id, TagRepository $tagRepository, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $tag = $tagRepository->find($id);

        if (null === $tag) {
            throw $this->createNotFoundException();
        }

        $entityManager->remove($tag);
        $entityManager->flush();

        $jsonResponse = $serializer->serialize([
            'message' => 'Tag deleted successfully'
        ], 'json');

        return JsonResponse::fromJsonString($jsonResponse);
    }
}
