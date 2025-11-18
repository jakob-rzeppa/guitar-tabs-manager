<script setup lang="ts">
import { RouterLink, type RouterLinkProps } from 'vue-router';
import ArrowLeftIcon from './icons/ArrowLeftIcon.vue';

interface Props {
    to: RouterLinkProps['to'];
    displayText?: string;
}

const props = defineProps<Props>();
</script>

<template>
    <RouterLink :to="props.to" class="btn btn-ghost gap-2">
        <ArrowLeftIcon />
        {{ displayText ?? 'Back' }}
    </RouterLink>
</template>
