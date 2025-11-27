<script setup lang="ts">
import ContentWrapper from '@/components/ContentWrapper.vue';
import { useRoute, useRouter } from 'vue-router';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import BackLink from '@/components/BackLink.vue';
import PageHeader from '@/components/PageHeader.vue';
import SaveCancelButtons from '@/components/SaveCancelButtons.vue';
import MusicIcon from '@/components/icons/MusicIcon.vue';
import InfoIcon from '@/components/icons/InfoIcon.vue';
import ChevronUpIcon from '@/components/icons/ChevronUpIcon.vue';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue';
import { computed, onMounted, ref } from 'vue';
import { useSheetStore } from '@/stores/sheetStore';
import { useSheetTransposer } from '@/composables/useSheetTransposer';
import { fetchSheet, updateSheet } from '@/services/api/sheetClient';

const route = useRoute();
const router = useRouter();

const sheetId = computed(() => route.params.id as string);

const sheetStore = useSheetStore();

const { transposeLoading, transposeError, transposedSheetContent, transposeSheet } =
    useSheetTransposer();

const capo = ref<number | null>(null);
// The computed property to bind the textarea input to the formatted sheet content
const textareaInput = computed({
    get: () => transposedSheetContent.value,
    set: (value: string) => {
        transposedSheetContent.value = value;
    },
});

onMounted(() => {
    fetchSheet(sheetId.value);
});

const handleTranspose = (direction: 'up' | 'down', changeCapo: boolean) => {
    if (sheetStore.detailedSheets[sheetId.value]) {
        transposeSheet(sheetStore.detailedSheets[sheetId.value].content, direction);

        capo.value = sheetStore.detailedSheets[sheetId.value].capo;
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
    if (!transposedSheetContent.value) return;

    await updateSheet(sheetId.value, {
        content: transposedSheetContent.value,
        capo: capo.value ?? undefined,
    });

    if (!sheetStore.error) {
        router.push({ name: 'sheet', params: { id: sheetId.value } });
    }
};

const handleCancel = () => {
    router.push({ name: 'sheet', params: { id: sheetId.value } });
};
</script>

<template>
    <ContentWrapper>
        <div class="p-6 md:p-10 max-w-4xl mx-auto">
            <div class="mb-8">
                <BackLink :to="{ name: 'sheet', params: { id: sheetId } }" class="mb-4" />
                <PageHeader title="Transpose Sheet" icon-color="secondary">
                    <template #icon>
                        <MusicIcon class="h-8 w-8 text-secondary-content" />
                    </template>
                </PageHeader>
            </div>

            <LoadingPlaceholder v-if="sheetStore.loading || transposeLoading" />
            <ErrorDisplay
                v-else-if="sheetStore.error !== null || transposeError !== null"
                :message="sheetStore.error || transposeError"
            />
            <div v-else-if="transposedSheetContent === null || capo === null" class="space-y-6">
                <div class="alert alert-info shadow-lg">
                    <InfoIcon />
                    <span>Choose a transpose option to change the key of this sheet.</span>
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
                            sheetStore.detailedSheets[sheetId]?.capo === 0
                                ? 'None'
                                : `Fret ${sheetStore.detailedSheets[sheetId]?.capo}`
                        }}</pre>
                        <h3 class="card-title text-sm opacity-60">Original Content:</h3>
                        <pre class="text-sm overflow-x-auto">{{
                            sheetStore.detailedSheets[sheetId]?.content
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
                            >Transposed Sheet Content</span
                        >
                        <span class="label-text-alt">Review and edit if needed</span>
                    </label>
                    <textarea
                        id="content"
                        v-model="textareaInput"
                        rows="20"
                        required
                        class="textarea textarea-bordered w-full font-mono text-sm h-96"
                        placeholder="Enter sheet notation here..."
                    ></textarea>
                </div>

                <!-- Action Buttons -->
                <SaveCancelButtons :on-save="handleSave" :on-cancel="handleCancel" />
            </div>
        </div>
    </ContentWrapper>
</template>
