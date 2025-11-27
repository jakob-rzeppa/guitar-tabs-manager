import { useArtistStore } from "@/stores/artistStore";
import type { ArtistDto } from "@/types/dtos";
import api, { useApiInStore } from "../api";
import type { Artist } from "@/types/types";
import { useSheetStore } from "@/stores/sheetStore";

export async function fetchAllArtists(options: { force?: boolean } = {}): Promise<void> {
    const artistStore = useArtistStore();

    // Skip if already loaded unless force is true
    if (!options.force && artistStore.artists.length > 0) return;

    await useApiInStore<ArtistDto[]>({
        store: artistStore,
        apiCall: () => api.get('/artists'),
        onSuccess: ({ data }) => {
            if (!data.payload) {
                artistStore.error = 'Request content is empty';
                return;
            }

            artistStore.artists = data.payload.map((artistDto) => ({
                id: artistDto.id,
                name: artistDto.name,
            }));
        },
    });
}

export async function createArtist(artist: Partial<Artist>): Promise<void> {
    const artistStore = useArtistStore();

    await useApiInStore<ArtistDto>({
        store: artistStore,
        apiCall: () => api.post('/artists', artist),
        onSuccess: ({ data }) => {
            if (!data.payload) {
                artistStore.error = 'Request content is empty';
                return;
            }

            artistStore.artists.push({
                id: data.payload.id,
                name: data.payload.name,
            });
        },
    });
}

export async function updateArtist(artistId: number, artist: Partial<Omit<Artist, 'id'>>): Promise<void> {
    const artistStore = useArtistStore();

    const payload = { name: artist.name };

    await useApiInStore<ArtistDto>({
        store: artistStore,
        apiCall: () => api.put(`/artists/${artistId}`, payload),
        onSuccess: ({ data }) => {
            if (!data.payload) {
                artistStore.error = 'Response content is empty';
                return;
            }

            const index = artistStore.artists.findIndex((a) => a.id === artistId);
            if (index !== -1) {
                artistStore.artists[index] = data.payload;
            }

            // Update artist name in sheets list
            const sheetStore = useSheetStore();
            sheetStore.sheetsList.forEach((sheet) => {
                if (sheet.artist && sheet.artist.id === artistId) {
                    sheet.artist = artistStore.artists[index];
                }
            });

            // Update artist name in detailed sheets
            Object.values(sheetStore.detailedSheets).forEach((sheet) => {
                if (sheet.artist && sheet.artist.id === artistId) {
                    sheet.artist = artistStore.artists[index];
                }
            });
        },
    });
}

export async function deleteArtist(artistId: number): Promise<void> {
    const artistStore = useArtistStore();

    await useApiInStore<void>({
        store: artistStore,
        apiCall: () => api.delete(`/artists/${artistId}`),
        onSuccess: () => {
            artistStore.artists = artistStore.artists.filter((a) => a.id !== artistId);

            // Clear artist reference in sheets list
            const sheetStore = useSheetStore();
            sheetStore.sheetsList.forEach((sheet) => {
                if (sheet.artist && sheet.artist.id === artistId) {
                    sheet.artist = null;
                }
            });

            // Clear artist reference in detailed sheets
            Object.keys(sheetStore.detailedSheets).forEach((key) => {
                const sheet = sheetStore.detailedSheets[key];
                if (sheet.artist && sheet.artist.id === artistId) {
                    sheetStore.detailedSheets[key].artist = null;
                }
            });
        },
    });
}