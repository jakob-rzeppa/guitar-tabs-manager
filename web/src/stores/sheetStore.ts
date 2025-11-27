import { defineStore } from 'pinia';
import type { Sheet, SheetListItem } from '@/types/types.ts';

interface SheetState {
    detailedSheets: Record<string, Sheet>;
    sheetsList: SheetListItem[];
    loading: boolean;
    error: string | null;
}

export const useSheetStore = defineStore('sheet', {
    state: (): SheetState => ({
        detailedSheets: {},
        sheetsList: [],
        loading: false,
        error: null,
    }),
});
