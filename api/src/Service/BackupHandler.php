<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;

class BackupHandler
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {}

    public function createBackupString(): string
    {
        $classMetadataArray = $this->entityManager->getMetadataFactory()->getAllMetadata();

        $data = [];

        // Each classMetadata represents an entity
        foreach ($classMetadataArray as $classMetadata) {
            $entityName = $classMetadata->getName();

            $rows = $this->entityManager->createQueryBuilder()
                ->select('e')
                ->from($entityName, 'e')
                ->getQuery()
                ->getArrayResult();

            $data[$entityName] = $rows;
        }

        return json_encode($data);
    }

    public function restoreFromBackupString(string $backupString, bool $force = false): void
    {
        $data = json_decode($backupString, true);

        foreach ($data as $entityName => $rows) {
            $metadata = $this->entityManager->getClassMetadata($entityName);
            $tableName = $metadata->getTableName();

            // Delete all existing records if force is true
            if ($force) {
                $this->entityManager->getConnection()->executeStatement(
                    "DELETE FROM " . $tableName
                );
            }

            foreach ($rows as $rowData) {
                // Map property names to column names
                $columnData = [];
                foreach ($rowData as $fieldName => $value) {
                    $columnName = $metadata->getColumnName($fieldName);
                    $columnData[$columnName] = $value;
                }

                $this->entityManager->getConnection()->insert($tableName, $columnData);
            }
        }

        $this->entityManager->flush();
    }
}
