<?php

namespace App\Controller;

use App\Entity\Tab;
use App\Form\TabForm;
use App\Repository\TabRepository;
use App\Service\FormatService;
use App\Service\TransposeService;
use Doctrine\ORM\EntityManagerInterface;
use InvalidArgumentException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/app/tab')]
final class TabController extends AbstractController
{
    #[Route(name: 'app_tab_index', methods: ['GET'])]
    public function index(TabRepository $tabRepository): Response
    {
        return $this->render('app/tab/index.html.twig', [
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

        return $this->render('app/tab/new.html.twig', [
            'tab' => $tab,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_tab_show', methods: ['GET'])]
    public function show(Tab $tab): Response
    {
        return $this->render('app/tab/show.html.twig', [
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

            return $this->redirectToRoute('app_tab_show', ['id' => $tab->getId()], Response::HTTP_SEE_OTHER);
        }

        return $this->render('app/tab/edit.html.twig', [
            'tab' => $tab,
            'form' => $form,
        ]);
    }

    #[Route('/{id}/format', name: 'app_tab_format', methods: ['POST'])]
    public function cleanup(Request $request, Tab $tab, EntityManagerInterface $entityManager, FormatService $formatService): Response
    {
        $formatedTab = $formatService->formatTab($tab->getContent());
        $tab->setContent($formatedTab);
        $entityManager->flush();

        return $this->redirectToRoute('app_tab_show', [
            'id' => $tab->getId(),
        ], Response::HTTP_SEE_OTHER);
    }

    #[Route('/{id}/transpose', name: 'app_tab_transpose', methods: ['POST'])]
    public function transpose(Request $request, Tab $tab, EntityManagerInterface $entityManager, TransposeService $transposeService): Response
    {
        $direction = $request->request->get('direction');
        $changeCapo = $request->request->get('change_capo');

        if (!in_array($direction, ['up', 'down'], true)) {
            throw new InvalidArgumentException('Invalid transpose direction.');
        }

        $transposedTab = $transposeService->transposeTab($tab->getContent(), $direction);
        $tab->setContent($transposedTab);

        // Handle capo adjustment if the change capo button was clicked
        if ($changeCapo) {
            $currentCapo = $tab->getCapo();
            $newCapo = $direction === 'up' ? $currentCapo - 1 : $currentCapo + 1;
            $tab->setCapo($newCapo);
        }

        $entityManager->flush();

        return $this->redirectToRoute('app_tab_edit', [
            'id' => $tab->getId(),
            'last_selected_direction' => $direction,
        ], Response::HTTP_SEE_OTHER);
    }

    #[Route('/{id}', name: 'app_tab_delete', methods: ['POST'])]
    public function delete(Request $request, Tab $tab, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete' . $tab->getId(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($tab);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_tab_index', [], Response::HTTP_SEE_OTHER);
    }
}
