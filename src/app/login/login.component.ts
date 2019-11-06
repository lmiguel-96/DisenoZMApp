import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { Logger, untilDestroyed } from '@app/core';
import { BehaviorSubject } from 'rxjs';
import { filter, pluck } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { NotificationService } from '@app/core/notification.service';

const log = new Logger('Login');

export enum screenModeEnum {
  loginMode = 'LOGIN',
  registerMode = 'REGISTER'
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [NotificationService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnDestroy {
  mode = screenModeEnum;
  screenMode = new BehaviorSubject<screenModeEnum.loginMode | screenModeEnum.registerMode>(screenModeEnum.loginMode);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private credentialsService: CredentialsService,
    private angularFireAuth: AngularFireAuth,
    private notificationService: NotificationService
  ) {}

  handleLoginSuccess() {
    this.credentialsService.stateChanged
      .pipe(
        filter(state => Boolean(state && state.currentUser)),
        pluck('currentUser'),
        untilDestroyed(this)
      )
      .subscribe({
        next: currentUser => {
          if (currentUser.status === 'active') {
            this.router
              .navigate([this.activatedRoute.snapshot.queryParams.redirect || '/home'], { replaceUrl: true })
              .then(() => this.notificationService.loggedIn(currentUser.name));
          } else if (currentUser.status === 'inactive') {
            this.angularFireAuth.auth.signOut().then(() => {
              this.router.navigate(['/login']);
              this.notificationService.userBanned();
              this.credentialsService.clearCrendentials();
            });
          }
        }
      });
  }

  ngOnDestroy(): void {}
}
