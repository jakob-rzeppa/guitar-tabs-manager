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
        <div :class="`bg-${props.iconColor} rounded-full p-3`">
            <slot name="icon" />
        </div>
        <h1 class="text-5xl font-bold">{{ title }}</h1>
    </div>
</template>
