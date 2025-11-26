<?php

namespace App\Dto\Request;

use Symfony\Component\Validator\Constraints as Assert;

readonly class CreateTagRequestDto
{
    public function __construct(
        #[Assert\NotBlank(message: 'Name should not be blank.')]
        public ?string $name,
    ) {}
}
