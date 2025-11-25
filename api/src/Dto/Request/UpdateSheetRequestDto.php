<?php

namespace App\Dto\Request;

use Symfony\Component\Validator\Constraints as Assert;

readonly class UpdateSheetRequestDto
{
    public function __construct(
        public ?string $title,
        public ?int $capo,
        #[Assert\Url(message: 'Source URL should be a valid URL.')]
        public ?string $source_url,
        public ?string $content,
        public ?int $artist_id,
        public ?array $tag_ids,
    ) {}
}
