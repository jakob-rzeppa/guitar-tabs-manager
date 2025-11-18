<script setup lang="ts">
import { useRoute } from 'vue-router';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import ContentWrapper from '@/components/ContentWrapper.vue';
import TabsDisplay from '@/components/TabsDisplay.vue';
import BackButton from '@/components/BackButton.vue';
import { useTagsStore } from '@/stores/tagsStore';
import { useTabsStore } from '@/stores/tabsStore';
import { computed, onMounted, ref } from 'vue';
import type { Tag, TabListItem } from '@/types/types';
import { useRouter } from 'vue-router';
import EditIcon from '@/components/icons/EditIcon.vue';
import DeleteIcon from '@/components/icons/DeleteIcon.vue';

const route = useRoute();
const router = useRouter();
const tagsStore = useTagsStore();
const tabsStore = useTabsStore();

const tagId = computed(() => route.params.id as string);
const currentTag = ref<Tag | null>(null);
const tagTabs = ref<TabListItem[]>([]);

onMounted(async () => {
    await tagsStore.fetchAllTags();
    await tabsStore.fetchAllTabs();

    currentTag.value = tagsStore.tags.find((t) => t.id === parseInt(tagId.value)) || null;

    if (currentTag.value) {
        tagTabs.value = tabsStore.tabsList.filter((tab) =>
            tab.tags.some((tag) => tag.id === currentTag.value!.id),
        );
    }
});

const handleBack = () => {
    router.push({ name: 'home' });
};
</script>

<template>
    <ContentWrapper>
        <div class="p-6 md:p-10">
            <BackButton :on-click="handleBack" class="mb-6" display-text="Home" />

            <LoadingPlaceholder v-if="tagsStore.loading || tabsStore.loading" />
            <ErrorDisplay
                v-else-if="tagsStore.error || tabsStore.error"
                :message="tagsStore.error || tabsStore.error || ''"
            />
            <ErrorDisplay v-else-if="!currentTag" message="Tag not found." />

            <div v-else>
                <!-- Header Section -->
                <div class="mb-8">
                    <div class="flex items-center gap-4 mb-6">
                        <div class="badge badge-primary badge-lg text-xl px-6 py-4">
                            {{ currentTag.name }}
                        </div>
                    </div>

                    <div class="stats shadow bg-base-200">
                        <div class="stat">
                            <div class="stat-title">Total Tabs</div>
                            <div class="stat-value text-primary">{{ tagTabs.length }}</div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-wrap gap-3 mb-6">
                    <RouterLink class="btn btn-primary gap-2" :to="`/tag/${tagId}/edit`">
                        <EditIcon />
                        Edit
                    </RouterLink>
                    <RouterLink class="btn btn-error gap-2" :to="`/tag/${tagId}/delete`">
                        <DeleteIcon />
                        Delete
                    </RouterLink>
                </div>

                <div class="divider"></div>

                <!-- Tabs Section -->
                <div v-if="tagTabs.length === 0" class="text-center py-16">
                    <p class="text-xl opacity-60">No tabs found with this tag.</p>
                </div>
                <div v-else>
                    <h2 class="text-2xl font-bold mb-4">
                        Tabs tagged with "{{ currentTag.name }}"
                    </h2>
                    <TabsDisplay :tabs="tagTabs" />
                </div>
            </div>
        </div>
    </ContentWrapper>
</template>
