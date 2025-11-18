<script setup lang="ts">
import ContentWrapper from '@/components/ContentWrapper.vue';
import { useRoute, useRouter } from 'vue-router';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import BackButton from '@/components/BackButton.vue';
import PageHeader from '@/components/PageHeader.vue';
import SaveCancelButtons from '@/components/SaveCancelButtons.vue';
import MusicIcon from '@/components/icons/MusicIcon.vue';
import InfoIcon from '@/components/icons/InfoIcon.vue';
import ChevronUpIcon from '@/components/icons/ChevronUpIcon.vue';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue';
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
            <div class="mb-8">
                <BackButton :on-click="handleCancel" class="mb-4" />
                <PageHeader title="Transpose Tab" icon-color="secondary">
                    <template #icon>
                        <MusicIcon class="h-8 w-8 text-secondary-content" />
                    </template>
                </PageHeader>
            </div>

            <LoadingPlaceholder v-if="tabsStore.loading || transposeLoading" />
            <ErrorDisplay
                v-else-if="tabsStore.error !== null || transposeError !== null"
                :message="tabsStore.error || transposeError"
            />
            <div v-else-if="transposedTabContent === null || capo === null" class="space-y-6">
                <div class="alert alert-info shadow-lg">
                    <InfoIcon />
                    <span>Choose a transpose option to change the key of this tab.</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        @click="handleTranspose('up', false)"
                        class="btn btn-accent btn-lg gap-2"
                    >
                        <ChevronUpIcon />
                        Transpose Up
                    </button>
                    <button
                        @click="handleTranspose('down', false)"
                        class="btn btn-accent btn-lg gap-2"
                    >
                        <ChevronDownIcon />
                        Transpose Down
                    </button>
                    <button
                        @click="handleTranspose('up', true)"
                        class="btn btn-secondary btn-lg gap-2"
                    >
                        <ChevronUpIcon />
                        Transpose Up + Adjust Capo up
                    </button>
                    <button
                        @click="handleTranspose('down', true)"
                        class="btn btn-secondary btn-lg gap-2"
                    >
                        <ChevronDownIcon />
                        Transpose Down + Adjust Capo down
                    </button>
                </div>

                <div class="card bg-base-200 shadow-xl">
                    <div class="card-body">
                        <h3 class="card-title text-sm opacity-60">Original Capo:</h3>
                        <pre>{{
                            tabsStore.detailedTabs[tabId]?.capo === 0
                                ? 'None'
                                : `Fret ${tabsStore.detailedTabs[tabId]?.capo}`
                        }}</pre>
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
                <SaveCancelButtons :on-save="handleSave" :on-cancel="handleCancel" />
            </div>
        </div>
    </ContentWrapper>
</template>
