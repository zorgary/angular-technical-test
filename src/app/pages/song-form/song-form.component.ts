import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { catchError, forkJoin, Observable, of, switchMap } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { Artist } from '../../models/artist.model';
import { RecordLabel } from '../../models/record-label.model';
import { MusicGenre, Song } from '../../models/song.model';
import { SongsService } from '../../services/songs.service';

@Component({
  selector: 'app-song-form',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, 
    InputTextModule, DropdownModule, MultiSelectModule, InputNumberModule , ProgressSpinnerModule
  ],
  templateUrl: './song-form.component.html',
  styleUrls: ['./song-form.component.less']
})
export class SongFormComponent implements OnInit {
  currentYear;
  songForm: FormGroup;
  editing: boolean = false;
  songId!: number;
  createdSongId!: number;
  genres: { label: string, value: MusicGenre }[] = [];
  currentRecordLabelIds: string[] = [];
  recordLabels: { label: string, value: string, songs: number[] }[] = [];
  artists: { label: string, value: number }[] = [];
  loading: boolean = true;
  submitting: boolean = false;
  error: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private songsService: SongsService
  ) {
    this.currentYear = new Date().getFullYear();

    this.songForm = this.fb.group({
      title: ['', Validators.required],
      poster: ['', [Validators.required, Validators.pattern('https?://.+')]],
      genre: [[], Validators.required],
      recordLabels: [[]],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(this.currentYear)]],
      duration: ['', [Validators.required, Validators.min(0), Validators.max(1200)]],
      rating: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
      artist: ['', Validators.required],
      country: ['', Validators.required]
    });

    // Map enum values to select options
    this.genres = Object.keys(MusicGenre).map(key => ({
      label: MusicGenre[key as keyof typeof MusicGenre],
      value: MusicGenre[key as keyof typeof MusicGenre]
    }));
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.songId = +params['id'];
      this.loadInitialData();
    });
  }

  loadInitialData(): void {
    const requests: { 
      recordLabels: Observable<RecordLabel[]>; 
      artists: Observable<Artist[]>; 
      song?: Observable<Song> 
    } = {
      recordLabels: this.songsService.getRecordLabels(),
      artists: this.songsService.getArtists()
    };

    if (this.songId) {
      this.editing = true;
      requests['song'] = this.songsService.getSongDetails(this.songId);
    }

    forkJoin(requests).subscribe({
      next: (result: { recordLabels: RecordLabel[], artists: Artist[], song?: Song }) => {
        if (result.song) { 
          this.songForm.patchValue(result.song);
          this.currentRecordLabelIds = result.recordLabels
            .filter(recordLabel => recordLabel.songs.includes(this.songId))
            .map(recordLabel => recordLabel.id.toString());
          
          this.songForm.patchValue({
            recordLabels: this.currentRecordLabelIds
          });
        }
        this.recordLabels = result.recordLabels.map((record: RecordLabel) => ({ label: record.name, value: record.id.toString(), songs: record.songs }));
        this.artists = result.artists.map((artist: Artist) => ({ label: artist.name, value: artist.id }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/songs']);
      }
    });
  }

  onSubmit(): void {
    if (this.songForm.valid) {
      const { recordLabels, ...songToSubmit }: { recordLabels: string[] } = this.songForm.value;
  
      if (this.editing) {
        // Edit song (and update record labels)
        this.submitting = true;
        this.songsService.updateSong(songToSubmit as Song, this.songId).pipe(
          switchMap((res: Song) => {
            const recordLabelsToRemove = this.currentRecordLabelIds.filter(id => !recordLabels || !recordLabels.includes(id));
            const recordLabelsToAdd = recordLabels ? recordLabels.filter(id => !this.currentRecordLabelIds.includes(id)) : [];
            const allRecordLabelsToUpdate = [...recordLabelsToAdd, ...recordLabelsToRemove];
        
            if (allRecordLabelsToUpdate.length === 0) {
              return of(null);
            }
        
            const updateObservables = allRecordLabelsToUpdate.map(id => {
              const recordLabel = this.recordLabels.find(record => record.value === id);
              if (!recordLabel) return of(null);
        
              if (recordLabelsToAdd.includes(id)) {
                recordLabel.songs.push(res.id);
              } else if (recordLabelsToRemove.includes(id)) {
                recordLabel.songs = recordLabel.songs.filter(songId => songId !== res.id);
              }
        
              return this.songsService.updateSongInRecordLabel(id, recordLabel.songs);
            });
        
            return forkJoin(updateObservables).pipe(
              catchError(error => {
                console.error('Error updating record labels:', error);
                return of(null);
              })
            );
          })
        ).subscribe({
          next: () => {
            this.router.navigate(['/songs', this.songId]);
          },
          error: error => {
            console.error('Error updating song:', error);
          }
        });
      } else {
        // Create song (and update record labels selected)
        this.submitting = true;
        this.songsService.createSong(songToSubmit as Song).pipe(
          switchMap((res: Song) => {
            this.createdSongId = res.id;
            if (recordLabels.length === 0) {
              return of(null);
            } else {
              const updateObservables = recordLabels.map((recordLabelId) => {
                const recordLabel = this.recordLabels.find((record) => record.value === recordLabelId);
                if (recordLabel) {
                  recordLabel.songs.push(res.id);
                  return this.songsService.updateSongInRecordLabel(recordLabelId, recordLabel.songs);
                } else {
                  return of(null);
                }
              });
              return forkJoin(updateObservables).pipe(
                catchError((error) => {
                  console.error('Error updating record labels:', error);
                  return of(null);
                })
              );
            }
          })
        ).subscribe({
          next: () => {
            this.router.navigate(['/songs', this.createdSongId]);
          },
          error: (error) => {
            console.error('Error creating song:', error);
          }
        });
      }
    } else {
      this.songForm.markAllAsTouched();
    }
  }

  goBack(): void {
    if (this.songId) this.router.navigate(['/songs', this.songId]);
    else this.router.navigate(['/songs']);
  }
}
