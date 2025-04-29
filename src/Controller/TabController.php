<?php

namespace App\Controller;

use App\Entity\Tab;
use App\Form\TabForm;
use App\Repository\TabRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/tab')]
final class TabController extends AbstractController
{
    #[Route(name: 'app_tab_index', methods: ['GET'])]
    public function index(TabRepository $tabRepository): Response
    {
        return $this->render('tab/index.html.twig', [
            'tabs' => $tabRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_tab_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $tab = new Tab();
        $form = $this->createForm(TabForm::class, $tab);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($tab);
            $entityManager->flush();

            return $this->redirectToRoute('app_tab_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('tab/new.html.twig', [
            'tab' => $tab,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_tab_show', methods: ['GET'])]
    public function show(Tab $tab): Response
    {
        return $this->render('tab/show.html.twig', [
            'tab' => $tab,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_tab_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Tab $tab, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(TabForm::class, $tab);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_tab_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('tab/edit.html.twig', [
            'tab' => $tab,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_tab_delete', methods: ['POST'])]
    public function delete(Request $request, Tab $tab, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$tab->getId(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($tab);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_tab_index', [], Response::HTTP_SEE_OTHER);
    }
}
