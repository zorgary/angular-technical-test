import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    // Use the language stored in localStorage or the default language if it doesn't exist
    const currentLanguage = this.getCurrentLanguage();
    this.translate.use(currentLanguage);
  }

  changeLanguage(lang: string) {
    localStorage.setItem('language', lang);
    this.translate.use(lang);
  }

  private getCurrentLanguage(): string {
    return localStorage.getItem('language') ?? 'en';
  }
}
