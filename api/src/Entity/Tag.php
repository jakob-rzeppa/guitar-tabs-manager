<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\TagRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource(mercure: true)]
#[ORM\Entity(repositoryClass: TagRepository::class)]
class Tag
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
    #[ORM\ManyToMany(targetEntity: Tab::class, mappedBy: 'tags')]
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
            $tab->addTag($this);
        }

        return $this;
    }

    public function removeTab(Tab $tab): static
    {
        if ($this->tabs->removeElement($tab)) {
            $tab->removeTag($this);
        }

        return $this;
    }
}
