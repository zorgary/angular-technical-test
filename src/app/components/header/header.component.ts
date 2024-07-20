import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { ClickOutsideDirective } from '../../utils/click-outside.directive';
import { Subject, takeUntil } from 'rxjs';
import { NavLink } from '../../models/nav-link.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule, ClickOutsideDirective, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less'
})
export class HeaderComponent implements OnInit, OnDestroy {
  navLinks : NavLink[] = [
    { route: '/home', icon: 'assets/icons/home.svg', label: 'header.links.home', alt: 'Home' },
    { route: '/songs', icon: 'assets/icons/songs.svg', label: 'header.links.songs', alt: 'Songs' },
    { route: '', icon: 'assets/icons/artists.svg', label: 'header.links.artists', alt: 'Artists' },
    { route: '', icon: 'assets/icons/record-labels.svg', label: 'header.links.record-labels', alt: 'Record Labels' }
  ];

  private unsubscribe$ = new Subject<void>();
  currentLang: string = localStorage.getItem('language') ?? 'en';
  dropdownOpen = false;
  mobileMenuOpen = false;
  currentRoute = '';

  constructor(private translate: TranslateService, private router: Router) { }

  ngOnInit() {
    this.translate.use(this.currentLang);
    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
    });

    this.router.events
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.currentRoute = event.urlAfterRedirects;
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  isActiveRoute(route: string): boolean {
    return this.currentRoute === route;
  }

  changeLanguage(lang: string) {
    localStorage.setItem('language', lang);
    this.translate.use(lang);
    this.dropdownOpen = false;
  }

  toggleLanguageDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeLanguageDropdown() {
    this.dropdownOpen = false;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  getLinkLabel(route: string): string {
    const link = this.navLinks.find(link => link.route === route);
    return link ? link.label : '';
  }
}
