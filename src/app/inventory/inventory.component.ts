import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { InventoryService } from './inventory.service';
import { untilDestroyed } from '@app/core';
import { SelectionModel } from '@angular/cdk/collections';
import { InventoryDialogComponent } from './inventory-dialog/inventory-dialog.component';
import { NotificationService } from '@app/core/notification.service';
import { pluck, filter } from 'rxjs/operators';
import { StoreState } from '@app/core/models/store.model';
import { Resource } from '@app/core/models/resource.model';
import { ConfirmDialogComponent } from '@app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'dzm-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['name', 'categories', 'currentStock', 'min', 'max', 'options'];
  dataSource: MatTableDataSource<Resource>;
  selection = new SelectionModel<Resource>(true, []);

  constructor(
    private inventoryService: InventoryService,
    private matDialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.handleSyncInventoryData();
    this.inventoryService.stateChanged
      .pipe(
        filter((state: StoreState) => Boolean(state && state.resources)),
        pluck('resources'),
        untilDestroyed(this)
      )
      .subscribe({
        next: resources => {
          this.dataSource = new MatTableDataSource<Resource>(resources);
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

  handleSyncInventoryData(): void {
    this.inventoryService.getInventoryData();
  }

  handleOpenInventoryDialog(resource?: Resource): void {
    this.matDialog.open(InventoryDialogComponent, {
      width: '680px',
      height: 'auto',
      minHeight: '400px',
      autoFocus: true,
      data: { resource }
    });
  }

  handleOpenConfirmDialog(resource: Resource): void {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '400px',
      height: 'auto',
      data: {
        title: '¿Seguro que deseas eliminar este item?',
        body: `"${resource.name}"`
      }
    });
    dialogRef.afterClosed().subscribe({
      next: (shouldDelete: boolean) => {
        if (shouldDelete) {
          this.inventoryService
            .deleteResource(resource)
            .then((result: boolean) => this.notificationService.resourceDeleted(result));
        }
      }
    });
  }

  trackByItem(index: number, item: Resource): string {
    return item.resourceID;
  }

  ngOnDestroy(): void {}
}
