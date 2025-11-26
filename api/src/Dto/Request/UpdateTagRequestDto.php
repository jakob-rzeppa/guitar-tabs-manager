<?php

namespace App\Dto\Request;

readonly class UpdateTagRequestDto
{
    public function __construct(
        public ?string $name,
    ) {}
}
