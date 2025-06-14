<?php

namespace App\Controller;

use App\Service\BackupService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

final class DbManagementController extends AbstractController
{
    #[Route('/admin/db', name: 'app_admin_db_index')]
    public function index(): Response
    {
        return $this->render('app/db_management/index.html.twig', [
            'controller_name' => 'DbManagementController',
        ]);
    }

    #[Route('/admin/db/save', name: 'app_admin_db_save', methods: ['GET'])]
    public function save(BackupService $backupService): Response
    {
        $backup = $backupService->createBackup();

        // Create a JsonResponse with the backup
        $response = new JsonResponse($backup, 200, [
            'Content-Disposition' => 'attachment; filename="database-save.json"',
        ]);

        return $response;
    }

    #[Route('/admin/db/restore', name: 'app_admin_db_restore')]
    public function restore(Request $request, BackupService $backupService): Response
    {
        $JSONBackupData = $request->request->get('json_backup');

        $backupData = json_decode($JSONBackupData, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return new Response('Invalid JSON data provided.', 400);
        }

        $backupService->restoreFromBackup($backupData);

        return new Response('Database restored successfully.', 200);
    }
}
