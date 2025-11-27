<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted } from 'vue';
import { useSheetStore } from '@/stores/sheetStore';
import BaseDeleteView from '../BaseDeleteView.vue';
import { deleteSheet, fetchSheet } from '@/services/api/sheetClient';

const route = useRoute();
const router = useRouter();
const sheetStore = useSheetStore();

const sheetId = computed(() => route.params.id as string);
const currentSheet = computed(() => sheetStore.detailedSheets[sheetId.value]);

onMounted(() => {
    fetchSheet(sheetId.value);
});

const handleDelete = async () => {
    await deleteSheet(sheetId.value);

    if (!sheetStore.error) {
        router.push({ name: 'sheetSearch' });
    }
};
</script>

<template>
    <BaseDeleteView
        elementType="Sheet"
        :back-to="{ name: 'sheet', params: { id: sheetId } }"
        @delete="handleDelete"
    >
        <template #info-card>
            <h2 class="card-title text-3xl font-bold text-base-content">
                {{ currentSheet.title }}
            </h2>
            <p v-if="currentSheet.artist" class="text-lg">
                <span class="text-base-content/70">by </span>
                <span class="text-primary font-semibold">{{ currentSheet.artist.name }}</span>
            </p>

            <div v-if="currentSheet.tags.length > 0" class="flex flex-wrap gap-2">
                <div
                    v-for="tag in currentSheet.tags"
                    :key="tag.id"
                    class="badge badge-secondary badge-lg"
                >
                    {{ tag.name }}
                </div>
            </div>
        </template>
    </BaseDeleteView>
</template>
