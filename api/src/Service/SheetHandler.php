<?php

namespace App\Service;

use App\Repository\SheetRepository;
use Doctrine\ORM\EntityManagerInterface;

class SheetHandler
{
    public function __construct(
        private SheetRepository $sheetRepository,
        private EntityManagerInterface $entityManager
    ) {}

    public function getWithLessDetailsAllSheets()
    {
        $sheets = $this->sheetRepository->findAll();

        $reducedSheets = [];

        foreach ($sheets as $sheet) {
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

            $reducedSheets[] = [
                'id' => $sheet->getId(),
                'title' => $sheet->getTitle(),
                'artist' => $artist,
                'tags' => $tags
            ];
        }

        return $reducedSheets;
    }

    public function deleteArtistFromAllSheets(int $artistId): void
    {
        $sheets = $this->sheetRepository->findBy(['artist' => $artistId]);

        foreach ($sheets as $sheet) {
            $sheet->setArtist(null);
        }

        $this->entityManager->flush();
    }
}
