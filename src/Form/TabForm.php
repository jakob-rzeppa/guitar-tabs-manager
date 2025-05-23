<?php

namespace App\Form;

use App\Entity\Tab;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TabForm extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title')
            ->add('capo')
            ->add('content')
            ->add('tags', null, [
                'choice_label' => 'name',
                'multiple' => true,
                'expanded' => true,
            ])
            ->add('artist', null, [
                'choice_label' => 'name',
                'placeholder' => '-',
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
