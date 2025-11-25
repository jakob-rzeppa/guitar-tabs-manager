<script setup lang="ts">
import type { SheetListItem } from '@/types/types.ts';
import { useRouter } from 'vue-router';
import TagIcon from './icons/TagIcon.vue';

const router = useRouter();

interface Props {
    sheets: SheetListItem[];
}

defineProps<Props>();
</script>

<template>
    <ul class="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 p-8">
        <li v-for="sheet in sheets" :key="sheet.id">
            <div
                class="card bg-base-200 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-primary"
                @click="router.push({ name: 'sheet', params: { id: sheet.id } })"
            >
                <div class="card-body">
                    <h2 class="card-title text-lg">
                        {{ sheet.title }}
                    </h2>
                    <p v-if="sheet.artist !== null" class="text-sm text-base-content/70">
                        <span class="text-primary font-semibold">by</span> {{ sheet.artist.name }}
                    </p>
                    <div class="card-actions justify-start mt-2">
                        <div
                            v-for="tag in sheet.tags"
                            :key="tag.id"
                            class="badge badge-secondary badge-sm gap-1"
                        >
                            <TagIcon class="h-3 w-3" />
                            {{ tag.name }}
                        </div>
                    </div>
                </div>
            </div>
        </li>
    </ul>
</template>
