<?php

namespace App\Dto;

use App\Entity\Sheet;

readonly class SheetDto
{
    public function __construct(
        public int $id,
        public string $title,
        public int $capo,
        public ?string $source_url,
        public string $content,
        public ?ArtistDto $artist,
        /** @var TagDto[] */
        public array $tags,
    ) {}

    public static function fromSheet(Sheet $sheet): self
    {
        $artist = $sheet->getArtist() !== null
            ? new ArtistDto(
                $sheet->getArtist()->getId(),
                $sheet->getArtist()->getName()
            )
            : null;

        $tags = [];
        foreach ($sheet->getTags() as $tag) {
            $tags[] = new TagDto(
                $tag->getId(),
                $tag->getName()
            );
        }

        return new self(
            id: $sheet->getId(),
            title: $sheet->getTitle(),
            capo: $sheet->getCapo(),
            source_url: $sheet->getSourceURL(),
            content: $sheet->getContent(),
            artist: $artist,
            tags: $tags,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'capo' => $this->capo,
            'source_url' => $this->source_url,
            'content' => $this->content,
            'artist' => $this->artist ? [
                'id' => $this->artist->id,
                'name' => $this->artist->name,
            ] : null,
            'tags' => array_map(fn(TagDto $tag) => [
                'id' => $tag->id,
                'name' => $tag->name,
            ], $this->tags),
        ];
    }
}
