import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { ServicesService } from './services.service';
import { Service } from '@app/core/models/service.model';
import { untilDestroyed } from '@app/core';
import { SelectionModel } from '@angular/cdk/collections';
import { ServiceDialogComponent } from './service-dialog/service-dialog.component';

@Component({
  selector: 'dzm-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['select', 'name', 'categories'];
  dataSource: MatTableDataSource<Service>;
  selection = new SelectionModel<Service>(true, []);

  constructor(private servicesService: ServicesService, private matDialog: MatDialog) {}

  ngOnInit(): void {
    this.servicesService
      .fetchServices()
      .pipe(untilDestroyed(this))
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

  handleOpenServiceDialog(service: Service = null): void {
    this.matDialog.open(ServiceDialogComponent, {
      width: '680px',
      height: 'auto',
      minHeight: '400px',
      autoFocus: true,
      data: { service }
    });
  }

  ngOnDestroy(): void {}
}
