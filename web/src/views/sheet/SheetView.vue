<script setup lang="ts">
import { useRoute } from 'vue-router';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import { useSheetsStore } from '@/stores/sheetsStore';
import { computed, onMounted } from 'vue';
import TagIcon from '@/components/icons/TagIcon.vue';
import InfoIcon from '@/components/icons/InfoIcon.vue';
import EditIcon from '@/components/icons/EditIcon.vue';
import MusicIcon from '@/components/icons/MusicIcon.vue';
import FormatIcon from '@/components/icons/FormatIcon.vue';
import DeleteIcon from '@/components/icons/DeleteIcon.vue';
import BaseView from '../BaseView.vue';
import BackLink from '@/components/BackLink.vue';
import SheetIcon from '@/components/icons/SheetIcon.vue';

const route = useRoute();
const sheetsStore = useSheetsStore();

const sheetId = computed(() => route.params.id as string);
const currentSheet = computed(() => sheetsStore.detailedSheets[sheetId.value]);

onMounted(async () => {
    await sheetsStore.fetchSheet(sheetId.value);
});
</script>

<template>
    <LoadingPlaceholder v-if="sheetsStore.loading" />
    <ErrorDisplay v-else-if="sheetsStore.error" :message="sheetsStore.error" />
    <ErrorDisplay v-else-if="!currentSheet || !currentSheet" message="No content." />
    <BaseView v-else>
        <template #above-header>
            <BackLink :to="{ name: 'sheetSearch' }" display-text="Sheet Search" />
        </template>
        <template #header>
            <div class="flex flex-row items-center gap-6">
                <div class="bg-primary rounded-full p-4 shadow-lg">
                    <SheetIcon class="h-8 w-8 text-primary-content" />
                </div>
                <div class="flex-1">
                    <h1 class="text-4xl md:text-6xl font-bold text-base-content">
                        {{ currentSheet.title }}
                    </h1>
                    <div v-if="currentSheet.artist !== null" class="text-lg md:text-xl">
                        <span class="text-base-content/70">by </span>
                        <RouterLink
                            :to="{ name: 'artist', params: { id: currentSheet.artist.id } }"
                            class="link link-hover link-primary font-semibold text-primary hover:text-primary-focus transition-colors"
                        >
                            {{ currentSheet.artist.name }}
                        </RouterLink>
                    </div>
                </div>
            </div>
        </template>
        <template #subheader>
            <!-- Tags -->
            <div class="flex flex-row flex-wrap gap-2">
                <RouterLink
                    v-for="tag in currentSheet.tags"
                    class="badge badge-secondary badge-lg gap-2"
                    :key="tag.id"
                    :to="{ name: 'tag', params: { id: tag.id } }"
                >
                    <TagIcon />
                    {{ tag.name }}
                </RouterLink>
            </div>

            <!-- Capo Info -->
            <div class="alert alert-info shadow-md w-fit">
                <InfoIcon />
                <span
                    ><strong>Capo:</strong>
                    {{ currentSheet.capo === 0 ? 'None' : `Fret ${currentSheet.capo}` }}</span
                >
            </div>
        </template>
        <template #actions>
            <RouterLink class="btn btn-primary gap-2" :to="`/sheet/${sheetId}/edit`">
                <EditIcon />
                Edit
            </RouterLink>
            <RouterLink class="btn btn-secondary gap-2" :to="`/sheet/${sheetId}/transpose`">
                <MusicIcon />
                Transpose
            </RouterLink>
            <RouterLink class="btn btn-accent gap-2" :to="`/sheet/${sheetId}/format`">
                <FormatIcon />
                Format
            </RouterLink>
            <RouterLink class="btn btn-error gap-2" :to="`/sheet/${sheetId}/delete`">
                <DeleteIcon />
                Delete
            </RouterLink>
        </template>
        <template #content>
            <!-- Sheet Content -->
            <div class="card bg-base-200 shadow-xl">
                <div class="card-body">
                    <pre class="text-sm overflow-x-auto whitespace-pre-wrap">{{
                        currentSheet.content
                    }}</pre>
                </div>
            </div>

            <!-- source url -->
            <div class="mt-4 text-sm text-base-content/70">
                <strong>Source URL: </strong>
                <a
                    v-if="currentSheet.sourceURL"
                    :href="currentSheet.sourceURL"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="link link-hover"
                >
                    {{ currentSheet.sourceURL }}
                </a>
                <span v-else>N/A</span>
            </div>
        </template>
    </BaseView>
</template>
