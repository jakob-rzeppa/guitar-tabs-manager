<script setup lang="ts">
import type { RouterLinkProps } from 'vue-router';
import BaseActionView from './BaseActionView.vue';
import EditIcon from '@/components/icons/EditIcon.vue';
import CheckIcon from '@/components/icons/CheckIcon.vue';
import XIcon from '@/components/icons/XIcon.vue';
import PlusIcon from '@/components/icons/PlusIcon.vue';

interface Props {
    backTo: RouterLinkProps['to'];
    elementType: string;
    isNewElement?: boolean;
}

interface Emits {
    (e: 'save'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
    <BaseActionView :back-to="props.backTo" color-scheme="primary">
        <template #icon>
            <PlusIcon v-if="props.isNewElement" class="h-8 w-8 text-primary-content" />
            <EditIcon v-else class="h-8 w-8 text-primary-content" />
        </template>
        <template #title>
            {{ props.isNewElement ? 'Create' : 'Edit' }} {{ props.elementType }}
        </template>
        <template #content>
            <div @keypress.enter="() => emit('save')" class="space-y-6">
                <slot name="content" />
            </div>

            <div class="flex gap-4">
                <button @click="() => emit('save')" class="btn btn-primary btn-lg gap-2">
                    <PlusIcon v-if="props.isNewElement" />
                    <CheckIcon v-else />
                    {{ props.isNewElement ? 'Create' : 'Save' }} {{ props.elementType }}
                </button>
                <RouterLink :to="props.backTo" class="btn btn-outline btn-lg gap-2">
                    <XIcon />
                    Cancel
                </RouterLink>
            </div>
        </template>
    </BaseActionView>
</template>
