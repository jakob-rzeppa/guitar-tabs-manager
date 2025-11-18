<script setup lang="ts">
import { useRoute } from 'vue-router';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import { useTabsStore } from '@/stores/tabsStore';
import { computed, onMounted } from 'vue';
import TagIcon from '@/components/icons/TagIcon.vue';
import InfoIcon from '@/components/icons/InfoIcon.vue';
import EditIcon from '@/components/icons/EditIcon.vue';
import MusicIcon from '@/components/icons/MusicIcon.vue';
import FormatIcon from '@/components/icons/FormatIcon.vue';
import DeleteIcon from '@/components/icons/DeleteIcon.vue';
import BaseView from '../BaseView.vue';
import BackLink from '@/components/BackLink.vue';
import TabIcon from '@/components/icons/TabIcon.vue';

const route = useRoute();
const tabsStore = useTabsStore();

const tabId = computed(() => route.params.id as string);
const currentTab = computed(() => tabsStore.detailedTabs[tabId.value]);

onMounted(async () => {
    await tabsStore.fetchTab(tabId.value);
});
</script>

<template>
    <LoadingPlaceholder v-if="tabsStore.loading" />
    <ErrorDisplay v-else-if="tabsStore.error" :message="tabsStore.error" />
    <ErrorDisplay v-else-if="!currentTab || !currentTab" message="No content." />
    <BaseView v-else>
        <template #above-header>
            <BackLink :to="{ name: 'tabSearch' }" display-text="Tab Search" />
        </template>
        <template #header>
            <div class="flex flex-row items-center gap-6">
                <div class="bg-primary rounded-full p-4 shadow-lg">
                    <TabIcon class="h-8 w-8 text-primary-content" />
                </div>
                <div class="flex-1">
                    <h1 class="text-4xl md:text-6xl font-bold text-base-content">
                        {{ currentTab.title }}
                    </h1>
                    <div v-if="currentTab.artist !== null" class="text-lg md:text-xl">
                        <span class="text-base-content/70">by </span>
                        <RouterLink
                            :to="{ name: 'artist', params: { id: currentTab.artist.id } }"
                            class="link link-hover link-primary font-semibold text-primary hover:text-primary-focus transition-colors"
                        >
                            {{ currentTab.artist.name }}
                        </RouterLink>
                    </div>
                </div>
            </div>
        </template>
        <template #subheader>
            <!-- Tags -->
            <div class="flex flex-row flex-wrap gap-2">
                <RouterLink
                    v-for="tag in currentTab.tags"
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
                    {{ currentTab.capo === 0 ? 'None' : `Fret ${currentTab.capo}` }}</span
                >
            </div>
        </template>
        <template #actions>
            <RouterLink class="btn btn-primary gap-2" :to="`/tab/${tabId}/edit`">
                <EditIcon />
                Edit
            </RouterLink>
            <RouterLink class="btn btn-secondary gap-2" :to="`/tab/${tabId}/transpose`">
                <MusicIcon />
                Transpose
            </RouterLink>
            <RouterLink class="btn btn-accent gap-2" :to="`/tab/${tabId}/format`">
                <FormatIcon />
                Format
            </RouterLink>
            <RouterLink class="btn btn-error gap-2" :to="`/tab/${tabId}/delete`">
                <DeleteIcon />
                Delete
            </RouterLink>
        </template>
        <template #content>
            <!-- Tab Content -->
            <div class="card bg-base-200 shadow-xl">
                <div class="card-body">
                    <pre class="text-sm overflow-x-auto whitespace-pre-wrap">{{
                        currentTab.content
                    }}</pre>
                </div>
            </div>

            <!-- source url -->
            <div class="mt-4 text-sm text-base-content/70">
                <strong>Source URL: </strong>
                <a
                    v-if="currentTab.sourceURL"
                    :href="currentTab.sourceURL"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="link link-hover"
                >
                    {{ currentTab.sourceURL }}
                </a>
                <span v-else>N/A</span>
            </div>
        </template>
    </BaseView>
</template>
