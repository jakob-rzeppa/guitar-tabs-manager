<script setup lang="ts">
import ArrowLeftIcon from './icons/ArrowLeftIcon.vue';

interface Props {
    onClick: () => void;
}

defineProps<Props>();
</script>

<template>
    <button @click="onClick" class="btn btn-ghost gap-2">
        <ArrowLeftIcon />
        Back
    </button>
</template>
