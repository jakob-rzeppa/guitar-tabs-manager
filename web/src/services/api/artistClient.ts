import { useArtistsStore } from "@/stores/artistsStore";
import type { ArtistDto } from "@/types/dtos";
import api, { useApiInStore } from "../api";
import type { Artist } from "@/types/types";
import { useSheetsStore } from "@/stores/sheetsStore";

export async function fetchAllArtists(options: { force?: boolean } = {}): Promise<void> {
    const artistsStore = useArtistsStore();

    // Skip if already loaded unless force is true
    if (!options.force && artistsStore.artists.length > 0) return;

    await useApiInStore<ArtistDto[]>({
        store: artistsStore,
        apiCall: () => api.get('/artists'),
        onSuccess: ({ data }) => {
            if (!data.payload) {
                artistsStore.error = 'Request content is empty';
                return;
            }

            artistsStore.artists = data.payload.map((artistDto) => ({
                id: artistDto.id,
                name: artistDto.name,
            }));
        },
    });
}

export async function createArtist(artist: Partial<Artist>): Promise<void> {
    const artistsStore = useArtistsStore();

    await useApiInStore<ArtistDto>({
        store: artistsStore,
        apiCall: () => api.post('/artists', artist),
        onSuccess: ({ data }) => {
            if (!data.payload) {
                artistsStore.error = 'Request content is empty';
                return;
            }

            artistsStore.artists.push({
                id: data.payload.id,
                name: data.payload.name,
            });
        },
    });
}

export async function updateArtist(artistId: number, artist: Partial<Omit<Artist, 'id'>>): Promise<void> {
    const artistsStore = useArtistsStore();

    const payload = { name: artist.name };

    await useApiInStore<ArtistDto>({
        store: artistsStore,
        apiCall: () => api.put(`/artists/${artistId}`, payload),
        onSuccess: ({ data }) => {
            if (!data.payload) {
                artistsStore.error = 'Response content is empty';
                return;
            }

            const index = artistsStore.artists.findIndex((a) => a.id === artistId);
            if (index !== -1) {
                artistsStore.artists[index] = data.payload;
            }

            // Update artist name in sheets list
            const sheetsStore = useSheetsStore();
            sheetsStore.sheetsList.forEach((sheet) => {
                if (sheet.artist && sheet.artist.id === artistId) {
                    sheet.artist = artistsStore.artists[index];
                }
            });

            // Update artist name in detailed sheets
            Object.values(sheetsStore.detailedSheets).forEach((sheet) => {
                if (sheet.artist && sheet.artist.id === artistId) {
                    sheet.artist = artistsStore.artists[index];
                }
            });
        },
    });
}

export async function deleteArtist(artistId: number): Promise<void> {
    const artistsStore = useArtistsStore();

    await useApiInStore<void>({
        store: artistsStore,
        apiCall: () => api.delete(`/artists/${artistId}`),
        onSuccess: () => {
            artistsStore.artists = artistsStore.artists.filter((a) => a.id !== artistId);

            // Clear artist reference in sheets list
            const sheetsStore = useSheetsStore();
            sheetsStore.sheetsList.forEach((sheet) => {
                if (sheet.artist && sheet.artist.id === artistId) {
                    sheet.artist = null;
                }
            });

            // Clear artist reference in detailed sheets
            Object.keys(sheetsStore.detailedSheets).forEach((key) => {
                const sheet = sheetsStore.detailedSheets[key];
                if (sheet.artist && sheet.artist.id === artistId) {
                    sheetsStore.detailedSheets[key].artist = null;
                }
            });
        },
    });
}