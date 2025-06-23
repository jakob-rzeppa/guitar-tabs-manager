<?php

namespace App\Controller;

use App\Entity\Tab;
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

        $jsonResponse = $serializer->serialize([
            'data' => $tabs
        ], 'json');

        return JsonResponse::fromJsonString($jsonResponse);
    }

    #[Route('/{id}', name: 'app_tab_get_by_id', methods: ['GET'])]
    public function getById(Tab $tab, SerializerInterface $serializer): JsonResponse
    {
        $jsonResponse = $serializer->serialize([
            'data' => $tab
        ], 'json');

        return JsonResponse::fromJsonString($jsonResponse);
    }

    #[Route('', name: 'app_tab_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $requestContent = $request->toArray();

        $tab = new Tab();
        $tab->setTitle($requestContent['title']);
        $tab->setContent($requestContent['content']);
        $tab->setCapo($requestContent['capo']);

        $entityManager->persist($tab);
        $entityManager->flush();

        $jsonResponse = $serializer->serialize([
            'data' => $tab,
            'message' => 'Tab created successfully'
        ], 'json');

        return JsonResponse::fromJsonString($jsonResponse);
    }

    #[Route('/{id}', name: 'app_tab_update', methods: ['PUT'])]
    public function update(Tab $tab, Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $requestContent = $request->toArray();

        $tab->setTitle($requestContent['title'] ?? $tab->getTitle());
        $tab->setContent($requestContent['content'] ?? $tab->getContent());
        $tab->setCapo($requestContent['capo'] ?? $tab->getCapo());

        $entityManager->persist($tab);
        $entityManager->flush();

        $jsonResponse = $serializer->serialize([
            'data' => $tab,
            'message' => 'Tab created successfully'
        ], 'json');

        return JsonResponse::fromJsonString($jsonResponse);
    }

    #[Route('/{id}', name: 'app_tab_delete', methods: ['DELETE'])]
    public function delete(Tab $tab, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $entityManager->remove($tab);
        $entityManager->flush();

        $jsonResponse = $serializer->serialize([
            'message' => 'Tab deleted successfully'
        ], 'json');

        return JsonResponse::fromJsonString($jsonResponse);
    }
}
