// record-label.model.ts

export interface RecordLabel {
    id: number;
    name: string;
    country: string;
    createYear: number;
    employees: number;
    rating: number;
    songs: number[];
  }