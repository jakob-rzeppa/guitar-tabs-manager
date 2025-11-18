<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useTagsStore } from '@/stores/tagsStore';
import type { Tag } from '@/types/types';
import BaseEditView from '../BaseEditView.vue';

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
</script>

<template>
    <LoadingPlaceholder v-if="tagsStore.loading" />
    <ErrorDisplay v-else-if="tagsStore.error !== null" :message="tagsStore.error" />
    <ErrorDisplay
        v-else-if="localTag === null"
        message="Something went wrong while loading the tag."
    />
    <BaseEditView
        v-else
        :back-to="{ name: 'tag', params: { id: tagId } }"
        element-type="Tag"
        @save="handleSave"
    >
        <template #content>
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
        </template>
    </BaseEditView>
</template>
