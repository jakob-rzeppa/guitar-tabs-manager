<script setup lang="ts">
import BackLink from '@/components/BackLink.vue';
import ContentWrapper from '@/components/ContentWrapper.vue';
import type { RouterLinkProps } from 'vue-router';

interface Props {
    backTo: RouterLinkProps['to'];
    colorScheme?: 'primary' | 'secondary' | 'accent' | 'error';
}

const props = defineProps<Props>();
</script>

<template>
    <ContentWrapper>
        <div class="p-6 space-y-6">
            <BackLink :to="props.backTo" class="mb-4" />
            <div class="flex items-center gap-3">
                <div
                    :class="{
                        'rounded-full p-3': true,
                        'bg-primary': props.colorScheme === 'primary',
                        'bg-secondary': props.colorScheme === 'secondary',
                        'bg-accent': props.colorScheme === 'accent',
                        'bg-error': props.colorScheme === 'error',
                    }"
                >
                    <slot name="icon" />
                </div>
                <h1 class="text-5xl font-bold">
                    <slot name="title" />
                </h1>
            </div>

            <slot name="content" />
        </div>
    </ContentWrapper>
</template>
