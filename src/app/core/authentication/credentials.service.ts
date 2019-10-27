import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { StoreState } from '@app/core/models/store.model';
import { map, switchMap } from 'rxjs/operators';
import { iif, of } from 'rxjs';
import { User } from '@app/core/models/user.model';

const INITIAL_STATE = {
  user: null as User,
  isAuthenticated: false
};

export enum CredentialStoreActions {
  setInitialState = 'INITIAL_STATE_CREDENTIALS',
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
  constructor(private angularFireAuth: AngularFireAuth, private angularFireStore: AngularFirestore) {
    super({
      trackStateHistory: true
    });
    this.setState(INITIAL_STATE, CredentialStoreActions.setInitialState);
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
                .pipe(map(userDoc => userDoc.payload.data()))
            : of(null);
        })
      )
      .subscribe({
        next: user => {
          this.setState({ isAuthenticated: Boolean(user) }, CredentialStoreActions.setAuthState);
          this.setState({ user }, CredentialStoreActions.setActiveUser);
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
    const { user } = this.getState();
    return user;
  }
}
