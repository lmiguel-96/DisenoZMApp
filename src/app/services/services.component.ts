import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { ServicesService } from './services.service';
import { Service } from '@app/core/models/service.model';
import { untilDestroyed } from '@app/core';
import { SelectionModel } from '@angular/cdk/collections';
import { ServiceDialogComponent } from './service-dialog/service-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { NotificationService } from '@app/core/notification.service';
import { pluck, filter } from 'rxjs/operators';
import { StoreState } from '@app/core/models/store.model';

@Component({
  selector: 'dzm-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['name', 'categories', 'options'];
  dataSource: MatTableDataSource<Service>;
  selection = new SelectionModel<Service>(true, []);

  constructor(
    private servicesService: ServicesService,
    private matDialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.handleSyncServicesData();
    this.servicesService.stateChanged
      .pipe(
        filter((state: StoreState) => Boolean(state && state.services)),
        pluck('services'),
        untilDestroyed(this)
      )
      .subscribe({
        next: services => {
          this.dataSource = new MatTableDataSource<Service>(services);
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

  handleSyncServicesData(): void {
    this.servicesService.getServiceData();
  }

  handleOpenServiceDialog(service?: Service): void {
    this.matDialog.open(ServiceDialogComponent, {
      width: '680px',
      height: 'auto',
      minHeight: '400px',
      autoFocus: true,
      data: { service }
    });
  }

  handleOpenConfirmDialog(service: Service): void {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '400px',
      height: 'auto',
      data: {
        title: '¿Seguro que deseas eliminar este servicio?',
        body: `"${service.name}"`
      }
    });
    dialogRef.afterClosed().subscribe({
      next: (shouldDelete: boolean) => {
        if (shouldDelete) {
          this.servicesService
            .deleteService(service)
            .then((result: boolean) => this.notificationService.serviceDeleted(result));
        }
      }
    });
  }

  trackByService(index: number, service: Service): string {
    return service.serviceID;
  }

  ngOnDestroy(): void {}
}
