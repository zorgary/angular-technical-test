import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SongListComponent } from './pages/song-list/song-list.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'songs', component: SongListComponent },
    { path: '**', redirectTo: '/home' } // Fallback
];
