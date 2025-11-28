<?php

namespace App\Controller;

use App\Dto\Request\CreateSheetRequestDto;
use App\Dto\Request\UpdateSheetRequestDto;
use App\Dto\SheetDto;
use App\Service\FormatService;
use App\Service\TransposeService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\SheetRepository;
use App\Service\SheetHandler;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;

#[Route('/sheets')]
final class SheetController extends AbstractController
{
    #[Route('', name: 'app_sheets_get_all', methods: ['GET'])]
    public function getAll(SheetHandler $sheetHandler): JsonResponse
    {
        $sheets = $sheetHandler->getWithLessDetailsAllSheets();

        return $this->json([
            'payload' => $sheets,
        ]);
    }

    #[Route('/{id}', name: 'app_sheets_get_by_id', methods: ['GET'])]
    public function getById(int $id, SheetRepository $sheetRepository): JsonResponse
    {
        $sheet = $sheetRepository->find($id);

        if (null === $sheet) {
            throw $this->createNotFoundException();
        }

        $sheetPayload = SheetDto::fromSheet($sheet);
        return $this->json([
            'payload' => $sheetPayload->toArray(),
        ]);
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
            'payload' => $sheetPayload->toArray(),
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
            'payload' => $sheetPayload->toArray(),
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
    public function format(Request $request, FormatService $formatService): JsonResponse
    {
        $requestContent = $request->toArray();

        $sheetContent = $requestContent['content'];
        $sheetContent = $formatService->formatSheet($sheetContent);

        return $this->json([
            'payload' => [
                'content' => $sheetContent
            ]
        ]);
    }

    #[Route('/transpose', name: 'app_sheets_transpose', methods: ['POST'])]
    public function transpose(Request $request, TransposeService $transposeService): JsonResponse
    {
        $requestContent = $request->toArray();

        $sheetContent = $requestContent['content'];
        $dir = $requestContent['dir'];

        $sheetContent = $transposeService->transposeSheet($sheetContent, $dir);

        return $this->json([
            'payload' => [
                'content' => $sheetContent
            ]
        ]);
    }
}
