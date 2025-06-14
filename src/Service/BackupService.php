<?php

namespace App\Service;

use Doctrine\DBAL\Connection;

class BackupService
{
    public function __construct(private Connection $conn) {}

    /**
     * @return array{tables: array<int, array{table_name: string, content: array<int, array<string, mixed>>}>}
     */
    public function createBackup(): array
    {
        $orderedTables = $this->getOrderedTables('default_table');

        $tablesArray = $this->createArrayDatabaseRepresentation($orderedTables);

        return ['tables' => $tablesArray];
    }

    public function restoreFromBackup(array $backupData): void
    {
        // Clear existing data in the tables
        $schemaManager = $this->conn->createSchemaManager();
        $tables = $schemaManager->listTableNames();

        foreach ($tables as $table) {
            $this->conn->executeStatement("DELETE FROM `$table`");
        }

        // Insert data from the backup
        foreach ($backupData['tables'] as $tableData) {
            $tableName = $tableData['table_name'];
            foreach ($tableData['content'] as $row) {
                $this->conn->insert($tableName, $row);
            }
        }
    }

    /**
     * Create an array representation of the database tables and their contents.
     *
     * @param array<int, string> $orderedTables An array of table names ordered by dependencies.
     * @return array<int, array{table_name: string, content: array<int, array<string, mixed>>}>
     */
    private function createArrayDatabaseRepresentation(array $orderedTables): array
    {
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

        return $tablesArray;
    }

    /**
     * Get the ordered tables based on foreign key dependencies.
     *
     * @return array<int, string> An array of table names ordered by their dependencies.
     */
    private function getOrderedTables(): array
    {
        // Get all table names and foreign key dependencies using schemaManager
        $schemaManager = $this->conn->createSchemaManager();
        $tables = $schemaManager->listTableNames();

        // Build a dependency graph based on foreign keys
        $dependencies = [];
        $foreignKeysMap = [];
        foreach ($tables as $table) {
            $foreignKeysMap[$table] = $schemaManager->listTableForeignKeys($table);
        }

        foreach ($tables as $table) {
            $dependencies[$table] = [];
            foreach ($foreignKeysMap[$table] as $fk) {
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

        return $orderedTables;
    }
}
