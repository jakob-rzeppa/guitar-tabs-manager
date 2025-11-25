export type Sheet = {
    id: number;
    title: string;
    artist: Artist | null;
    tags: Tag[];
    capo: number;
    sourceURL: string;
    content: string;
};

export type SheetListItem = {
    id: number;
    title: string;
    artist: Artist | null;
    tags: Tag[];
};

export type Tag = {
    id: number;
    name: string;
};

export type Artist = {
    id: number;
    name: string;
};
