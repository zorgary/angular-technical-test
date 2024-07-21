// song.model.ts

export interface Song {
    id: number;
    title: string;
    poster: string;
    genre: MusicGenre[];
    year: number;
    duration: number;
    rating: number;
    artist: number;
    country: string;
}

export enum MusicGenre {
    Pop = "Pop",
    Rock = "Rock",
    Alternative = "Alternative",
    Chill = "Chill",
    Heavy = "Heavy",
    Romance = "Romance",
    Blues = "Blues",
    PsychedelicRock = "Psychedelic rock"
}