<?php

namespace App\Dto;

readonly class ArtistDto
{
    public function __construct(
        public int $id,
        public string $name,
    ) {}
}
