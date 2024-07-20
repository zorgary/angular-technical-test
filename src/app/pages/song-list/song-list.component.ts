import { Component, OnInit } from '@angular/core';

import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { ChipModule } from 'primeng/chip';

import { SongsService } from '../../services/songs.service';
import { Song } from '../../models/song.model';
import { formatDuration } from '../../utils/time-formatters';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DivideByTwoPipe } from '../../utils/pipes/divide-by-two.pipe';
import { Artist } from '../../models/artist.model';
import { forkJoin } from 'rxjs';
import { TagModule } from 'primeng/tag';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, CardModule, RatingModule, ChipModule, TagModule, SkeletonModule, DivideByTwoPipe],
  templateUrl: './song-list.component.html',
  styleUrl: './song-list.component.less'
})
export class SongListComponent implements OnInit {

  songs: Song[] = [];
  artists: { [key: number]: Artist } = {};
  loading: boolean = true;

  constructor(private songsService: SongsService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    forkJoin({
      songs: this.songsService.getSongs().pipe(),
      artists: this.songsService.getArtists().pipe()
    }).subscribe({
      next: ({ songs, artists }) => {
        this.songs = songs;
        artists.forEach(artist => {
          this.artists[artist.id] = artist;
        });
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        console.error('Error fetching data', e);
      }
    })
  }

  formatSongDuration(seconds: number): string {
    return formatDuration(seconds);
  }

}
