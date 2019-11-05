import { Injectable } from '@angular/core';
import { StoreState } from '@app/core/models/store.model';
import { ObservableStore } from '@codewithdan/observable-store';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '@app/core/models/user.model';
import { Observable, Subscription, combineLatest, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export enum DentistsStoreActions {
  setAllUsers = 'ADD_ALL_USERS',
  setDentists = 'ADD_USERS_DENTISTS',
  setInitialStateUsers = 'INITIAL_STATE_USERS'
}

@Injectable({
  providedIn: 'root'
})
export class DentistService extends ObservableStore<StoreState> {
  dentistsDataSubscription: Subscription;

  constructor(private angularFirestore: AngularFirestore) {
    super({});
  }

  getDentistsData(): void {
    // tslint:disable-next-line: curly
    if (this.dentistsDataSubscription) this.dentistsDataSubscription.unsubscribe();
    this.dentistsDataSubscription = combineLatest([this.fetchDentists(), this.fetchUsers()])
      .pipe(catchError(() => of([[], []])))
      .subscribe({
        next: ([dentists, allUsers]) => {
          this.setState({ dentists }, DentistsStoreActions.setDentists);
          this.setState({ allUsers }, DentistsStoreActions.setAllUsers);
        }
      });
  }

  cancelSubscriptions(): void {
    // tslint:disable-next-line: curly
    if (this.dentistsDataSubscription) this.dentistsDataSubscription.unsubscribe();
  }

  setDentistRole({ userID, role }: User): Promise<boolean> {
    if (!role.includes(3)) {
      role = role.concat(3);
    }
    return new Promise(resolve => {
      this.angularFirestore
        .collection('users')
        .doc(userID)
        .update({ role })
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }

  quitDentistRole({ userID, role }: User): Promise<boolean> {
    if (role.includes(3)) {
      role = role.filter(roleNumber => roleNumber !== 3);
    }
    return new Promise(resolve => {
      this.angularFirestore
        .collection('users')
        .doc(userID)
        .update({ role })
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }

  private fetchDentists(): Observable<User[]> {
    return this.angularFirestore
      .collection('users', userRef => userRef.where('role', 'array-contains', 3))
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

  private fetchUsers(): Observable<User[]> {
    return this.angularFirestore
      .collection('users')
      .snapshotChanges()
      .pipe(
        map(docs =>
          docs
            .map(users => {
              const user = users.payload.doc.data() as User;
              return {
                ...user,
                userID: users.payload.doc.id
              } as User;
            })
            .filter(user => !user.role.includes(3))
        )
      );
  }
}
