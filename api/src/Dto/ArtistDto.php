<?php

namespace App\Dto;

use App\Entity\Artist;

readonly class ArtistDto
{
    public function __construct(
        public int $id,
        public string $name,
    ) {}

    public static function fromArtist(Artist $artist): self
    {
        return new self(
            id: $artist->getId(),
            name: $artist->getName(),
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
        ];
    }
}
