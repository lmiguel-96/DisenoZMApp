import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { User } from '@app/core/models/user.model';
import { filter, pluck, map } from 'rxjs/operators';
import { untilDestroyed } from '@app/core';
import { StoreState } from '@app/core/models/store.model';
import { DentistService } from './dentist.service';
import { UserDialogComponent } from '../users/user-dialog/user-dialog.component';
import { NotificationService } from '@app/core/notification.service';

@Component({
  selector: 'app-dentist',
  templateUrl: './dentist.component.html',
  styleUrls: ['./dentist.component.scss']
})
export class DentistComponent implements OnInit, OnDestroy {
  @ViewChild('usersPaginator', { static: true }) usersPaginator: MatPaginator;
  @ViewChild('dentistsPaginator', { static: true }) dentistsPaginator: MatPaginator;
  displayedColumnsUsers: string[] = ['name', 'lastName', 'setDentist'];
  displayedColumnsDentists: string[] = ['name', 'lastName', 'quitDentist'];
  dataSourceUsers: MatTableDataSource<User>;
  dataSourceDentists: MatTableDataSource<User>;

  constructor(
    private dentistService: DentistService,
    private matDialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.handleSyncDentistsData();
    this.dentistService.stateChanged
      .pipe(
        filter((state: StoreState) => Boolean(state && state.allUsers) && Boolean(state && state.dentists)),
        map(({ allUsers, dentists }) => [allUsers, dentists] as const),
        untilDestroyed(this)
      )
      .subscribe({
        next: ([allUsers, dentists]) => {
          this.dataSourceUsers = new MatTableDataSource<User>(allUsers);
          this.dataSourceUsers.paginator = this.usersPaginator;
          this.dataSourceDentists = new MatTableDataSource<User>(dentists);
          this.dataSourceDentists.paginator = this.dentistsPaginator;
        }
      });
  }

  handleOpenUserDialog(user?: User): void {
    this.matDialog.open(UserDialogComponent, {
      width: '520px',
      height: 'auto',
      autoFocus: true,
      data: { user }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSourceDentists.filter = filterValue.trim().toLowerCase();
    this.dataSourceUsers.filter = filterValue.trim().toLowerCase();
  }

  handleSyncDentistsData(): void {
    this.dentistService.getDentistsData();
  }

  handleSetDentistRole(user: User): void {
    this.dentistService.setDentistRole(user).then(result => this.notificationService.userStatusUpdated(result));
  }

  handleQuitDentistRole(user: User): void {
    this.dentistService.quitDentistRole(user).then(result => this.notificationService.userStatusUpdated(result));
  }

  trackByService(index: number, service: User): string {
    return service.userID;
  }

  ngOnDestroy(): void {}
}
