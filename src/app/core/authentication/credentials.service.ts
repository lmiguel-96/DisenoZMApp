import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { StoreState } from '@app/core/models/store.model';
import { map, switchMap, retryWhen } from 'rxjs/operators';
import { of, fromEvent } from 'rxjs';
import { User } from '@app/core/models/user.model';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';

const INITIAL_STATE = {
  user: null as User,
  isAuthenticated: false
};

export enum CredentialStoreActions {
  setInitialStateCredentials = 'INITIAL_STATE_CREDENTIALS',
  setActiveUser = 'SET_ACTIVE_USER',
  setAuthState = 'SET_AUTH_STATE'
}

/**
 * Provides storage for authentication credentials.
 * The Credentials interface should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root'
})
export class CredentialsService extends ObservableStore<StoreState> {
  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFireStore: AngularFirestore,
    private router: Router,
    private notificationService: NotificationService
  ) {
    super({});
    this.setState(INITIAL_STATE, CredentialStoreActions.setInitialStateCredentials);
    this.fetchAuthState();
  }

  fetchAuthState(): void {
    this.angularFireAuth.authState
      .pipe(
        switchMap(authState => {
          return authState
            ? this.angularFireStore
                .doc(`users/${authState.uid}`)
                .snapshotChanges()
                .pipe(
                  map(userDoc => {
                    const user = userDoc.payload.data() as User;
                    if (user.status === 'inactive') {
                      this.angularFireAuth.auth.signOut().then(() => {
                        this.router.navigate(['/login']);
                        this.notificationService.userBanned();
                        this.setState({ isAuthenticated: false }, CredentialStoreActions.setAuthState);
                        this.setState({ currentUser: null }, CredentialStoreActions.setActiveUser);
                      });
                      return null;
                    } else {
                      return user;
                    }
                  })
                )
            : of(null);
        }),
        retryWhen(() => fromEvent(window, 'online'))
      )
      .subscribe({
        next: (user: User) => {
          this.setState({ isAuthenticated: Boolean(user) }, CredentialStoreActions.setAuthState);
          this.setState({ currentUser: user }, CredentialStoreActions.setActiveUser);
        }
      });
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    const { isAuthenticated } = this.getState();
    return isAuthenticated;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): User | null {
    const { currentUser } = this.getState();
    return currentUser;
  }
}
