<?php

namespace App\Controller;

use App\Entity\Sheet;
use App\Repository\ArtistRepository;
use App\Repository\TagRepository;
use App\Service\FormatService;
use App\Service\TransposeService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\SheetRepository;
use App\Service\SheetHandler;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/sheets')]
final class SheetController extends AbstractController
{
    #[Route('', name: 'app_sheets_get_all', methods: ['GET'])]
    public function getAll(SheetHandler $sheetHandler, SerializerInterface $serializer): JsonResponse
    {
        $sheets = $sheetHandler->getWithLessDetailsAllSheets();

        return JsonResponse::fromJsonString($serializer->serialize([
            'content' => $sheets,
        ], 'json'));
    }

    #[Route('/{id}', name: 'app_sheets_get_by_id', methods: ['GET'])]
    public function getById(int $id, SheetRepository $sheetRepository, SerializerInterface $serializer): JsonResponse
    {
        $sheet = $sheetRepository->find($id);

        if (null === $sheet) {
            throw $this->createNotFoundException();
        }

        $artist = $sheet->getArtist() !== null ? [
            'id' => $sheet->getArtist()->getId(),
            'name' => $sheet->getArtist()->getName(),
        ] : null;

        $tags = [];
        foreach ($sheet->getTags() as $tag) {
            $tags[] = [
                'id' => $tag->getId(),
                'name' => $tag->getName()
            ];
        }

        return JsonResponse::fromJsonString($serializer->serialize([
            'content' => [
                'id' => $sheet->getId(),
                'title' => $sheet->getTitle(),
                'tags' => $tags,
                'artist' => $artist,
                'capo' => $sheet->getCapo(),
                'source_url' => $sheet->getSourceURL(),
                'content' => $sheet->getContent()
            ]
        ], 'json'));
    }

    #[Route('', name: 'app_tabs_create', methods: ['POST'])]
    public function create(
        Request $request,
        ArtistRepository $artistRepository,
        TagRepository $tagRepository,
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer
    ): JsonResponse {
        $requestContent = $request->toArray();

        $sheet = new Sheet();
        $sheet->setTitle($requestContent['title']);
        $sheet->setContent($requestContent['content']);
        $sheet->setCapo($requestContent['capo']);
        $sheet->setSourceURL($requestContent['source_url']);

        $artistId = $requestContent['artist_id'] ?? null;
        if ($artistId !== null) {
            $artist = $artistRepository->find($artistId);

            $sheet->setArtist($artist);
        }

        $tagIds = $requestContent['tag_ids'] ?? null;
        if ($tagIds !== null) {
            $sheet->getTags()->clear();

            $tags = $tagRepository->findBy(['id' => $tagIds]);
            foreach ($tags as $tag) {
                $sheet->addTag($tag);
            }
        }

        $entityManager->persist($sheet);
        $entityManager->flush();

        $artist = $sheet->getArtist() !== null ? [
            'id' => $sheet->getArtist()->getId(),
            'name' => $sheet->getArtist()->getName(),
        ] : null;

        $tags = [];
        foreach ($sheet->getTags() as $tag) {
            $tags[] = [
                'id' => $tag->getId(),
                'name' => $tag->getName()
            ];
        }

        return JsonResponse::fromJsonString($serializer->serialize([
            'content' => [
                'id' => $sheet->getId(),
                'title' => $sheet->getTitle(),
                'tags' => $tags,
                'artist' => $artist,
                'capo' => $sheet->getCapo(),
                'source_url' => $sheet->getSourceURL(),
                'content' => $sheet->getContent()
            ]
        ], 'json'));
    }

    #[Route('/{id}', name: 'app_tabs_update', methods: ['PUT'])]
    public function update(
        int $id,
        SheetRepository $sheetRepository,
        ArtistRepository $artistRepository,
        TagRepository $tagRepository,
        Request $request,
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer
    ): JsonResponse {
        $sheet = $sheetRepository->find($id);

        if (null === $sheet) {
            throw $this->createNotFoundException();
        }

        $requestContent = $request->toArray();

        $sheet->setTitle($requestContent['title'] ?? $sheet->getTitle());
        $sheet->setContent($requestContent['content'] ?? $sheet->getContent());
        $sheet->setCapo($requestContent['capo'] ?? $sheet->getCapo());
        $sheet->setSourceURL($requestContent['source_url'] ?? $sheet->getSourceURL());

        $artistId = $requestContent['artist_id'] ?? null;
        if ($artistId !== null) {
            $artist = $artistRepository->find($artistId);

            $sheet->setArtist($artist);
        }

        $tagIds = $requestContent['tag_ids'] ?? null;
        if ($tagIds !== null) {
            $sheet->getTags()->clear();

            $tags = $tagRepository->findBy(['id' => $tagIds]);
            foreach ($tags as $tag) {
                $sheet->addTag($tag);
            }
        }

        $entityManager->persist($sheet);
        $entityManager->flush();

        $artist = $sheet->getArtist() !== null ? [
            'id' => $sheet->getArtist()->getId(),
            'name' => $sheet->getArtist()->getName(),
        ] : null;

        $tags = [];
        foreach ($sheet->getTags() as $tag) {
            $tags[] = [
                'id' => $tag->getId(),
                'name' => $tag->getName()
            ];
        }

        return JsonResponse::fromJsonString($serializer->serialize([
            'content' => [
                'id' => $sheet->getId(),
                'title' => $sheet->getTitle(),
                'tags' => $tags,
                'artist' => $artist,
                'capo' => $sheet->getCapo(),
                'source_url' => $sheet->getSourceURL(),
                'content' => $sheet->getContent()
            ]
        ], 'json'));
    }

    #[Route('/{id}', name: 'app_sheets_delete', methods: ['DELETE'])]
    public function delete(int $id, SheetRepository $sheetRepository, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $sheet = $sheetRepository->find($id);

        if (null === $sheet) {
            throw $this->createNotFoundException();
        }

        $entityManager->remove($sheet);
        $entityManager->flush();

        return JsonResponse::fromJsonString($serializer->serialize([
            'message' => 'Sheet deleted successfully'
        ], 'json'));
    }

    #[Route('/format', name: 'app_sheets_format', methods: ['POST'])]
    public function format(Request $request, FormatService $formatService, SerializerInterface $serializer): JsonResponse
    {
        $requestContent = $request->toArray();

        $sheetContent = $requestContent['content'];
        $sheetContent = $formatService->formatSheet($sheetContent);

        return JsonResponse::fromJsonString($serializer->serialize([
            'content' => [
                'content' => $sheetContent
            ]
        ], 'json'));
    }

    #[Route('/transpose', name: 'app_sheets_transpose', methods: ['POST'])]
    public function transpose(Request $request, TransposeService $transposeService, SerializerInterface $serializer): JsonResponse
    {
        $requestContent = $request->toArray();

        $sheetContent = $requestContent['content'];
        $dir = $requestContent['dir'];

        $sheetContent = $transposeService->transposeSheet($sheetContent, $dir);

        return JsonResponse::fromJsonString($serializer->serialize([
            'content' => [
                'content' => $sheetContent
            ]
        ], 'json'));
    }
}
