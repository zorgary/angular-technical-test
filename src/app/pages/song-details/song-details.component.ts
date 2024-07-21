import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SongsService } from '../../services/songs.service';
import { forkJoin } from 'rxjs';
import { Song } from '../../models/song.model';
import { RecordLabel } from '../../models/record-label.model';
import { Artist } from '../../models/artist.model';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ChipModule } from 'primeng/chip';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { formatDuration } from '../../utils/time-formatters';
import { TranslateModule } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-song-details',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule,
    ProgressSpinnerModule, RatingModule, ChipModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './song-details.component.html',
  styleUrl: './song-details.component.less'
})
export class SongDetailsComponent implements OnInit {
  songId!: number;
  song: Song = {} as Song;
  artist: Artist = {} as Artist;
  recordLabels: RecordLabel[] = [];
  loading: boolean = true;
  removing: boolean = false;
  error: boolean = false;

  constructor(private songsService: SongsService, private route: ActivatedRoute, 
    private router: Router, private confirmationService: ConfirmationService,) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.songId = +id;
        forkJoin({
          song: this.songsService.getSongDetails(this.songId),
          recordLabels: this.songsService.getRecordLabels()
        }).subscribe({
          next: ({ song, recordLabels }) => {
            this.song = song;
            this.recordLabels = recordLabels.filter(recordLabel => 
              recordLabel.songs.includes(this.songId)
            );
            this.songsService.getArtistDetails(this.song.artist).subscribe({
              next: (artist) => {
                this.artist = artist;
                this.loading = false;
              },
              error: (e) => {
                this.loading = false;
                console.error('Error fetching artist', e);
              }
            })
          },
          error: (e: HttpErrorResponse) => {
            this.loading = false;
            if (e instanceof HttpErrorResponse) {
              if (e.status === 404) {
                this.router.navigate(['/songs']);
              } else {
                this.error = true;
              }
            }
          }
        })
      }
    });
  }

  goBack() {
    this.router.navigate(['/songs']);
  }

  formatSongDuration(seconds: number): string {
    return formatDuration(seconds);
  }

  editSong() {
    
  }

  removeSong() {
    this.closeMessage()
    this.removing = true;
    this.songsService.removeSong(this.songId).subscribe({
      next: () => {
        this.goBack();
      },
      error: () => {
        this.removing = false;
      }
    })
  }

  confirmRemoveDialog() { 
    this.confirmationService.confirm({}); 
  }

  closeMessage() {
    this.confirmationService.close();
  }

}
