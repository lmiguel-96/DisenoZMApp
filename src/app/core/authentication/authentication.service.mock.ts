import { Observable, of } from 'rxjs';

export class MockAuthenticationService {
  credentials: any | null = {
    username: 'test',
    token: '123'
  };

  login(context: any): Observable<any> {
    return of({
      username: context.username,
      token: '123456'
    });
  }

  logout(): Observable<boolean> {
    this.credentials = null;
    return of(true);
  }
}
