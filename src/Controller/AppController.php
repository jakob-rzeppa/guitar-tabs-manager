<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class AppController extends AbstractController
{
    #[Route(name: 'app_home')]
    public function home(): Response
    {
        return $this->redirectToRoute('app_tab_index', [], Response::HTTP_SEE_OTHER);
    }
}
