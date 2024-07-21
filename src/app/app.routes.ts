import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SongListComponent } from './pages/song-list/song-list.component';
import { SongDetailsComponent } from './pages/song-details/song-details.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'songs', component: SongListComponent },
    { path: 'songs/:id', component: SongDetailsComponent },
    { path: '**', redirectTo: '/home' } // Fallback
];
