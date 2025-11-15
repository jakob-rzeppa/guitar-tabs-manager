<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Tag } from '@/types/types.ts';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue';
import { useTagsStore } from '@/stores/tagsStore';

const model = defineModel<Tag[]>({ required: true });

const tagsStore = useTagsStore();

const inputValue = ref<string>('');

onMounted(() => {
    tagsStore.fetchAllTags();
});

function addActiveTag() {
    const tagToAdd = tagsStore.tags.find(
        (tag: Tag) => tag.name.toLowerCase() === inputValue.value.toLowerCase(),
    );

    // Since errors are handled by the tagsStore, we can just return early if something is wrong
    if (!tagToAdd) {
        return;
    }

    if (model.value.includes(tagToAdd)) {
        return;
    }

    model.value.push(tagToAdd);

    inputValue.value = '';
}

function removeActiveTag(event: Event) {
    const element = event.currentTarget as HTMLInputElement;

    const indexToRemove = model.value.findIndex((tag: Tag) => tag.id === Number(element.id));

    if (indexToRemove === -1) {
        return;
    }

    model.value.splice(indexToRemove, 1);
}
</script>

<template>
    <LoadingPlaceholder v-if="tagsStore.loading" />
    <ErrorDisplay v-else-if="tagsStore.error" :message="tagsStore.error" />
    <ErrorDisplay
        v-else-if="!tagsStore.tags || tagsStore.tags.length === 0"
        message="Something went wrong while retrieving tags."
    />
    <div v-else class="">
        <label class="input box-border w-full">
            <span class="label">Tags</span>
            <span v-if="model.length > 0" class="label">
                <span
                    v-for="tag in model"
                    class="bg-primary px-3 py-1 rounded-lg group hover:brightness-80 cursor-pointer"
                    @click="removeActiveTag"
                    :id="tag.id.toString()"
                >
                    {{ tag.name }}
                </span>
            </span>
            <input
                type="text"
                list="tags"
                placeholder="Type here"
                v-model="inputValue"
                @keypress.enter.stop="addActiveTag"
            />
            <button class="btn btn-circle btn-xs btn-outline btn-primary" @click="addActiveTag">
                +
            </button>
            <datalist id="tags">
                <option
                    v-for="tag in tagsStore.tags.filter((el: Tag) => !model.includes(el))"
                    :value="tag.name"
                />
            </datalist>
        </label>
    </div>
</template>
