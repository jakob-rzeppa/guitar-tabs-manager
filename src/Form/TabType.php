<?php

namespace App\Form;

use App\Entity\Artist;
use App\Entity\SongKey;
use App\Entity\Tab;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EnumType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TabType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name')
            ->add('songKey', EnumType::class, [
                'class' => SongKey::class,
                'choice_label' => 'name',
            ])
            ->add('capo')
            ->add('content')
            ->add('artist', EntityType::class, [
                'class' => Artist::class,
                'choice_label' => 'id',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Tab::class,
        ]);
    }
}
