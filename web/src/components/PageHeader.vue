<script setup lang="ts">
interface Props {
    title: string;
    iconColor?: 'primary' | 'secondary' | 'accent' | 'error';
}

const props = withDefaults(defineProps<Props>(), {
    iconColor: 'primary',
});
</script>

<template>
    <div class="flex items-center gap-3">
        <div
            :class="{
                'rounded-full p-3': true,
                'bg-primary': props.iconColor === 'primary',
                'bg-secondary': props.iconColor === 'secondary',
                'bg-accent': props.iconColor === 'accent',
                'bg-error': props.iconColor === 'error',
            }"
        >
            <slot name="icon" />
        </div>
        <h1 class="text-5xl font-bold">{{ title }}</h1>
    </div>
</template>
