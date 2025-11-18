<script setup lang="ts">
import ContentWrapper from '@/components/ContentWrapper.vue';
import { useRoute, useRouter } from 'vue-router';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import BackLink from '@/components/BackLink.vue';
import PageHeader from '@/components/PageHeader.vue';
import SaveCancelButtons from '@/components/SaveCancelButtons.vue';
import EditIcon from '@/components/icons/EditIcon.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useTagsStore } from '@/stores/tagsStore';
import type { Tag } from '@/types/types';

const route = useRoute();
const router = useRouter();
const tagsStore = useTagsStore();

const tagId = computed(() => route.params.id as string);

const localTag = ref<Tag | null>(null);

watch(
    () => tagsStore.tags,
    (tags) => {
        const tag = tags.find((t) => t.id === parseInt(tagId.value));
        if (tag) {
            localTag.value = JSON.parse(JSON.stringify(tag));
        }
    },
    { immediate: true, deep: true },
);

onMounted(() => {
    tagsStore.fetchAllTags();
});

const handleSave = async () => {
    if (!localTag.value) return;

    await tagsStore.updateTag(parseInt(tagId.value), {
        name: localTag.value.name,
    });

    if (!tagsStore.error) {
        router.push({ name: 'tag', params: { id: tagId.value } });
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
                <PageHeader title="Edit Tag" icon-color="primary">
                    <template #icon>
                        <EditIcon class="h-8 w-8 text-primary-content" />
                    </template>
                </PageHeader>
            </div>

            <LoadingPlaceholder v-if="tagsStore.loading" />
            <ErrorDisplay v-else-if="tagsStore.error !== null" :message="tagsStore.error" />
            <ErrorDisplay
                v-else-if="localTag === null"
                message="Something went wrong while loading the tag."
            />

            <div v-else @keypress.enter="handleSave" class="space-y-6">
                <!-- Name -->
                <div>
                    <label class="label" for="name">
                        <span class="label-text text-base font-semibold">Tag Name</span>
                    </label>
                    <input
                        id="name"
                        v-model="localTag.name"
                        type="text"
                        required
                        class="input input-bordered w-full input-lg"
                        placeholder="Enter tag name..."
                    />
                </div>

                <!-- Action Buttons -->
                <SaveCancelButtons :on-save="handleSave" :on-cancel="handleCancel" />
            </div>
        </div>
    </ContentWrapper>
</template>
