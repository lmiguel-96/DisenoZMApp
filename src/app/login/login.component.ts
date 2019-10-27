import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Logger } from '@app/core';

const log = new Logger('Login');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  handleLoginSuccess() {
    this.router.navigate([this.activatedRoute.snapshot.queryParams.redirect || '/home'], { replaceUrl: true });
  }
}
