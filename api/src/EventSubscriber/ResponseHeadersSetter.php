<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ResponseEvent;

class ResponseHeadersSetter implements EventSubscriberInterface
{
    public function onResponseEvent(ResponseEvent $event): void
    {
        $response = $event->getResponse();

        // set Access-Control-Allow-Origin to * to prevent Cross-Origin Requests from being blocked by the browser (relevant when running no localhost)
        $response->headers->set('Access-Control-Allow-Origin', '*');
    }

    public static function getSubscribedEvents(): array
    {
        return [
            ResponseEvent::class => 'onResponseEvent',
        ];
    }
}
