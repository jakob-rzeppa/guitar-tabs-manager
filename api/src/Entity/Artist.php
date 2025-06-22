<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ArtistRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource(mercure: true)]
#[ORM\Entity(repositoryClass: ArtistRepository::class)]
class Artist
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    /**
     * @var Collection<int, Tab>
     */
    #[ORM\OneToMany(targetEntity: Tab::class, mappedBy: 'artist')]
    private Collection $tabs;

    public function __construct()
    {
        $this->tabs = new ArrayCollection();
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
     * @return Collection<int, Tab>
     */
    public function getTabs(): Collection
    {
        return $this->tabs;
    }

    public function addTab(Tab $tab): static
    {
        if (!$this->tabs->contains($tab)) {
            $this->tabs->add($tab);
            $tab->setArtist($this);
        }

        return $this;
    }

    public function removeTab(Tab $tab): static
    {
        if ($this->tabs->removeElement($tab)) {
            // set the owning side to null (unless already changed)
            if ($tab->getArtist() === $this) {
                $tab->setArtist(null);
            }
        }

        return $this;
    }
}
