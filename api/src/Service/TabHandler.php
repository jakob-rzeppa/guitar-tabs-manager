<?php

namespace App\Service;

use App\Repository\TabRepository;

class TabHandler
{
    public function __construct(
        private TabRepository $tabRepository
    ) {}

    public function getWithLessDetailsAllTabs()
    {
        $tabs = $this->tabRepository->findAll();

        $reducedTabs = [];

        foreach ($tabs as $tab) {
            $artist = $tab->getArtist() !== null ? [
                'id' => $tab->getArtist()->getId(),
                'name' => $tab->getArtist()->getName(),
            ] : null;

            $tags = [];
            foreach ($tab->getTags() as $tag) {
                $tags[] = [
                    'id' => $tag->getId(),
                    'name' => $tag->getName()
                ];
            }

            $reducedTabs[] = [
                'id' => $tab->getId(),
                'title' => $tab->getTitle(),
                'artist' => $artist,
                'tags' => $tags
            ];
        }

        return $reducedTabs;
    }

    public function deleteArtistFromAllTabs(int $artistId): void
    {
        $tabs = $this->tabRepository->findBy(['artist' => $artistId]);

        foreach ($tabs as $tab) {
            $tab->setArtist(null);
            $this->tabRepository->save($tab, true);
        }
    }
}
