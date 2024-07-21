import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Song } from '../models/song.model';
import { Artist } from '../models/artist.model';
import { RecordLabel } from '../models/record-label.model';


@Injectable({
  providedIn: 'root'
})
export class SongsService {

  private baseUrl: string = environment.backendUri;
  private songEndpoint: string = environment.songEndpoint;
  private artistEndpoint: string = environment.artistEndpoint;
  private recordLabelEndpoint: string = environment.recordLabelEndpoint;
  
  constructor(private http: HttpClient) { }

  // Songs

  getSongs(): Observable<Song[]> {
    const url = `${this.baseUrl}${this.songEndpoint}`;
    return this.http.get<Song[]>(url);
  }

  getSongDetails(songId: number): Observable<Song> {
    const url = `${this.baseUrl}${this.songEndpoint}/${songId}`;
    return this.http.get<Song>(url);
  }

  removeSong(songId: number): Observable<void> {
    const url = `${this.baseUrl}${this.songEndpoint}/${songId}`;
    return this.http.delete<void>(url);
  }
  
  // Artists

  getArtists(): Observable<Artist[]> {
    const url = `${this.baseUrl}${this.artistEndpoint}`;
    return this.http.get<Artist[]>(url);
  }

  getArtistDetails(artistId: number): Observable<Artist> {
    const url = `${this.baseUrl}${this.artistEndpoint}/${artistId}`;
    return this.http.get<Artist>(url);
  }

  // Record Labels

  getRecordLabels(): Observable<RecordLabel[]> {
    const url = `${this.baseUrl}${this.recordLabelEndpoint}`;
    return this.http.get<RecordLabel[]>(url);
  }

}
