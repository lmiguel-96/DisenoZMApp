import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { Logger } from '@app/core';
import { BehaviorSubject } from 'rxjs';
import { filter, pluck } from 'rxjs/operators';

const log = new Logger('Login');

export enum screenModeEnum {
  loginMode = 'LOGIN',
  registerMode = 'REGISTER'
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  mode = screenModeEnum;
  screenMode = new BehaviorSubject<screenModeEnum.loginMode | screenModeEnum.registerMode>(screenModeEnum.loginMode);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private credentialsService: CredentialsService
  ) {}

  async handleLoginSuccess() {
    const currentUser = await this.credentialsService.stateChanged
      .pipe(
        filter(state => Boolean(state && state.currentUser)),
        pluck('currentUser')
      )
      .toPromise();
    if (currentUser.status !== 'inactive') {
      this.router.navigate([this.activatedRoute.snapshot.queryParams.redirect || '/home'], { replaceUrl: true });
    }
  }
}
