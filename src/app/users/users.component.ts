import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { MatTableDataSource, MatPaginator } from '@angular/material';
import { UsersService } from './users.service';
import { User } from '@app/core/models/user.model';
import { untilDestroyed } from '@app/core';
import { SelectionModel } from '@angular/cdk/collections';
import { NotificationService } from '@app/core/notification.service';
import { pluck, filter } from 'rxjs/operators';
import { StoreState } from '@app/core/models/store.model';

@Component({
  selector: 'dzm-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['name', 'lastName', 'email', 'role', 'status', 'options'];
  dataSource: MatTableDataSource<User>;
  selection = new SelectionModel<User>(true, []);

  constructor(private usersService: UsersService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.handleSyncUsersData();
    this.usersService.stateChanged
      .pipe(
        filter((state: StoreState) => Boolean(state && state.registeredUsers)),
        pluck('registeredUsers'),
        untilDestroyed(this)
      )
      .subscribe({
        next: (registeredUsers: User[]) => {
          this.dataSource = new MatTableDataSource<User>(registeredUsers);
          this.dataSource.paginator = this.paginator;
        }
      });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleSyncUsersData(): void {
    this.usersService.getUsersData();
  }

  handleLockUser(user: User): void {
    this.usersService.lockUser(user).then(result => this.notificationService.userStatusUpdated(result));
  }

  handleUnlockUser(user: User): void {
    this.usersService.unlockUser(user).then(result => this.notificationService.userStatusUpdated(result));
  }

  trackByService(index: number, service: User): string {
    return service.userID;
  }

  ngOnDestroy(): void {}
}
