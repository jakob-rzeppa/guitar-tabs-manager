export type APIResponse<T> = {
    content?: T;
    message?: string;
};

export type Tab = {
    id: string;
    title: string;
    artist: Artist | null;
    tags: Tag[];
    capo: number;
    content: string;
};

export type Tag = {
    id: string;
    name: string;
};

export type Artist = {
    id: string;
    name: string;
};
