<script setup lang="ts">
import ContentWrapper from '@/components/ContentWrapper.vue';
import { useRoute, useRouter } from 'vue-router';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import BackLink from '@/components/BackLink.vue';
import PageHeader from '@/components/PageHeader.vue';
import SaveCancelButtons from '@/components/SaveCancelButtons.vue';
import FormatIcon from '@/components/icons/FormatIcon.vue';
import InfoIcon from '@/components/icons/InfoIcon.vue';
import { computed, onMounted } from 'vue';
import { useSheetsStore } from '@/stores/sheetsStore';
import { useSheetFormatter } from '@/composables/useSheetFormatter';
import { fetchSheet, updateSheet } from '@/services/api/sheetClient';

const route = useRoute();
const router = useRouter();

const sheetId = computed(() => route.params.id as string);

const sheetsStore = useSheetsStore();

const { formatLoading, formatError, formattedSheetContent, formatSheet } = useSheetFormatter();

// The computed property to bind the textarea input to the formatted sheet content
const textareaInput = computed({
    get: () => formattedSheetContent.value,
    set: (value: string) => {
        formattedSheetContent.value = value;
    },
});

onMounted(() => {
    fetchSheet(sheetId.value);
});

const handleFormat = () => {
    if (sheetsStore.detailedSheets[sheetId.value]) {
        formatSheet(sheetsStore.detailedSheets[sheetId.value].content);
    }
};

const handleSave = async () => {
    if (!formattedSheetContent.value) return;

    await updateSheet(sheetId.value, { content: formattedSheetContent.value });

    if (!sheetsStore.error) {
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
                <PageHeader title="Format Sheet" icon-color="accent">
                    <template #icon>
                        <FormatIcon class="h-8 w-8 text-accent-content" />
                    </template>
                </PageHeader>
            </div>

            <LoadingPlaceholder v-if="sheetsStore.loading || formatLoading" />
            <ErrorDisplay
                v-else-if="sheetsStore.error !== null || formatError !== null"
                :message="sheetsStore.error || formatError"
            />
            <div v-else-if="formattedSheetContent === null" class="space-y-6">
                <div class="alert alert-info shadow-lg">
                    <InfoIcon />
                    <span
                        >Click the button below to automatically format this sheet for better
                        readability.</span
                    >
                </div>
                <button @click="handleFormat" class="btn btn-accent btn-lg gap-2">
                    <FormatIcon class="h-6 w-6" />
                    Format Sheet
                </button>
                <div class="card bg-base-200 shadow-xl">
                    <div class="card-body">
                        <h3 class="card-title text-sm opacity-60">Original Content:</h3>
                        <pre class="text-sm overflow-x-auto">{{
                            sheetsStore.detailedSheets[sheetId]?.content
                        }}</pre>
                    </div>
                </div>
            </div>
            <div v-else class="space-y-6">
                <div>
                    <label class="label" for="content">
                        <span class="label-text text-base font-semibold"
                            >Formatted Sheet Content</span
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
