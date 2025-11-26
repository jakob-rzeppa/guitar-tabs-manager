<?php

namespace App\Dto\Request;

readonly class UpdateArtistRequestDto
{
    public function __construct(
        public ?string $name,
    ) {}
}
