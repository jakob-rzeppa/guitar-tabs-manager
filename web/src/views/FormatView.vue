<script setup lang="ts">
import ContentWrapper from '@/components/ContentWrapper.vue';
import { useRoute, useRouter } from 'vue-router';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import { computed, onMounted } from 'vue';
import { useTabsStore } from '@/stores/tabsStore';
import { useTabFormatter } from '@/composables/useTabFormatter';

const route = useRoute();
const router = useRouter();

const tabId = computed(() => route.params.id as string);

const tabsStore = useTabsStore();

const { formatLoading, formatError, formattedTabContent, formatTab } = useTabFormatter();

// The computed property to bind the textarea input to the formatted tab content
const textareaInput = computed({
    get: () => formattedTabContent.value,
    set: (value: string) => {
        formattedTabContent.value = value;
    },
});

onMounted(() => {
    tabsStore.fetchTab(tabId.value);
});

const handleFormat = () => {
    if (tabsStore.detailedTabs[tabId.value]) {
        formatTab(tabsStore.detailedTabs[tabId.value].content);
    }
};

const handleSave = async () => {
    if (!formattedTabContent.value) return;

    await tabsStore.updateTab(tabId.value, { content: formattedTabContent.value });

    if (!tabsStore.error) {
        router.push({ name: 'tab', params: { id: tabId.value } });
    }
};

const handleCancel = () => {
    router.push({ name: 'tab', params: { id: tabId.value } });
};
</script>

<template>
    <ContentWrapper>
        <div class="p-10 max-w-4xl mx-auto">
            <h1 class="text-4xl mb-6">Format Tab</h1>
            <LoadingPlaceholder v-if="tabsStore.loading || formatLoading" />
            <ErrorDisplay
                v-else-if="tabsStore.error !== null || formatError !== null"
                :message="tabsStore.error || formatError"
            />
            <div v-else-if="formattedTabContent === null">
                <button @click="handleFormat" class="btn btn-accent">Format Tab</button>
                <pre>{{ tabsStore.detailedTabs[tabId]?.content }}</pre>
            </div>
            <div v-else>
                <div>
                    <label for="content" class="block text-sm font-medium mb-2">Tab Content</label>
                    <textarea
                        id="content"
                        v-model="textareaInput"
                        rows="20"
                        required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        placeholder="Enter tab notation here..."
                    ></textarea>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-4">
                    <button
                        @click="handleSave"
                        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        @click="handleCancel"
                        class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </ContentWrapper>
</template>
