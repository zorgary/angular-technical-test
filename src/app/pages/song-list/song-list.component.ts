import { Component, OnInit } from '@angular/core';

import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { ChipModule } from 'primeng/chip';

import { SongsService } from '../../services/songs.service';
import { Song } from '../../models/song.model';
import { formatDuration } from '../../utils/time-formatters';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Artist } from '../../models/artist.model';
import { forkJoin } from 'rxjs';
import { TagModule } from 'primeng/tag';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, 
    CardModule, RatingModule, ChipModule, TagModule, SkeletonModule],
  templateUrl: './song-list.component.html',
  styleUrl: './song-list.component.less'
})
export class SongListComponent implements OnInit {

  songs: Song[] = [];
  artists: { [key: number]: Artist } = {};
  loading: boolean = true;
  notFound: boolean = false;
  error: boolean = false;

  constructor(private songsService: SongsService, private router: Router) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    forkJoin({
      songs: this.songsService.getSongs(),
      artists: this.songsService.getArtists()
    }).subscribe({
      next: ({ songs, artists }) => {
        this.songs = songs;
        if (this.songs.length === 0) this.notFound = true
        artists.forEach(artist => {
          this.artists[artist.id] = artist;
        });
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        if (e instanceof HttpErrorResponse) {
          if (e.status === 404) {
            this.notFound = true;
          } else {
            this.error = true;
          }
        }
      }
    })
  }

  navigateToDetail(songId: number) {
    this.router.navigate(['/songs', songId]);
  }

  formatSongDuration(seconds: number): string {
    return formatDuration(seconds);
  }

}
