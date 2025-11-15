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
        <div class="p-6 md:p-10 max-w-4xl mx-auto">
            <div class="flex items-center gap-3 mb-8">
                <div class="bg-accent rounded-full p-3">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-8 w-8 text-accent-content"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16m-7 6h7"
                        />
                    </svg>
                </div>
                <h1 class="text-5xl font-bold">Format Tab</h1>
            </div>

            <LoadingPlaceholder v-if="tabsStore.loading || formatLoading" />
            <ErrorDisplay
                v-else-if="tabsStore.error !== null || formatError !== null"
                :message="tabsStore.error || formatError"
            />
            <div v-else-if="formattedTabContent === null" class="space-y-6">
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
                    <span
                        >Click the button below to automatically format this tab for better
                        readability.</span
                    >
                </div>
                <button @click="handleFormat" class="btn btn-accent btn-lg gap-2">
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
                            d="M4 6h16M4 12h16m-7 6h7"
                        />
                    </svg>
                    Format Tab
                </button>
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
                <div>
                    <label class="label" for="content">
                        <span class="label-text text-base font-semibold"
                            >Formatted Tab Content</span
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
