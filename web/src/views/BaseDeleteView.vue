<script setup lang="ts">
import ContentWrapper from '@/components/ContentWrapper.vue';
import DeleteIcon from '@/components/icons/DeleteIcon.vue';
import XIcon from '@/components/icons/XIcon.vue';
import PageHeader from '@/components/PageHeader.vue';
import type { RouterLinkProps } from 'vue-router';

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
    <ContentWrapper>
        <div class="p-6 space-y-6">
            <div class="mb-8">
                <BackLink :to="props.backTo" class="mb-4" />
                <PageHeader :title="`Delete ${props.elementType}`" icon-color="error">
                    <template #icon>
                        <DeleteIcon class="h-8 w-8 text-error-content" />
                    </template>
                </PageHeader>
            </div>

            <div class="alert alert-warning shadow-lg">
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
        </div>
    </ContentWrapper>
</template>
