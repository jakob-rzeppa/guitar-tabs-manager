export type APIResponse<T> = {
    content?: T,
    message?: string
}

export type Tab = {
    id: number,
    title: string,
    artist: Artist,
    tags: Tag[]
    capo: number,
    content: string,
}

export type Tag = {
    id: number,
    name: string
}

export type Artist = {
    id: number,
    name: string
}