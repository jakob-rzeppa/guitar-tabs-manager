// ============================================================================
// Base Response DTOs
// ============================================================================

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
    payload?: T;
    message?: string;
}

// ============================================================================
// Artist DTOs
// ============================================================================

/**
 * Artist entity
 */
export interface ArtistDto {
    id: number;
    name: string;
}

/**
 * Request body for creating an artist
 */
export interface CreateArtistRequest {
    name: string;
}

/**
 * Request body for updating an artist
 */
export interface UpdateArtistRequest {
    name?: string;
}

// ============================================================================
// Tag DTOs
// ============================================================================

/**
 * Tag entity
 */
export interface TagDto {
    id: number;
    name: string;
}

/**
 * Request body for creating a tag
 */
export interface CreateTagRequest {
    name: string;
}

/**
 * Request body for updating a tag
 */
export interface UpdateTagRequest {
    name?: string;
}

// ============================================================================
// Sheet DTOs
// ============================================================================

/**
 * Sheet entity (reduced format - without full content)
 * Used for list views
 */
export interface SheetListItemDto {
    id: number;
    title: string;
    artist: ArtistDto | null;
    tags: TagDto[];
}

/**
 * Sheet entity (full format - with content)
 * Used for detail views
 */
export interface SheetDto {
    id: number;
    title: string;
    artist: ArtistDto | null;
    tags: TagDto[];
    capo: number;
    source_url: string;
    content: string;
}

/**
 * Request body for creating a sheet
 */
export interface CreateSheetRequest {
    title: string;
    content: string;
    capo: number;
    source_url: string;
    artist_id?: number;
    tag_ids?: number[];
}

/**
 * Request body for updating a sheet
 */
export interface UpdateSheetRequest {
    title?: string;
    content?: string;
    capo?: number;
    source_url?: string;
    artist_id?: number;
    tag_ids?: number[];
}

/**
 * Request body for formatting sheet content
 */
export interface FormatSheetRequest {
    content: string;
}

/**
 * Dto for formatting sheet content
 */
export interface FormatSheetDto {
    content: string;
}

/**
 * Request body for transposing sheet content
 */
export interface TransposeSheetRequest {
    content: string;
    dir: number;
}

/**
 * Dto for transposing sheet content
 */
export interface TransposeSheetDto {
    content: string;
}

// ============================================================================
// Delete Response DTOs
// ============================================================================

/**
 * No content response when deleting a resource
 */
export type DeleteDto = void;
