<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted } from 'vue';
import { useTabsStore } from '@/stores/tabsStore';
import BaseDeleteView from '../BaseDeleteView.vue';

const route = useRoute();
const router = useRouter();
const tabsStore = useTabsStore();

const tabId = computed(() => route.params.id as string);
const currentTab = computed(() => tabsStore.detailedTabs[tabId.value]);

onMounted(() => {
    tabsStore.fetchTab(tabId.value);
});

const handleDelete = async () => {
    await tabsStore.deleteTab(tabId.value);

    if (!tabsStore.error) {
        router.push({ name: 'tabSearch' });
    }
};
</script>

<template>
    <BaseDeleteView
        elementType="Tab"
        :back-to="{ name: 'tab', params: { id: tabId } }"
        @delete="handleDelete"
    >
        <template #info-card>
            <h2 class="card-title text-3xl font-bold text-base-content">
                {{ currentTab.title }}
            </h2>
            <p v-if="currentTab.artist" class="text-lg">
                <span class="text-base-content/70">by </span>
                <span class="text-primary font-semibold">{{ currentTab.artist.name }}</span>
            </p>

            <div v-if="currentTab.tags.length > 0" class="flex flex-wrap gap-2">
                <div
                    v-for="tag in currentTab.tags"
                    :key="tag.id"
                    class="badge badge-secondary badge-lg"
                >
                    {{ tag.name }}
                </div>
            </div>
        </template>
    </BaseDeleteView>
</template>
