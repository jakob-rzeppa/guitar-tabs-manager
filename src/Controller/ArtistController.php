<?php

namespace App\Controller;

use App\Entity\Artist;
use App\Repository\ArtistRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/artist')]
final class ArtistController extends AbstractController
{
    #[Route(name: 'app_artist_index', methods: ['GET'])]
    public function index(ArtistRepository $artistRepository)
    {
        return $this->render('app/artist/index.html.twig', [
            'artists' => $artistRepository->findAll(),
            'show_admin_link' => $this->isGranted('ROLE_ADMIN'),
        ]);
    }

    #[Route('/{id}', name: 'app_artist_show', methods: ['GET'])]
    public function show(Artist $artist)
    {
        return $this->render('app/artist/show.html.twig', [
            'artist' => $artist,
            'show_admin_link' => $this->isGranted('ROLE_ADMIN'),
        ]);
    }

    #[Route('/new', name: 'app_artist_new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $name = $request->request->get('name');

        $tag = new Artist();
        $tag->setName($name);

        $entityManager->persist($tag);
        $entityManager->flush();

        $tabId = $request->request->get('tab_id');
        if (!$tabId) {
            throw $this->createNotFoundException('Tab ID is required to redirect to the edit page.');
        }

        return $this->redirectToRoute('app_tab_edit', ['id' => $tabId], Response::HTTP_SEE_OTHER);
    }
}
