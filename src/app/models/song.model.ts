// song.model.ts

export interface Song {
    id: number;
    title: string;
    poster: string;
    genre: string[];
    year: number;
    duration: number;
    rating: number;
    artist: number;
}
