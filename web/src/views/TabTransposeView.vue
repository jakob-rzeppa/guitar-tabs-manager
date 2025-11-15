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
        <div class="p-6 md:p-10 max-w-4xl mx-auto">
            <div class="flex items-center gap-3 mb-8">
                <div class="bg-secondary rounded-full p-3">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-8 w-8 text-secondary-content"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                    </svg>
                </div>
                <h1 class="text-5xl font-bold">Transpose Tab</h1>
            </div>

            <LoadingPlaceholder v-if="tabsStore.loading || transposeLoading" />
            <ErrorDisplay
                v-else-if="tabsStore.error !== null || transposeError !== null"
                :message="tabsStore.error || transposeError"
            />
            <div v-else-if="transposedTabContent === null || capo === null" class="space-y-6">
                <div class="alert alert-info shadow-lg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>Choose a transpose option to change the key of this tab.</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        @click="handleTranspose('up', false)"
                        class="btn btn-accent btn-lg gap-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 15l7-7 7 7"
                            />
                        </svg>
                        Transpose Up
                    </button>
                    <button
                        @click="handleTranspose('down', false)"
                        class="btn btn-accent btn-lg gap-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                        Transpose Down
                    </button>
                    <button
                        @click="handleTranspose('up', true)"
                        class="btn btn-secondary btn-lg gap-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 15l7-7 7 7"
                            />
                        </svg>
                        Transpose Up + Adjust Capo
                    </button>
                    <button
                        @click="handleTranspose('down', true)"
                        class="btn btn-secondary btn-lg gap-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                        Transpose Down + Adjust Capo
                    </button>
                </div>

                <div class="card bg-base-200 shadow-xl">
                    <div class="card-body">
                        <h3 class="card-title text-sm opacity-60">Original Content:</h3>
                        <pre class="text-sm overflow-x-auto">{{
                            tabsStore.detailedTabs[tabId]?.content
                        }}</pre>
                    </div>
                </div>
            </div>
            <div v-else class="space-y-6">
                <!-- Capo -->
                <div>
                    <label class="label" for="capo">
                        <span class="label-text text-base font-semibold">Capo</span>
                        <span class="label-text-alt">Fret position (0-12)</span>
                    </label>
                    <input
                        id="capo"
                        v-model.number="capo"
                        type="number"
                        min="0"
                        max="12"
                        class="input input-bordered input-lg w-full"
                    />
                </div>

                <div>
                    <label class="label" for="content">
                        <span class="label-text text-base font-semibold"
                            >Transposed Tab Content</span
                        >
                        <span class="label-text-alt">Review and edit if needed</span>
                    </label>
                    <textarea
                        id="content"
                        v-model="textareaInput"
                        rows="20"
                        required
                        class="textarea textarea-bordered w-full font-mono text-sm h-96"
                        placeholder="Enter tab notation here..."
                    ></textarea>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-4">
                    <button @click="handleSave" class="btn btn-primary btn-lg gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        Save Changes
                    </button>
                    <button
                        type="button"
                        @click="handleCancel"
                        class="btn btn-outline btn-lg gap-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </ContentWrapper>
</template>
