<?php

namespace App\Controller;

use App\Service\BackupHandler;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/backups')]
final class BackupController extends AbstractController
{
    #[Route('', name: 'app_backups_get', methods: ['GET'])]
    public function getBackups(BackupHandler $backupHandler): JsonResponse
    {
        $backupString = $backupHandler->createBackupString();

        return $this->json([
            'message' => 'Backup created successfully',
            'payload' => $backupString
        ]);
    }

    #[Route('', name: 'app_backups_post', methods: ['POST'])]
    public function postBackups(Request $request, BackupHandler $backupHandler): JsonResponse
    {
        $requestContent = $request->getContent();
        $backupHandler->restoreFromBackupString($requestContent, true);

        return $this->json([
            'message' => 'Backup restored successfully'
        ]);
    }
}
