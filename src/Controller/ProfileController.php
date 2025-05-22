<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/profile')]
final class ProfileController extends AbstractController
{
    #[Route(name: 'app_profile_show', methods: ['GET'])]
    public function index(): Response
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            throw $this->createAccessDeniedException('User not logged in or invalid user.');
        }

        return $this->render('app/profile/index.html.twig', [
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
            'show_admin_link' => $this->isGranted('ROLE_ADMIN'),
        ]);
    }
}
