<script setup lang="ts">
import ContentWrapper from '@/components/ContentWrapper.vue';
import { useRoute, useRouter } from 'vue-router';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import BackLink from '@/components/BackLink.vue';
import PageHeader from '@/components/PageHeader.vue';
import DeleteIcon from '@/components/icons/DeleteIcon.vue';
import WarningIcon from '@/components/icons/WarningIcon.vue';
import XIcon from '@/components/icons/XIcon.vue';
import { computed, onMounted, ref } from 'vue';
import { useTagsStore } from '@/stores/tagsStore';
import type { Tag } from '@/types/types';

const route = useRoute();
const router = useRouter();
const tagsStore = useTagsStore();

const tagId = computed(() => route.params.id as string);
const currentTag = ref<Tag | null>(null);

onMounted(async () => {
    await tagsStore.fetchAllTags();
    currentTag.value = tagsStore.tags.find((t) => t.id === parseInt(tagId.value)) || null;
});

const handleDelete = async () => {
    await tagsStore.deleteTag(parseInt(tagId.value));

    if (!tagsStore.error) {
        router.push({ name: 'home' });
    }
};

const handleCancel = () => {
    router.push({ name: 'tag', params: { id: tagId.value } });
};
</script>

<template>
    <ContentWrapper>
        <div class="p-6 md:p-10 max-w-4xl mx-auto">
            <div class="mb-8">
                <BackLink :to="{ name: 'tag', params: { id: tagId } }" class="mb-4" />
                <PageHeader title="Delete Tag" icon-color="error">
                    <template #icon>
                        <DeleteIcon class="h-8 w-8 text-error-content" />
                    </template>
                </PageHeader>
            </div>

            <LoadingPlaceholder v-if="tagsStore.loading" />
            <ErrorDisplay v-else-if="tagsStore.error" :message="tagsStore.error" />
            <ErrorDisplay
                v-else-if="!currentTag"
                message="Something went wrong while loading the tag."
            />

            <div v-else class="space-y-6">
                <div class="alert alert-warning shadow-lg">
                    <WarningIcon />
                    <div>
                        <h3 class="font-bold">Warning!</h3>
                        <div class="text-sm">
                            This action cannot be undone. This will permanently delete the tag.
                        </div>
                    </div>
                </div>

                <div class="card bg-base-200 shadow-xl">
                    <div class="card-body">
                        <div class="badge badge-primary badge-lg text-xl px-6 py-4">
                            {{ currentTag.name }}
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-4">
                    <button @click="handleDelete" class="btn btn-error btn-lg gap-2">
                        <DeleteIcon />
                        Delete Tag
                    </button>
                    <button
                        type="button"
                        @click="handleCancel"
                        class="btn btn-outline btn-lg gap-2"
                    >
                        <XIcon />
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </ContentWrapper>
</template>
