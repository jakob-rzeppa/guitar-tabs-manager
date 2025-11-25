<?php

namespace App\Dto;

readonly class TagDto
{
    public function __construct(
        public int $id,
        public string $name,
    ) {}
}
