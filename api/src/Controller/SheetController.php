<?php

namespace App\Controller;

use App\Dto\Request\CreateSheetRequestDto;
use App\Dto\Request\UpdateSheetRequestDto;
use App\Dto\SheetDto;
use App\Service\FormatService;
use App\Service\TransposeService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\SheetRepository;
use App\Service\SheetHandler;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
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
        #[MapRequestPayload('json')] CreateSheetRequestDto $requestPayload,
        SheetHandler $sheetHandler
    ): JsonResponse {
        $sheet = $sheetHandler->createSheet($requestPayload);

        $sheetPayload = SheetDto::fromSheet($sheet);
        return $this->json([
            'message' => 'Sheet created successfully',
            'content' => $sheetPayload->toArray(),
        ]);
    }

    #[Route('/{id}', name: 'app_tabs_update', methods: ['PUT'])]
    public function update(
        int $id,
        #[MapRequestPayload('json')] UpdateSheetRequestDto $requestPayload,
        SheetHandler $sheetHandler
    ): JsonResponse {
        $sheet = $sheetHandler->updateSheet($id, $requestPayload);

        $sheetPayload = SheetDto::fromSheet($sheet);
        return $this->json([
            'message' => 'Sheet updated successfully',
            'content' => $sheetPayload->toArray(),
        ]);
    }

    #[Route('/{id}', name: 'app_sheets_delete', methods: ['DELETE'])]
    public function delete(int $id, SheetHandler $sheetHandler): JsonResponse
    {
        $sheetHandler->deleteSheetById($id);

        return $this->json([
            'message' => 'Sheet deleted successfully',
        ]);
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
