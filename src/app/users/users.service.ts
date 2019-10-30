import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest, Subscription, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ObservableStore } from '@codewithdan/observable-store';
import { StoreState } from '@app/core/models/store.model';
import { User } from '@app/core/models/user.model';
import { UserRole } from '@app/core/models/user-roles.model';

export enum UsersStoreActions {
  setRegisteredUsers = 'ADD_REGISTERED_USERS',
  setUserRoles = 'ADD_USER_ROLES',
  setInitialStateUsers = 'INITIAL_STATE_USERS'
}

const INITIAL_STATE = {
  registeredUsers: [],
  userRoles: []
} as StoreState;

@Injectable({
  providedIn: 'root'
})
export class UsersService extends ObservableStore<StoreState> {
  serviceDataSubscription: Subscription;
  constructor(private angularFirestore: AngularFirestore) {
    super({});
    this.setState(INITIAL_STATE, UsersStoreActions.setInitialStateUsers);
  }

  lockUser({ userID }: User): Promise<boolean> {
    return new Promise(resolve => {
      this.angularFirestore
        .collection('users')
        .doc(userID)
        .update({ status: 'inactive' })
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }

  unlockUser({ userID }: User): Promise<boolean> {
    return new Promise(resolve => {
      this.angularFirestore
        .collection('users')
        .doc(userID)
        .update({ status: 'active' })
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }

  getUsersData(): void {
    // tslint:disable-next-line: curly
    if (this.serviceDataSubscription) this.serviceDataSubscription.unsubscribe();
    this.serviceDataSubscription = combineLatest([this.fetchUsersWithAuthentication(), this.fetchUserRoles()])
      .pipe(catchError(() => of([[], []])))
      .subscribe({
        next: ([registeredUsers, userRoles]) => {
          this.setState({ registeredUsers }, UsersStoreActions.setRegisteredUsers);
          this.setState({ userRoles }, UsersStoreActions.setUserRoles);
        }
      });
  }

  deleteUser({ userID }: User): Promise<boolean> {
    return new Promise(resolve => {
      this.angularFirestore
        .collection('users')
        .doc(userID)
        .delete()
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }

  private fetchUsersWithAuthentication(): Observable<User[]> {
    return this.angularFirestore
      .collection('users', collectionRef => collectionRef.where('auth', '==', true))
      .snapshotChanges()
      .pipe(
        map(docs =>
          docs.map(users => {
            const user = users.payload.doc.data() as User;
            return {
              ...user,
              userID: users.payload.doc.id
            } as User;
          })
        )
      );
  }

  private fetchUserRoles(): Observable<UserRole[]> {
    return this.angularFirestore
      .collection('userRoles')
      .snapshotChanges()
      .pipe(map(docs => docs.map(userRole => userRole.payload.doc.data() as UserRole)));
  }
}
