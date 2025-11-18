<script setup lang="ts">
import { useRoute } from 'vue-router';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import ContentWrapper from '@/components/ContentWrapper.vue';
import { useTabsStore } from '@/stores/tabsStore';
import { computed, onMounted } from 'vue';
import TagIcon from '@/components/icons/TagIcon.vue';
import InfoIcon from '@/components/icons/InfoIcon.vue';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon.vue';
import EditIcon from '@/components/icons/EditIcon.vue';
import MusicIcon from '@/components/icons/MusicIcon.vue';
import FormatIcon from '@/components/icons/FormatIcon.vue';
import DeleteIcon from '@/components/icons/DeleteIcon.vue';

const route = useRoute();
const tabsStore = useTabsStore();

const tabId = computed(() => route.params.id as string);
const currentTab = computed(() => tabsStore.detailedTabs[tabId.value]);

onMounted(async () => {
    await tabsStore.fetchTab(tabId.value);
});
</script>

<template>
    <ContentWrapper>
        <LoadingPlaceholder v-if="tabsStore.loading" />
        <ErrorDisplay v-else-if="tabsStore.error" :message="tabsStore.error" />
        <ErrorDisplay v-else-if="!currentTab || !currentTab" message="No content." />
        <div v-else class="p-6 md:p-10">
            <!-- Header Section -->
            <div class="mb-8">
                <h1 class="text-4xl md:text-5xl font-bold mb-4">
                    {{ currentTab.title }}
                </h1>
                <p v-if="currentTab.artist !== null" class="text-xl text-base-content/70 mb-4">
                    <span class="text-primary font-semibold">by </span>
                    <RouterLink
                        :to="{ name: 'artist', params: { id: currentTab.artist.id } }"
                        class="link link-hover font-semibold"
                    >
                        {{ currentTab.artist.name }}
                    </RouterLink>
                </p>

                <!-- Tags -->
                <div class="flex flex-row flex-wrap gap-2 mb-4">
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
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-3 mb-6">
                <RouterLink class="btn btn-outline btn-secondary gap-2" :to="`/tabSearch`">
                    <ArrowLeftIcon />
                    Back to Search
                </RouterLink>
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
            </div>

            <div class="divider"></div>

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
        </div>
    </ContentWrapper>
</template>
