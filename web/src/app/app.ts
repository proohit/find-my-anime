import { Component, inject, signal } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppToolbar } from './app-toolbar/app-toolbar';

@Component({
  selector: 'app-root',
  imports: [RouterModule, AppToolbar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  iconRegistry = inject(MatIconRegistry);
  sanitizer = inject(DomSanitizer);

  protected readonly title = signal('@find-my-anime/web');

  constructor() {
    this.iconRegistry.addSvgIcon(
      'github',
      this.sanitizer.bypassSecurityTrustResourceUrl('/icons/github.svg'),
    );
  }
}
