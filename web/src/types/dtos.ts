// ============================================================================
// Base Response DTOs
// ============================================================================

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
    content?: T;
    message?: string;
}

/**
 * API error response
 */
export interface ApiError {
    error: string;
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
// Tab DTOs
// ============================================================================

/**
 * Tab entity (reduced format - without full content)
 * Used for list views
 */
export interface TabListItemDto {
    id: number;
    title: string;
    artist: ArtistDto | null;
    tags: TagDto[];
}

/**
 * Tab entity (full format - with content)
 * Used for detail views
 */
export interface TabDto {
    id: number;
    title: string;
    artist: ArtistDto | null;
    tags: TagDto[];
    capo: number;
    source_url: string | null;
    content: string;
}

/**
 * Request body for creating a tab
 */
export interface CreateTabRequest {
    title: string;
    content: string;
    capo: number;
    source_url?: string;
    artist_id?: number;
    tag_ids?: number[];
}

/**
 * Request body for updating a tab
 */
export interface UpdateTabRequest {
    title?: string;
    content?: string;
    capo?: number;
    source_url?: string;
    artist_id?: number;
    tag_ids?: number[];
}

/**
 * Request body for formatting tab content
 */
export interface FormatTabRequest {
    content: string;
}

/**
 * Response for formatting tab content
 */
export interface FormatTabResponse {
    content: string;
}

/**
 * Request body for transposing tab content
 */
export interface TransposeTabRequest {
    content: string;
    dir: number;
}

/**
 * Response for transposing tab content
 */
export interface TransposeTabResponse {
    content: string;
}

// ============================================================================
// Delete Response DTOs
// ============================================================================

/**
 * Response when deleting a resource
 */
export interface DeleteResponse {
    message: string;
}
