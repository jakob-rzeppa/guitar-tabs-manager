<?php

namespace App\Dto;

use App\Entity\Tag;

readonly class TagDto
{
    public function __construct(
        public int $id,
        public string $name,
    ) {}

    public static function fromTag(Tag $tag): self
    {
        return new self(
            id: $tag->getId(),
            name: $tag->getName(),
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
