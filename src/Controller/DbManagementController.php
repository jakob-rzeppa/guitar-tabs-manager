<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

use Doctrine\DBAL\Connection;

final class DbManagementController extends AbstractController
{
    public function __construct(private Connection $conn) {}

    #[Route('/admin/db', name: 'app_admin_db_index')]
    public function index(): Response
    {
        return $this->render('app/db_management/index.html.twig', [
            'controller_name' => 'DbManagementController',
            'show_admin_link' => $this->isGranted('ROLE_ADMIN'),
        ]);
    }

    #[Route('/admin/db/save', name: 'app_admin_db_save', methods: ['GET'])]
    public function save(): Response
    {
        // Get all table names
        $schemaManager = $this->conn->createSchemaManager();
        $tables = $schemaManager->listTableNames();

        // Build a dependency graph based on foreign keys
        $dependencies = [];
        foreach ($tables as $table) {
            $dependencies[$table] = [];
            $foreignKeys = $schemaManager->listTableForeignKeys($table);
            foreach ($foreignKeys as $fk) {
                $referencedTable = $fk->getForeignTableName();
                if (in_array($referencedTable, $tables, true)) {
                    $dependencies[$table][] = $referencedTable;
                }
            }
        }

        // Topological sort to resolve insert order
        $orderedTables = [];
        $visited = [];
        $visit = function ($table) use (&$visit, &$visited, &$orderedTables, $dependencies) {
            if (isset($visited[$table])) {
                return;
            }
            $visited[$table] = true;
            foreach ($dependencies[$table] as $dep) {
                $visit($dep);
            }
            $orderedTables[] = $table;
        };
        foreach ($tables as $table) {
            $visit($table);
        }

        // Create a JSON representation of the database content
        $data = [];
        foreach ($orderedTables as $table) {
            // Fetch all rows from the table
            $rows = $this->conn->fetchAllAssociative("SELECT * FROM `$table`");
            if (!empty($rows)) {
                $data[$table] = $rows;
            }
        }
        $tablesArray = [];
        foreach ($data as $tableName => $tableContent) {
            $tablesArray[] = [
                'table_name' => $tableName,
                'content' => $tableContent,
            ];
        }
        $content = ['tables' => $tablesArray];

        // Create a JsonResponse with the content
        $response = new JsonResponse($content, 200, [
            'Content-Disposition' => 'attachment; filename="database-save.json"',
        ]);

        return $response;
    }
}
