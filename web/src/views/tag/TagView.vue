<script setup lang="ts">
import { useRoute } from 'vue-router';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import SheetsDisplay from '@/components/SheetsDisplay.vue';
import BackLink from '@/components/BackLink.vue';
import { useTagsStore } from '@/stores/tagsStore';
import { useSheetsStore } from '@/stores/sheetsStore';
import { computed, onMounted, ref } from 'vue';
import type { Tag, SheetListItem } from '@/types/types';
import EditIcon from '@/components/icons/EditIcon.vue';
import DeleteIcon from '@/components/icons/DeleteIcon.vue';
import BaseView from '../BaseView.vue';
import TagIcon from '@/components/icons/TagIcon.vue';
import { fetchAllTags } from '@/services/api/tagClient';

const route = useRoute();
const tagsStore = useTagsStore();
const sheetsStore = useSheetsStore();

const tagId = computed(() => route.params.id as string);
const currentTag = ref<Tag | null>(null);
const tagSheets = ref<SheetListItem[]>([]);

onMounted(async () => {
    await fetchAllTags();
    await sheetsStore.fetchAllSheets();

    currentTag.value = tagsStore.tags.find((t) => t.id === parseInt(tagId.value)) || null;

    if (currentTag.value) {
        tagSheets.value = sheetsStore.sheetsList.filter((sheet) =>
            sheet.tags.some((tag) => tag.id === currentTag.value!.id),
        );
    }
});
</script>

<template>
    <LoadingPlaceholder v-if="tagsStore.loading || sheetsStore.loading" />
    <ErrorDisplay
        v-else-if="tagsStore.error || sheetsStore.error"
        :message="tagsStore.error || sheetsStore.error || ''"
    />
    <ErrorDisplay v-else-if="!currentTag" message="Tag not found." />
    <BaseView v-else>
        <template #above-header>
            <BackLink :to="{ name: 'tagSearch' }" display-text="Tag Search" />
        </template>
        <template #header>
            <div class="flex items-center gap-4">
                <div class="bg-primary rounded-full p-4">
                    <TagIcon class="h-8 w-8 text-primary-content" />
                </div>
                <h1 class="text-4xl md:text-5xl font-bold">
                    {{ currentTag.name }}
                </h1>
            </div>
        </template>
        <template #subheader>
            <div class="stats shadow bg-base-200">
                <div class="stat">
                    <div class="stat-title">Total Sheets</div>
                    <div class="stat-value text-primary">{{ tagSheets.length }}</div>
                </div>
            </div>
        </template>
        <template #actions>
            <RouterLink class="btn btn-primary gap-2" :to="`/tag/${tagId}/edit`">
                <EditIcon />
                Edit
            </RouterLink>
            <RouterLink class="btn btn-error gap-2" :to="`/tag/${tagId}/delete`">
                <DeleteIcon />
                Delete
            </RouterLink>
        </template>
        <template #content>
            <div v-if="tagSheets.length === 0" class="text-center">
                <p class="text-xl opacity-60">No sheets found with this tag.</p>
            </div>
            <div v-else>
                <h2 class="text-2xl font-bold">Sheets tagged with "{{ currentTag.name }}"</h2>
                <SheetsDisplay :sheets="tagSheets" />
            </div>
        </template>
    </BaseView>
</template>
