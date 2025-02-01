<?php

namespace App\Entity;

use App\Repository\ArtistRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\UX\Turbo\Attribute\Broadcast;

#[ORM\Entity(repositoryClass: ArtistRepository::class)]
#[Broadcast]
class Artist
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    /**
     * @var Collection<int, GuitarTab>
     */
    #[ORM\OneToMany(targetEntity: GuitarTab::class, mappedBy: 'artist')]
    private Collection $guitarTabs;

    public function __construct()
    {
        $this->guitarTabs = new ArrayCollection();
    }

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

    /**
     * @return Collection<int, GuitarTab>
     */
    public function getGuitarTabs(): Collection
    {
        return $this->guitarTabs;
    }

    public function addGuitarTab(GuitarTab $guitarTab): static
    {
        if (!$this->guitarTabs->contains($guitarTab)) {
            $this->guitarTabs->add($guitarTab);
            $guitarTab->setArtist($this);
        }

        return $this;
    }

    public function removeGuitarTab(GuitarTab $guitarTab): static
    {
        if ($this->guitarTabs->removeElement($guitarTab)) {
            // set the owning side to null (unless already changed)
            if ($guitarTab->getArtist() === $this) {
                $guitarTab->setArtist(null);
            }
        }

        return $this;
    }
}
