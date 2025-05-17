<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class AppController extends AbstractController
{
    #[Route('/app', name: 'app_index')]
    public function index(): Response
    {
        return $this->redirectToRoute('app_tab_index', [], Response::HTTP_SEE_OTHER);
    }
}
