<?php

namespace App\Dto\Request;

use Symfony\Component\Validator\Constraints as Assert;

readonly class CreateSheetRequestDto
{
    public function __construct(
        #[Assert\NotBlank(message: 'Title should not be blank.')]
        public ?string $title,
        #[Assert\NotNull(message: 'Capo should not be null.')]
        public ?int $capo,
        #[Assert\Url(message: 'Source URL should be a valid URL.', requireTld: false)]
        public ?string $source_url,
        #[Assert\NotNull(message: 'Content should not be null.')]
        public ?string $content,
        public ?int $artist_id,
        public ?array $tag_ids,
    ) {}
}
