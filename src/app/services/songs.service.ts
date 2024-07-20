import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Song } from '../models/song.model';
import { Artist } from '../models/artist.model';


@Injectable({
  providedIn: 'root'
})
export class SongsService {

  private baseUrl: string = environment.backendUri;
  private songEndpoint: string = environment.songEndpoint;
  private artistEndpoint: string = environment.artistEndpoint;
  
  constructor(private http: HttpClient) { }

  getSongs(): Observable<Song[]> {
    const url = `${this.baseUrl}${this.songEndpoint}`;
    return this.http.get<Song[]>(url);
  }

  getArtists(): Observable<Artist[]> {
    const url = `${this.baseUrl}${this.artistEndpoint}`;
    return this.http.get<Artist[]>(url);
  }

}
