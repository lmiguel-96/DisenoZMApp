import { Title } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';

import { AuthenticationService, CredentialsService, I18nService } from '@app/core';
import { NotificationService } from '@app/core/notification.service';
import { filter, map, pluck } from 'rxjs/operators';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {
  username$ = this.credentialsService.stateChanged.pipe(
    filter(state => Boolean(state && state.currentUser)),
    pluck('currentUser'),
    map(({ name, lastName }) => `${name} ${lastName}`)
  );

  constructor(
    private router: Router,
    private titleService: Title,
    private media: MediaObserver,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private notificationService: NotificationService
  ) {}

  logout(): void {
    this.authenticationService.logout().then(() => {
      this.router
        .navigate(['/login'], { replaceUrl: true })
        .then(() => setTimeout(() => this.notificationService.loggedOut(), 2000));
    });
  }

  get isMobile(): boolean {
    return this.media.isActive('xs') || this.media.isActive('sm');
  }

  get title(): string {
    return this.titleService.getTitle();
  }
}
