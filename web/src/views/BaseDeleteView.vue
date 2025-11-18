<script setup lang="ts">
import DeleteIcon from '@/components/icons/DeleteIcon.vue';
import XIcon from '@/components/icons/XIcon.vue';
import type { RouterLinkProps } from 'vue-router';
import BaseActionView from './BaseActionView.vue';
import WarningIcon from '@/components/icons/WarningIcon.vue';

interface Props {
    elementType: string;
    backTo: RouterLinkProps['to'];
}

interface Emits {
    (e: 'delete'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
    <BaseActionView :back-to="props.backTo" color-scheme="error">
        <template #title> Delete {{ props.elementType }} </template>
        <template #icon>
            <DeleteIcon class="h-8 w-8 text-error-content" />
        </template>
        <template #content
            ><div class="alert alert-warning shadow-lg">
                <WarningIcon />
                <div>
                    <h3 class="font-bold">Warning!</h3>
                    <div class="text-sm">
                        This action cannot be undone. This will permanently delete the
                        {{ props.elementType }}.
                    </div>
                </div>
            </div>

            <div v-if="$slots['info-card']" class="card bg-base-200 shadow-xl">
                <div class="card-body">
                    <slot name="info-card" />
                </div>
            </div>

            <div class="flex gap-4">
                <button @click="() => emit('delete')" class="btn btn-error btn-lg gap-2">
                    <DeleteIcon />
                    Delete {{ props.elementType }}
                </button>
                <RouterLink :to="props.backTo" class="btn btn-outline btn-lg gap-2">
                    <XIcon />
                    Cancel
                </RouterLink>
            </div>
        </template>
    </BaseActionView>
</template>
