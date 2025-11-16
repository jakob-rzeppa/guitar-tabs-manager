<script setup lang="ts">
import { useRoute } from 'vue-router';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import ContentWrapper from '@/components/ContentWrapper.vue';
import TabsDisplay from '@/components/TabsDisplay.vue';
import BackButton from '@/components/BackButton.vue';
import { useArtistsStore } from '@/stores/artistsStore';
import { useTabsStore } from '@/stores/tabsStore';
import { computed, onMounted, ref } from 'vue';
import type { Artist, TabListItem } from '@/types/types';
import { useRouter } from 'vue-router';
import PersonIcon from '@/components/icons/PersonIcon.vue';

const route = useRoute();
const router = useRouter();
const artistsStore = useArtistsStore();
const tabsStore = useTabsStore();

const artistId = computed(() => route.params.id as string);
const currentArtist = ref<Artist | null>(null);
const artistTabs = ref<TabListItem[]>([]);

onMounted(async () => {
    await artistsStore.fetchAllArtists();
    await tabsStore.fetchAllTabs();

    currentArtist.value =
        artistsStore.artists.find((a) => a.id === parseInt(artistId.value)) || null;

    if (currentArtist.value) {
        artistTabs.value = tabsStore.tabsList.filter(
            (tab) => tab.artist && tab.artist.id === currentArtist.value!.id,
        );
    }
});

const handleBack = () => {
    router.push({ name: 'artistSearch' });
};
</script>

<template>
    <ContentWrapper>
        <div class="p-6 md:p-10">
            <BackButton :on-click="handleBack" class="mb-6" display-text="Artist Search" />

            <LoadingPlaceholder v-if="artistsStore.loading || tabsStore.loading" />
            <ErrorDisplay
                v-else-if="artistsStore.error || tabsStore.error"
                :message="artistsStore.error || tabsStore.error || ''"
            />
            <ErrorDisplay v-else-if="!currentArtist" message="Artist not found." />

            <div v-else>
                <!-- Header Section -->
                <div class="mb-8">
                    <div class="flex items-center gap-4 mb-6">
                        <div class="bg-primary rounded-full p-4">
                            <PersonIcon class="h-10 w-10 text-primary-content" />
                        </div>
                        <h1 class="text-4xl md:text-5xl font-bold">
                            {{ currentArtist.name }}
                        </h1>
                    </div>

                    <div class="stats shadow bg-base-200">
                        <div class="stat">
                            <div class="stat-title">Total Tabs</div>
                            <div class="stat-value text-primary">{{ artistTabs.length }}</div>
                        </div>
                    </div>
                </div>

                <div class="divider"></div>

                <!-- Tabs Section -->
                <div v-if="artistTabs.length === 0" class="text-center py-16">
                    <p class="text-xl opacity-60">No tabs found for this artist.</p>
                </div>
                <div v-else>
                    <h2 class="text-2xl font-bold mb-4">Tabs by {{ currentArtist.name }}</h2>
                    <TabsDisplay :tabs="artistTabs" />
                </div>
            </div>
        </div>
    </ContentWrapper>
</template>
