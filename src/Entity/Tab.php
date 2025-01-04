<?php

namespace App\Entity;

use App\Repository\TabRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TabRepository::class)]
class Tab
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\ManyToOne(inversedBy: 'tabs')]
    private ?Artist $artist = null;

    #[ORM\Column(type: 'string', enumType: SongKey::class)]
    private SongKey $songKey;

    #[ORM\Column(type: Types::SMALLINT)]
    private ?int $capo = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $content = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getArtist(): ?Artist
    {
        return $this->artist;
    }

    public function setArtist(?Artist $artist): static
    {
        $this->artist = $artist;

        return $this;
    }

    public function getSongKey(): SongKey
    {
        return $this->songKey;
    }

    public function setSongKey(SongKey $songKey): static
    {
        $this->songKey = $songKey;

        return $this;
    }

    public function getCapo(): ?int
    {
        return $this->capo;
    }

    public function setCapo(int $capo): static
    {
        $this->capo = $capo;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;

        return $this;
    }
}
