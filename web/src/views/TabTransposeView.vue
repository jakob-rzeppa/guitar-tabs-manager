<script setup lang="ts">
import ContentWrapper from '@/components/ContentWrapper.vue';
import { useRoute, useRouter } from 'vue-router';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import { computed, onMounted, ref } from 'vue';
import { useTabsStore } from '@/stores/tabsStore';
import { useTabTransposer } from '@/composables/useTabTransposer';

const route = useRoute();
const router = useRouter();

const tabId = computed(() => route.params.id as string);

const tabsStore = useTabsStore();

const { transposeLoading, transposeError, transposedTabContent, transposeTab } = useTabTransposer();

const capo = ref<number | null>(null);
// The computed property to bind the textarea input to the formatted tab content
const textareaInput = computed({
    get: () => transposedTabContent.value,
    set: (value: string) => {
        transposedTabContent.value = value;
    },
});

onMounted(() => {
    tabsStore.fetchTab(tabId.value);
});

const handleTranspose = (direction: 'up' | 'down', changeCapo: boolean) => {
    if (tabsStore.detailedTabs[tabId.value]) {
        transposeTab(tabsStore.detailedTabs[tabId.value].content, direction);

        capo.value = tabsStore.detailedTabs[tabId.value].capo;
        if (changeCapo && capo.value !== null) {
            if (direction === 'up') {
                capo.value += 1;
            } else {
                capo.value -= 1;
            }
        }
    }
};

const handleSave = async () => {
    if (!transposedTabContent.value) return;

    await tabsStore.updateTab(tabId.value, {
        content: transposedTabContent.value,
        capo: capo.value ?? undefined,
    });

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
            <h1 class="text-4xl mb-6">Transpose Tab</h1>
            <LoadingPlaceholder v-if="tabsStore.loading || transposeLoading" />
            <ErrorDisplay
                v-else-if="tabsStore.error !== null || transposeError !== null"
                :message="tabsStore.error || transposeError"
            />
            <div v-else-if="transposedTabContent === null || capo === null">
                <button @click="handleTranspose('up', false)" class="btn btn-accent">
                    Transpose Up
                </button>
                <button @click="handleTranspose('down', false)" class="btn btn-accent">
                    Transpose Down
                </button>
                <button @click="handleTranspose('up', true)" class="btn btn-accent">
                    Transpose Up (Change Capo)
                </button>
                <button @click="handleTranspose('down', true)" class="btn btn-accent">
                    Transpose Down (Change Capo)
                </button>
                <h2 class="text-2xl mt-6 mb-2">Original Tab Content:</h2>
                <pre>{{ tabsStore.detailedTabs[tabId]?.content }}</pre>
            </div>
            <div v-else>
                <!-- Capo -->
                <div>
                    <label for="capo" class="block text-sm font-medium mb-2">Capo</label>
                    <input
                        id="capo"
                        v-model.number="capo"
                        type="number"
                        min="0"
                        max="12"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

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
