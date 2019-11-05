import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '@app/core/notification.service';
import { BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StoreState } from '@app/core/models/store.model';
import { UserRole } from '@app/core/models/user-roles.model';
import { User } from '@app/core/models/user.model';
import { UsersService } from '../users.service';

/**
 * IN ORDER TO DETERMINATE WETHER THE DIALOG IS CREATING OR EDITING AN EVENT, IT ACTUALLY RELIES ON
 * THE EXISTENCE OF 'service' FOR EDITION AND THE OPPOSITE FOR CREATION
 */
interface DialogData {
  user?: User;
}

@Component({
  selector: 'dzm-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDialogComponent {
  userRoleForm = this.createUserRoleForm(this.data);
  isLoading = new BehaviorSubject<boolean>(false);
  userRoles$ = this.usersService.stateChanged.pipe(
    filter((state: StoreState) => Boolean(state && state.userRoles)),
    map(({ userRoles }) => userRoles.filter(({ roleID }) => roleID === 0 || roleID === 1))
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    private usersService: UsersService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder
  ) {}

  handleCloseDialog(): void {
    this.dialogRef.close();
  }

  createUserRoleForm({ user }: DialogData = this.data): FormGroup {
    return this.formBuilder.group({
      role: [user.role || null, Validators.required],
      userID: [user.userID || null]
    });
  }

  handleSetUserRole(userRoleForm: FormGroup): void {
    if (userRoleForm.valid) {
      this.isLoading.next(true);
      this.usersService
        .setRole(userRoleForm.value)
        .then(wasSet => {
          this.notificationService.userRoleUpdated(wasSet);
          if (wasSet) {
            this.handleCloseDialog();
          }
        })
        .finally(() => this.isLoading.next(false));
    } else {
      userRoleForm.markAllAsTouched();
    }
  }

  trackByRole(index: number, userRoles: UserRole): number {
    return userRoles.roleID;
  }

  compareUserRole(roleOne: number, roleTwo: number): boolean {
    if (roleOne !== null && roleTwo !== null) {
      return roleOne === roleTwo;
    }
  }
}
