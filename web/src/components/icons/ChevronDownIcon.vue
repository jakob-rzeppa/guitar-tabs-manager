<script setup lang="ts">
interface Props {
    class?: string;
}

const props = withDefaults(defineProps<Props>(), {
    class: 'h-6 w-6',
});
</script>

<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        :class="props.class"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
</template>
