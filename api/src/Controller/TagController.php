<?php

namespace App\Controller;

use App\Dto\Request\CreateTagRequestDto;
use App\Dto\Request\UpdateTagRequestDto;
use App\Dto\TagDto;
use App\Entity\Tag;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\TagRepository;
use App\Service\TagHandler;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;

#[Route('/tags')]
final class TagController extends AbstractController
{
    #[Route('', name: 'app_tags_get_all', methods: ['GET'])]
    public function getAll(TagRepository $tagRepository): JsonResponse
    {
        $tags = $tagRepository->findAll();

        $tagPayloads = array_map(function (Tag $tag) {
            return TagDto::fromTag($tag);
        }, $tags);

        return $this->json([
            'data' => array_map(fn(TagDto $tagPayload) => $tagPayload->toArray(), $tagPayloads),
        ]);
    }

    #[Route('/{id}', name: 'app_tags_get_by_id', methods: ['GET'])]
    public function getById(int $id, TagRepository $tagRepository): JsonResponse
    {
        $tag = $tagRepository->find($id);

        if (null === $tag) {
            throw $this->createNotFoundException();
        }

        return $this->json([
            'data' => TagDto::fromTag($tag)->toArray()
        ]);
    }

    #[Route('', name: 'app_tags_create', methods: ['POST'])]
    public function create(
        #[MapRequestPayload('json')] CreateTagRequestDto $createTagRequestDto,
        TagHandler $tagHandler,
    ): JsonResponse {
        $tag = $tagHandler->createTag($createTagRequestDto->name);

        return $this->json([
            'data' => TagDto::fromTag($tag)->toArray(),
            'message' => 'Tag created successfully'
        ]);
    }

    #[Route('/{id}', name: 'app_tags_update', methods: ['PUT'])]
    public function update(
        int $id,
        #[MapRequestPayload('json')] UpdateTagRequestDto $updateTagRequestDto,
        TagHandler $tagHandler
    ): JsonResponse {
        $tag = $tagHandler->updateTag($id, $updateTagRequestDto);

        return $this->json([
            'message' => 'Tag updated successfully',
            'data' => TagDto::fromTag($tag)->toArray(),
        ]);
    }

    #[Route('/{id}', name: 'app_tags_delete', methods: ['DELETE'])]
    public function delete(int $id, TagHandler $tagHandler): JsonResponse
    {
        $tagHandler->deleteTag($id);

        return $this->json([
            'message' => 'Tag deleted successfully'
        ]);
    }
}
